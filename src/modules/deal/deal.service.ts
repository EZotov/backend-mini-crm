import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/index';
import {getOffsetAndCheckPaginationParams} from '~/utils';

import {CreateDealDto, UpdateDealDto} from './dto/deal.dto';
import {Deal} from './entities/deal.entity';

@Injectable()
export class DealService {
    constructor(@InjectRepository(Deal) private readonly dealRepository: Repository<Deal>) {}

    async getList(pageNum: number, pageSize: number): Promise<CollectionResponseDto<Deal>> {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [deals, total] = await this.dealRepository.findAndCount({
            take: pageSize,
            skip: skipCounts,
            order: DEFAULT_ORDER,
        });

        return {
            data: deals,
            total,
        };
    }

    async getById(id: string): Promise<ResponseDto<Deal>> {
        const deal = await this.dealRepository.findOne({where: {id}});

        if (!deal) {
            throw new NotFoundException(`Сделка по ${id} не найдена`);
        }

        return {data: deal};
    }

    async create(dto: CreateDealDto): Promise<ResponseDto<CreateResponseDto>> {
        const result = await this.dealRepository.save({...dto});

        return {data: {id: result.id}};
    }

    async updateById(id: string, dto: UpdateDealDto): Promise<ResponseDto<CreateResponseDto>> {
        const result = await this.dealRepository.update(id, dto);

        if (!result.affected) {
            throw new NotFoundException(`Сделка по ${id} не найдена для обновления`);
        }

        return {data: {id}};
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.dealRepository.delete(id);

        if (!result.affected) {
            throw new NotFoundException(`Сделка по ${id} не найдена для удаления`);
        }
    }

    addSLALog() {
        return {data: 'Not implemented'};
    }
}
