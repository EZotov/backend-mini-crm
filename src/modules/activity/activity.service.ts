import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {getFullName, updateByIdWithRelations} from '~/utils/helpers';

import {DealHistoryService} from '../deal/services/deal-history.service';
import {UserService} from '../user/services/user.service';
import {CreateActivityDto, UpdateActivityDto} from './dto/activity.dto';
import {ActivityListFiltersDto} from './dto/filters.dto';
import {Activity} from './entities/activity.entity';
import type {GroupedActivityEntities} from './types';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity) private readonly activityRepository: Repository<Activity>,
        private readonly dealHistoryService: DealHistoryService,
        private readonly userService: UserService,
    ) {}

    async getList(groupeInStatus = false, filters?: ActivityListFiltersDto) {
        const [activities, total] = await this.activityRepository.findAndCount({
            where: {
                deal: {id: filters?.dealId},
                createdBy: {id: filters?.createdById},
                assigned: {id: filters?.assignedId},
                status: filters?.status,
            },
            order: {updatedAt: 'DESC'},
            relations: {
                deal: {
                    createdBy: {
                        role: true,
                    },
                    customer: true,
                },
                createdBy: {
                    role: true,
                },
            },
        });

        if (groupeInStatus) {
            const groupedActivities = activities.reduce(
                (acc, item) => {
                    if (!acc[item.status]) {
                        acc[item.status] = {
                            status: item.status,
                            count: 0,
                            activities: [],
                        };
                    }

                    acc[item.status].activities.push(item);
                    acc[item.status].count++;

                    return acc;
                },
                {} as Record<string, GroupedActivityEntities>,
            );

            return {activities: Object.values(groupedActivities).sort((a, b) => b.count - a.count), total};
        }

        return {activities, total};
    }

    async create(userId: string, dto: CreateActivityDto): Promise<string> {
        const {dealId, assignedId, ...restDto} = dto;

        const activity = await this.activityRepository.save({
            ...restDto,
            assigned: assignedId ? {id: assignedId} : undefined,
            deal: dealId ? {id: dealId} : undefined,
            createdBy: {id: userId},
        });

        const createdBy = await this.userService.getUserById(userId);

        if (dealId) {
            this.dealHistoryService.createHistoryLog({
                dealId,
                changedById: userId,
                changedByFullname: getFullName({
                    firstName: createdBy.firstName,
                    lastName: createdBy.lastName,
                    patronymic: createdBy.patronymic,
                }),
                actionDescription: `Создана новая задача "${activity.title}" для сделки "${activity.deal.title}"`,
            });
        }

        return activity.id;
    }

    async updateById(userId: string, activityId: string, dto: UpdateActivityDto): Promise<string> {
        const {assignedId, dealId, ...flatFields} = dto;

        const result = await updateByIdWithRelations(this.activityRepository, Activity, activityId, flatFields, {
            deal: dealId,
            assigned: assignedId,
        });

        if (!result.affected) {
            throw new NotFoundException(`Не удалось обновить данные задачи с ID ${activityId} или она не была найдена`);
        }

        const updatedBy = await this.userService.getUserById(userId);

        if (dealId) {
            this.dealHistoryService.createHistoryLog({
                dealId,
                changedById: userId,
                changedByFullname: getFullName({
                    firstName: updatedBy.firstName,
                    lastName: updatedBy.lastName,
                    patronymic: updatedBy.patronymic,
                }),
                actionDescription: `Обновлены сведения задачи ${activityId} с текущим названием "${dto.title}"`,
            });
        }

        return activityId;
    }

    async removeById(activityId: string): Promise<void> {
        const result = await this.activityRepository.delete(activityId);

        if (!result.affected) {
            throw new NotFoundException(`Не удалось удалить задачу с ID ${activityId} или она не была найдена`);
        }
    }
}
