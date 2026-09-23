import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DEFAULT_ORDER} from '~/consts';
import {IdResponseDto} from '~/dto';
import {ListResponse} from '~/types';
import {Repository} from 'typeorm';

import {CreateRoleDto} from './dto/role.dto';
import {Role} from './entities/role.entity';
import {User} from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async getRolesList(): Promise<ListResponse<Role>> {
        const [list, total] = await this.roleRepository.findAndCount({order: DEFAULT_ORDER});

        return {
            data: list,
            total,
        };
    }

    async create(createDto: CreateRoleDto): Promise<IdResponseDto> {
        const result = await this.roleRepository.save(createDto);

        return {id: result.id};
    }

    async updateById(id: string, updateDto: CreateRoleDto): Promise<IdResponseDto> {
        const result = await this.roleRepository.update(id, updateDto);

        if (!result.affected) {
            throw new NotFoundException('Роль не найдена');
        }

        return {id};
    }

    async removeById(id: string) {
        const result = await this.roleRepository.delete({id});

        if (!result.affected) {
            throw new NotFoundException('Роль не была найдена для удаления');
        }
    }
}
