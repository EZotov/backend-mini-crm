import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EntityManager, Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {getOffsetAndCheckPaginationParams} from '~/utils';

import {DEAL_AVAILABLE_STATUS} from './consts';
import {CreateDealDto, CreateSLALogDto, UpdateDealDto} from './dto/deal.dto';
import {Deal} from './entities/deal.entity';
import {DealHistory} from './entities/deal-history.entity';
import {DealStatus} from './types';

@Injectable()
export class DealService {
    constructor(
        @InjectRepository(Deal) private readonly dealRepository: Repository<Deal>,
        @InjectRepository(DealHistory) private readonly dealHistoryRepository: Repository<DealHistory>,
    ) {}

    async getList(pageNum: number, pageSize: number) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [deals, total] = await this.dealRepository.findAndCount({
            take: pageSize,
            skip: skipCounts,
            order: DEFAULT_ORDER,
        });

        return {
            deals,
            total,
        };
    }

    async getById(id: string): Promise<Deal> {
        const deal = await this.dealRepository.findOne({where: {id}});

        if (!deal) {
            throw new NotFoundException(`Сделка по ${id} не найдена`);
        }

        return deal;
    }

    async create(dto: CreateDealDto): Promise<string> {
        const result = await this.dealRepository.save(dto);

        return result.id;
    }

    async updateById(id: string, dto: UpdateDealDto): Promise<string> {
        const result = await this.dealRepository.update(id, dto);

        if (!result.affected) {
            throw new NotFoundException(`Сделка по ${id} не найдена для обновления`);
        }

        return id;
    }

    async updateStatusById(id: string, managerId: string, status: DealStatus): Promise<string> {
        return this.dealRepository.manager.transaction(async (entityManager) => {
            const currentDeal = await entityManager.findOne(Deal, {
                where: {id},
                lock: {mode: 'pessimistic_write'},
            });

            if (!currentDeal) {
                throw new NotFoundException(`Сделка не найдена`);
            }

            if (currentDeal.status === status) {
                return id;
            }

            if (!this.isValidStatusTransition(currentDeal.status, status)) {
                throw new BadRequestException(`Невозможный переход из статуса ${currentDeal.status} в ${status}`);
            }

            await entityManager.update(Deal, id, {status});

            await this.createSLALog(
                {
                    managerId,
                    dealId: id,
                    fromStatus: currentDeal.status,
                    toStatus: status,
                },
                entityManager,
            );

            return id;
        });
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.dealRepository.delete(id);

        if (!result.affected) {
            throw new NotFoundException(`Сделка по ${id} не найдена для удаления`);
        }
    }

    async getLogList(pageNum: number, pageSize: number) {
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

    async createSLALog(dto: CreateSLALogDto, entityManager?: EntityManager): Promise<string> {
        const {fromStatus, toStatus, dealId, managerId} = dto;

        let result: DealHistory;

        // Сделать лог в рамках транзакции извне
        if (entityManager) {
            result = await entityManager.save(DealHistory, {
                fromStatus,
                toStatus,
                deal: {id: dealId},
                changedBy: {id: managerId},
            });
        } else {
            result = await this.dealHistoryRepository.save({
                fromStatus,
                toStatus,
                deal: {id: dealId},
                changedBy: {id: managerId},
            });
        }

        return result.id;
    }

    isValidStatusTransition(fromStatus: DealStatus, toStatus: DealStatus) {
        return DEAL_AVAILABLE_STATUS[fromStatus].includes(toStatus);
    }
}
