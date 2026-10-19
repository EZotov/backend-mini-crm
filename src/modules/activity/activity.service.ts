import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {updateByIdWithRelations} from '~/utils/helpers';

import {CreateOrUpdateActivityDto} from './dto/activity.dto';
import {Activity} from './entities/activity.entity';
import type {GroupedActivityEntities} from './types';

@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity) private readonly activityRepository: Repository<Activity>) {}

    async getAllByDeal(dealId: string, groupeInStatus = false) {
        const [activities, total] = await this.activityRepository.findAndCount({
            where: {deal: {id: dealId}},
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

    async create(userId: string, dto: CreateOrUpdateActivityDto) {
        const {dealId, assignedId, ...restDto} = dto;

        const activity = await this.activityRepository.save({
            ...restDto,
            assigned: {id: assignedId},
            deal: {id: dealId},
            createdBy: {id: userId},
        });

        return activity.id;
    }

    async updateById(id: string, dto: CreateOrUpdateActivityDto): Promise<string> {
        const {assignedId, dealId, ...flatFields} = dto;

        const result = await updateByIdWithRelations(this.activityRepository, Activity, id, flatFields, {
            deal: dealId,
            assigned: assignedId,
        });

        if (!result.affected) {
            throw new NotFoundException(`Активность с ID ${id} не найдена`);
        }

        return id;
    }

    async removeById(activityId: string): Promise<void> {
        const result = await this.activityRepository.delete(activityId);

        if (!result.affected) {
            throw new NotFoundException('');
        }
    }
}
