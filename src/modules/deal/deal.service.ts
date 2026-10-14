import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EntityManager, Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {getOffsetAndCheckPaginationParams} from '~/utils';

import {DEAL_AVAILABLE_STATUS, DEAL_STATUS} from './consts';
import {CreateDealDto, CreateDealHistoryLogDto} from './dto/deal.dto';
import {Deal} from './entities/deal.entity';
import {DealHistory} from './entities/deal-history.entity';
import {SlaLog} from './entities/sla.entity';
import {DealStatus} from './types';

@Injectable()
export class DealService {
    constructor(
        @InjectRepository(Deal) private readonly dealRepository: Repository<Deal>,
        @InjectRepository(DealHistory) private readonly dealHistoryRepository: Repository<DealHistory>,
        @InjectRepository(SlaLog) private readonly dealSLALogRepository: Repository<SlaLog>,
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

    async create(userId: string, dto: CreateDealDto): Promise<string> {
        const result = await this.dealRepository.save({
            ...dto,
            createdBy: {id: userId},
            slaDeadline: new Date(new Date().getTime() + 30 * 60 * 1000),
        });

        return result.id;
    }

    async updateById(id: string, dto: CreateDealDto): Promise<string> {
        const result = await this.dealRepository.update(id, dto);

        if (!result.affected) {
            throw new NotFoundException(`Сделка по ${id} не найдена для обновления`);
        }

        return id;
    }

    async updateStatusById(id: string, createdById: string, status: DealStatus): Promise<string> {
        return this.dealRepository.manager.transaction(async (entityManager) => {
            const currentDeal = await entityManager.findOne(Deal, {
                where: {id},
                lock: {mode: 'pessimistic_write'},
            });

            if (!currentDeal) {
                throw new NotFoundException(`Сделка не найдена`);
            }

            if (!this.isValidStatusTransition(currentDeal.status, status)) {
                throw new BadRequestException(`Невозможный переход из статуса ${currentDeal.status} в ${status}`);
            }

            let isSlaViolated: boolean = false;

            // Отслеживаем SLA при смене NEW на IN_PROGRESS статуса
            if (
                currentDeal.status === DEAL_STATUS.NEW &&
                status === DEAL_STATUS.IN_PROGRESS &&
                new Date() > currentDeal.slaDeadline
            ) {
                const now = new Date();

                isSlaViolated = true;

                const timeDiffMs = now.getTime() - currentDeal.slaDeadline.getTime();
                const overdueMinutes = Math.floor(timeDiffMs / (1000 * 60));

                // Создаём SLA Log
                await this.dealSLALogRepository.save({
                    deal: {id: currentDeal.id},
                    manager: {id: currentDeal.manager.id},
                    minutesOverdue: overdueMinutes,
                });

                // TODO: Вызвать NotificationService
            }

            // Обновляем статус сделки
            await entityManager.update(Deal, id, {status, isSlaViolated});

            // Пишем лог в историю
            await this.createHistoryLog(
                {
                    createdById,
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

    async getHistoryLogList(pageNum: number, pageSize: number) {
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
        const {fromStatus, toStatus, dealId, createdById} = dto;

        let result: DealHistory;

        // Сделать лог в рамках транзакции извне
        if (entityManager) {
            result = await entityManager.save(DealHistory, {
                fromStatus,
                toStatus,
                deal: {id: dealId},
                changedBy: {id: createdById},
            });
        } else {
            result = await this.dealHistoryRepository.save({
                fromStatus,
                toStatus,
                deal: {id: dealId},
                changedBy: {id: createdById},
            });
        }

        return result.id;
    }

    isValidStatusTransition(fromStatus: DealStatus, toStatus: DealStatus) {
        return DEAL_AVAILABLE_STATUS[fromStatus].includes(toStatus);
    }
}
