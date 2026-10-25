import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {getFullName, getOffsetAndCheckPaginationParams, updateByIdWithRelations} from '~/utils/helpers';

import {UserService} from '../../user/services/user.service';
import {DEAL_AVAILABLE_STATUS, DEAL_STATUS} from '../consts';
import {CreateOrUpdateDealDto} from '../dto/deal.dto';
import {DealListFiltersDto} from '../dto/filters.dto';
import {Deal} from '../entities/deal.entity';
import {SlaLog} from '../entities/sla.entity';
import {DealStatus} from '../types';
import {DealHistoryService} from './deal-history.service';

@Injectable()
export class DealService {
    constructor(
        @InjectRepository(Deal) private readonly dealRepository: Repository<Deal>,
        private readonly dealHistoryService: DealHistoryService,
        private readonly userService: UserService,
    ) {}

    async getList(pageNum: number, pageSize: number, filters?: DealListFiltersDto) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [deals, total] = await this.dealRepository.findAndCount({
            take: pageSize,
            skip: skipCounts,
            order: DEFAULT_ORDER,
            relations: {
                customer: true,
                currentFunnelStage: {
                    funnel: true,
                },
                manager: {
                    role: true,
                },
                createdBy: {
                    role: true,
                },
            },
            where: {
                manager: {id: filters?.managerId},
                createdBy: {id: filters?.createdById},
                customer: {id: filters?.customerId},
                status: filters?.status,
            },
        });

        return {
            deals,
            total,
        };
    }

    async getById(id: string): Promise<Deal> {
        const deal = await this.dealRepository.findOne({
            where: {id},
            relations: {
                customer: true,
                currentFunnelStage: {
                    funnel: true,
                },
                manager: {
                    role: true,
                },
                createdBy: {
                    role: true,
                },
            },
        });

        if (!deal) {
            throw new NotFoundException(`Сделка с ID ${id} не найдена`);
        }

        return deal;
    }

    async create(userId: string, dto: CreateOrUpdateDealDto): Promise<string> {
        const {managerId, customerId, ...restDto} = dto;

        const result = await this.dealRepository.save({
            ...restDto,
            manager: {id: managerId},
            customer: {id: customerId},
            createdBy: {id: userId},
            slaDeadline: new Date(new Date().getTime() + 30 * 60 * 1000),
        });

        const createdBy = await this.userService.getUserById(userId);

        this.dealHistoryService.createHistoryLog({
            dealId: result.id,
            changedById: userId,
            changedByFullname: getFullName({
                firstName: createdBy.firstName,
                lastName: createdBy.lastName,
                patronymic: createdBy.patronymic,
            }),
            actionDescription: `Создана новая сделка "${result.title}"`,
        });

        return result.id;
    }

    async updateById(userId: string, dealId: string, dto: CreateOrUpdateDealDto): Promise<string> {
        const {customerId, managerId, ...flatDto} = dto;

        const result = await updateByIdWithRelations(this.dealRepository, Deal, dealId, flatDto, {
            manager: managerId,
            customer: customerId,
        });

        if (!result.affected) {
            throw new NotFoundException(`Не удалось обновить данные сделки с ID ${dealId} или она не была найдена`);
        }

        const updatedBy = await this.userService.getUserById(userId);

        this.dealHistoryService.createHistoryLog({
            dealId,
            changedById: userId,
            changedByFullname: getFullName({
                firstName: updatedBy.firstName,
                lastName: updatedBy.lastName,
                patronymic: updatedBy.patronymic,
            }),
            actionDescription: `Обновлены данные по сделке ${dealId} с текущим названием "${dto.title}"`,
        });

        return dealId;
    }

    async updateStatusById(id: string, currentUserid: string, status: DealStatus): Promise<string> {
        const changedByUser = await this.userService.getUserById(currentUserid);

        return this.dealRepository.manager.transaction(async (entityManager) => {
            const currentDeal = await entityManager.findOne(Deal, {
                where: {id},
                lock: {mode: 'pessimistic_write'},
                relations: {
                    manager: true,
                },
            });

            if (!currentDeal) {
                throw new NotFoundException(`Сделка с ${id} не найдена`);
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
                await entityManager.save(SlaLog, {
                    deal: {id: currentDeal.id},
                    managerId: currentDeal.manager.id,
                    managerFullname: getFullName({
                        firstName: currentDeal.manager.firstName,
                        lastName: currentDeal.manager.lastName,
                        patronymic: currentDeal.manager.patronymic,
                    }),
                    minutesOverdue: overdueMinutes,
                });

                // TODO: Вызвать NotificationService
            }

            // Обновляем статус сделки
            await entityManager.update(Deal, id, {status, isSlaViolated});

            // Пишем лог в историю
            await this.dealHistoryService.createHistoryLog(
                {
                    changedById: currentUserid,
                    changedByFullname: getFullName({
                        firstName: changedByUser.firstName,
                        lastName: changedByUser.lastName,
                        patronymic: changedByUser.patronymic,
                    }),
                    dealId: id,
                    actionDescription: `Смена статуса сделки с ${currentDeal.status} на ${status}`,
                },
                entityManager,
            );

            return id;
        });
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.dealRepository.delete(id);

        if (!result.affected) {
            throw new NotFoundException(`Не удалось удалить сделку с ID ${id} или она не была найдена`);
        }
    }

    isValidStatusTransition(fromStatus: DealStatus, toStatus: DealStatus) {
        return DEAL_AVAILABLE_STATUS[fromStatus].includes(toStatus);
    }
}
