import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';

import {CreateFunnelDto, UpdateFunnelDto} from '../dto/funnel.dto';
import {Funnel} from '../entities/funnel.entity';

@Injectable()
export class FunnelService {
    constructor(@InjectRepository(Funnel) private readonly funnelRepository: Repository<Funnel>) {}

    async getList() {
        const [funnels, total] = await this.funnelRepository.findAndCount({
            order: DEFAULT_ORDER,
        });

        return {
            funnels,
            total,
        };
    }

    async getById(id: string): Promise<Funnel> {
        const funnel = await this.funnelRepository.findOne({where: {id}});

        if (!funnel) {
            throw new NotFoundException(`Воронка с ID ${id} не найдена`);
        }

        return funnel;
    }

    async create(dto: CreateFunnelDto): Promise<string> {
        const createdFunnel = await this.funnelRepository.save(dto);

        return createdFunnel.id;
    }

    async updateById(id: string, dto: UpdateFunnelDto): Promise<string> {
        const result = await this.funnelRepository.update(id, dto);

        if (!result.affected) {
            throw new NotFoundException(`Не удалось обновить данные воронки с ID ${id} или она не была найдена`);
        }

        return id;
    }

    async removeById(id: string): Promise<void> {
        const result = await this.funnelRepository.delete(id);

        if (!result.affected) {
            throw new NotFoundException(`Не удалось удалить воронку с ID ${id} или она не была найдена`);
        }
    }
}
