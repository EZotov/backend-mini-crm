import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

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

    async create(dto: CreateOrUpdateActivityDto) {
        const activity = await this.activityRepository.save(dto);

        return activity.id;
    }

    async updateById(activityId: string, dto: CreateOrUpdateActivityDto): Promise<string> {
        const result = await this.activityRepository.update(activityId, dto);

        if (!result.affected) {
            throw new NotFoundException('');
        }

        return activityId;
    }

    async removeById(activityId: string): Promise<void> {
        const result = await this.activityRepository.delete(activityId);

        if (!result.affected) {
            throw new NotFoundException('');
        }
    }
}
