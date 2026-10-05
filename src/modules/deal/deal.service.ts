import {Injectable} from '@nestjs/common';
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
        return {data: {} as Deal};
    }

    create(dto: CreateDealDto): Promise<CreateResponseDto> {
        return {data: 'Not implemented'};
    }

    async updateById(id: string, dto: UpdateDealDto): Promise<ResponseDto<CreateResponseDto>> {
        return {data: 'Not implemented'};
    }

    deleteById(id: string): Promise<void> {
        return {data: 'Not implemented'};
    }

    addSLALog() {
        return {data: 'Not implemented'};
    }
}
