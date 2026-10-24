import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {compare} from 'bcrypt';
import {Repository} from 'typeorm';

import {loginError} from '@consts/errors';
import {DEFAULT_ORDER, ROLES} from '~/consts';
import {getHashedPassword, getOffsetAndCheckPaginationParams, updateByIdWithRelations} from '~/utils/helpers';

import {LoginRequestDto} from '../../auth/dto/auth.dto';
import {UserListFiltersDto} from '../dto/filters.dto';
import {CreateUserDto, UpdatePasswordDto, UpdateUserDto} from '../dto/user.dto';
import {Role} from '../entities/role.entity';
import {User} from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}
    async getUsersList(pageNum: number, pageSize: number, filters?: UserListFiltersDto) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [users, total] = await this.userRepository.findAndCount({
            take: pageSize,
            skip: skipCounts,
            order: DEFAULT_ORDER,
            relations: {role: true},
            where: {
                role: {
                    title: filters?.role,
                },
            },
        });

        return {
            users,
            total,
        };
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}, relations: {role: true}});

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return user;
    }

    async getUserByCredentials(dto: LoginRequestDto): Promise<User> {
        const {email, password} = dto;

        const user = await this.userRepository.findOne({where: {email}, relations: {role: true}});

        const isPasswordValid = await compare(password, user?.password ?? '');

        if (!user || !isPasswordValid) {
            throw loginError;
        }

        return user;
    }

    async createUser(createDto: CreateUserDto): Promise<string> {
        const {password, confirmPassword, ...dto} = createDto;

        const userRole = await this.roleRepository.findOneBy({
            title: ROLES.USER,
        });

        const hashedPassword = await getHashedPassword(password, confirmPassword);

        const createdUser = await this.userRepository.save({
            ...dto,
            password: hashedPassword,
            role: {id: userRole?.id},
        });

        return createdUser.id;
    }

    async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<string> {
        const {password} = await this.getUserById(userId);

        const isCurrentPasswordCorrect = await compare(dto.currentPassword, password);

        if (!isCurrentPasswordCorrect) {
            throw new BadRequestException('Неверный старый пароль');
        }

        const hashedPassword = await getHashedPassword(dto.newPassword, dto.confirmPassword);
        const result = await this.userRepository.update(userId, {password: hashedPassword});

        if (!result.affected) {
            throw new NotFoundException('Пользователя не существует');
        }

        return userId;
    }

    async updateUserProfile(userId: string, updateDto: UpdateUserDto): Promise<string> {
        const {roleId, ...restDto} = updateDto;

        const result = await updateByIdWithRelations(this.userRepository, User, userId, restDto, {role: roleId});

        if (!result.affected) {
            throw new NotFoundException('Пользователь не найден');
        }

        return userId;
    }

    async removeUserById(id: string): Promise<void> {
        const result = await this.userRepository.softDelete(id);

        if (!result.affected) {
            throw new NotFoundException('Пользователь уже удалён');
        }
    }
}
