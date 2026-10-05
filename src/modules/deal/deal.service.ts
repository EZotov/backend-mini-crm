import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {IdResponseDto} from '@dto/index';

import {Deal} from './entities/deal.entity';

@Injectable()
export class DealService {
    constructor(@InjectRepository(Deal) private readonly dealRepository: Repository<Deal>) {}

    getList(pageNum: number, pageSize: number) {
        return 'Not implemented';
    }

    getById(id: string): Promise<Deal> {
        return 'Not implemented';
    }

    create(): Promise<IdResponseDto> {
        return 'Not implemented';
    }

    updateById(): Promise<IdResponseDto> {
        return 'Not implemented';
    }

    deleteById(): Promise<void> {
        return 'Not implemented';
    }

    addSLALog() {
        return 'Not implemented';
    }
}
