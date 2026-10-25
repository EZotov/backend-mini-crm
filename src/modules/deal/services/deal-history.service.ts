import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EntityManager, Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {getOffsetAndCheckPaginationParams} from '~/utils/helpers';

import {CreateDealHistoryLogDto} from '../dto/deal.dto';
import {DealHistory} from '../entities/deal-history.entity';

@Injectable()
export class DealHistoryService {
    constructor(@InjectRepository(DealHistory) private readonly dealHistoryRepository: Repository<DealHistory>) {}

    async getDealHistoryList(pageNum: number, pageSize: number) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [logs, total] = await this.dealHistoryRepository.findAndCount({
            take: pageNum,
            skip: skipCounts,
            order: DEFAULT_ORDER,
        });

        return {
            logs,
            total,
        };
    }

    async createHistoryLog(dto: CreateDealHistoryLogDto, entityManager?: EntityManager): Promise<string> {
        const {actionDescription, dealId, changedByFullname, changedById} = dto;

        let result: DealHistory;

        // Сделать лог в рамках транзакции извне
        if (entityManager) {
            result = await entityManager.save(DealHistory, {
                actionDescription,
                deal: {id: dealId},
                changedByFullname,
                changedById,
            });
        } else {
            result = await this.dealHistoryRepository.save({
                actionDescription,
                changedByFullname,
                changedById,
            });
        }

        return result.id;
    }
}
