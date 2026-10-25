import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';

import {CreateOrUpdateRoleDto} from '../dto/role.dto';
import {Role} from '../entities/role.entity';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

    // Roles
    async getList() {
        const [list, total] = await this.roleRepository.findAndCount({order: DEFAULT_ORDER});

        return {
            list,
            total,
        };
    }

    async create(createDto: CreateOrUpdateRoleDto): Promise<string> {
        const result = await this.roleRepository.save(createDto);

        return result.id;
    }

    async updateById(id: string, updateDto: CreateOrUpdateRoleDto): Promise<string> {
        const result = await this.roleRepository.update(id, updateDto);

        if (!result.affected) {
            throw new NotFoundException(`Не удалось обновить данные роли с ID ${id} или она не была найдена`);
        }

        return id;
    }

    async removeById(id: string): Promise<void> {
        const result = await this.roleRepository.delete({id});

        if (!result.affected) {
            throw new NotFoundException(`Роль с ID ${id} не была найдена для удаления`);
        }
    }
}
