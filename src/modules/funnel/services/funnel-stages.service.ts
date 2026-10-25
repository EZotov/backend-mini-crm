import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {And, DataSource, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {updateByIdWithRelations} from '~/utils/helpers';

import {ChangeOrderFunnelStagesDto, CreateFunnelStagesDto, UpdateFunnelStagesDto} from '../dto/funnel-stages.dto';
import {Funnel} from '../entities/funnel.entity';
import {FunnelStage} from '../entities/funnel-stages.entity';

@Injectable()
export class FunnelStagesService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(FunnelStage) private readonly funnelStagesRepository: Repository<FunnelStage>,
    ) {}

    async getList(funnelId: string) {
        const [stages, total] = await this.funnelStagesRepository.findAndCount({
            where: {
                funnel: {id: funnelId},
            },
            order: {
                ...DEFAULT_ORDER,
                order: 'ASC',
            },
            relations: {
                funnel: true,
            },
        });

        return {
            stages,
            total,
        };
    }

    async getById(stageId: string): Promise<FunnelStage> {
        const stage = await this.funnelStagesRepository.findOne({
            where: {id: stageId},
            relations: {
                funnel: true,
            },
        });

        if (!stage) {
            throw new NotFoundException(`Этап воронки не найден`);
        }

        return stage;
    }

    async create(dto: CreateFunnelStagesDto): Promise<string> {
        const {funnelId, ...flatDto} = dto;

        return this.dataSource.transaction(async (transactionalEntityManager) => {
            // Блокируем воронку. Это гарантирует 100% защиту от гонки сессий, даже если воронка пустая.
            await transactionalEntityManager.findOne(Funnel, {
                where: {id: funnelId},
                lock: {mode: 'pessimistic_write'},
            });

            const lastStage = await transactionalEntityManager.findOne(FunnelStage, {
                where: {funnel: {id: funnelId}},
                order: {order: 'DESC'},
            });

            const nextOrder = lastStage ? lastStage.order + 1 : 0;

            // Сохраняем новую стадию с вычисленным order
            const createdStage = await transactionalEntityManager.save(FunnelStage, {
                ...flatDto,
                order: nextOrder,
                funnel: {id: funnelId},
            });

            return createdStage.id;
        });
    }

    async updateById(stageId: string, dto: UpdateFunnelStagesDto): Promise<string> {
        const {funnelId, ...flatDto} = dto;

        const result = await updateByIdWithRelations(this.funnelStagesRepository, FunnelStage, stageId, flatDto, {
            funnel: funnelId,
        });

        if (!result.affected) {
            throw new NotFoundException('Не удалось обновить этап воронки');
        }

        return stageId;
    }

    async changeOrder(stageId: string, dto: ChangeOrderFunnelStagesDto): Promise<void> {
        const {funnelId, sourceIndex, targetIndex} = dto;

        if (sourceIndex === targetIndex) return;

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            if (sourceIndex < targetIndex) {
                await transactionalEntityManager.decrement(
                    FunnelStage,
                    {
                        funnel: {id: funnelId},
                        order: And(MoreThan(sourceIndex), LessThanOrEqual(targetIndex)),
                    },
                    'order',
                    1,
                );
            } else {
                await transactionalEntityManager.increment(
                    FunnelStage,
                    {
                        funnel: {id: funnelId},
                        order: And(MoreThanOrEqual(targetIndex), LessThan(sourceIndex)),
                    },
                    'order',
                    1,
                );
            }

            const updateResult = await transactionalEntityManager.update(FunnelStage, stageId, {
                order: targetIndex,
            });

            if (updateResult.affected === 0) {
                throw new NotFoundException(`Этап воронки с ID ${stageId} не найден`);
            }
        });
    }

    async removeById(stageId: string): Promise<void> {
        const stage = await this.getById(stageId);

        const {
            funnel: {id: funnelId},
            order: removedOrder,
        } = stage;

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // Удаляем саму стадию
            await transactionalEntityManager.delete(FunnelStage, stageId);

            // Уменьшаем order на 1 у всех подходящих записей одной командой
            await transactionalEntityManager.decrement(
                FunnelStage,
                {
                    funnel: {id: funnelId},
                    order: MoreThan(removedOrder),
                },
                'order',
                1,
            );
        });
    }
}
