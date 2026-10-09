import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {compare, hash} from 'bcrypt';
import {Repository} from 'typeorm';

import {loginError} from '@consts/errors';
import {DEFAULT_ORDER, PASSWORD_SALT} from '~/consts';
import {getOffsetAndCheckPaginationParams} from '~/utils';

import {LoginRequestDto} from '../auth/dto/auth.dto';
import {CreateRoleDto} from './dto/role.dto';
import {CreateUserDto, UpdatePasswordDto, UpdateUserDto} from './dto/user.dto';
import {Role} from './entities/role.entity';
import {User} from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}
    // User
    async getUsersList(pageNum: number, pageSize: number) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [users, total] = await this.userRepository.findAndCount({
            take: pageSize,
            skip: skipCounts,
            order: DEFAULT_ORDER,
            relations: {role: true},
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

        if (!password || !confirmPassword) {
            throw new BadRequestException('Один или оба пароля пусты');
        }

        if (password !== confirmPassword) {
            throw new BadRequestException('Пароли не совпадают');
        }

        const hashedPassword = await hash(password, PASSWORD_SALT);

        const createdUser = await this.userRepository.save({...dto, password: hashedPassword});

        return createdUser.id;
    }

    async updatePassword(userId: string, dto: UpdatePasswordDto) {
        if (!dto.newPassword || !dto.confirmPassword) {
            throw new BadRequestException('Один или оба пароля пусты');
        }

        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException('Пароли не совпадают');
        }

        const hashedPassword = await hash(dto.newPassword, PASSWORD_SALT);

        const result = await this.userRepository.update(userId, {password: hashedPassword});

        if (!result.affected) {
            throw new NotFoundException('Пользователя не существует');
        }
    }

    async updateUserProfile(userId: string, updateDto: UpdateUserDto): Promise<string> {
        const result = await this.userRepository.update(userId, updateDto);

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

    // Roles
    async getRolesList() {
        const [list, total] = await this.roleRepository.findAndCount({order: DEFAULT_ORDER});

        return {
            list,
            total,
        };
    }

    async createRole(createDto: CreateRoleDto): Promise<string> {
        const result = await this.roleRepository.save(createDto);

        return result.id;
    }

    async updateRoleById(id: string, updateDto: CreateRoleDto): Promise<string> {
        const result = await this.roleRepository.update(id, updateDto);

        if (!result.affected) {
            throw new NotFoundException('Роль не найдена');
        }

        return id;
    }

    async removeRoleById(id: string): Promise<void> {
        const result = await this.roleRepository.delete({id});

        if (!result.affected) {
            throw new NotFoundException('Роль не была найдена для удаления');
        }
    }
}
