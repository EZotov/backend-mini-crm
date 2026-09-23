import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DEFAULT_ORDER, PASSWORD_SALT} from '~/consts';
import {IdResponseDto} from '~/dto';
import {ListResponse} from '~/types';
import {getOffsetAndCheckPaginationParams, isUUID} from '~/utils';
import {hash} from 'bcrypt';
import {Repository} from 'typeorm';

import {CreateRoleDto} from './dto/role.dto';
import {CreateUserDto, UpdateUserDto} from './dto/user.dto';
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
        });

        return {
            data: users,
            total,
        };
    }

    async getUserById(id: string) {
        // TODO: Перенести чек параметров в мидлвар-декоратор
        if (!isUUID(id)) {
            throw new BadRequestException('Передан некорректный формат UUID');
        }

        const user = await this.userRepository.findOneBy({id});

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return user;
    }

    async createUser(createDto: CreateUserDto): Promise<User> {
        const {password} = createDto;

        const hashedPassword = await hash(password, PASSWORD_SALT);
        const createdUser = await this.userRepository.save({...createDto, password: hashedPassword});

        return createdUser;
    }

    // TODO: завести метод обновления пароля

    async updateUserProfile(userId: string, updateDto: UpdateUserDto): Promise<IdResponseDto> {
        const result = await this.userRepository.update(userId, updateDto);

        if (!result.affected) {
            throw new NotFoundException('Пользователь не найден');
        }

        return {id: userId};
    }

    async removeUserById(id: string): Promise<void> {
        const result = await this.userRepository.softDelete(id);

        if (!result.affected) {
            throw new NotFoundException('Пользователь уже удалён');
        }
    }

    // Roles
    async getRolesList(): Promise<ListResponse<Role>> {
        const [list, total] = await this.roleRepository.findAndCount({order: DEFAULT_ORDER});

        return {
            data: list,
            total,
        };
    }

    async createRole(createDto: CreateRoleDto): Promise<IdResponseDto> {
        const result = await this.roleRepository.save(createDto);

        return {id: result.id};
    }

    async updateRoleById(id: string, updateDto: CreateRoleDto): Promise<IdResponseDto> {
        const result = await this.roleRepository.update(id, updateDto);

        if (!result.affected) {
            throw new NotFoundException('Роль не найдена');
        }

        return {id};
    }

    async removeRoleById(id: string) {
        const result = await this.roleRepository.delete({id});

        if (!result.affected) {
            throw new NotFoundException('Роль не была найдена для удаления');
        }
    }
}
