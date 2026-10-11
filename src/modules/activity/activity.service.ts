import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {CreateOrUpdateActivityDto} from './dto/activity.dto';
import {Activity} from './entities/activity.entity';

@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity) private readonly activityRepository: Repository<Activity>) {}

    async getAllByDeal(dealId: string, groupeResult = false) {
        if (groupeResult) {
            const deals = await this.activityRepository.query<unknown>(
                `
                    SELECT 
                        id,
                        type,
                        description,
                        dueDate,
                        isCompleted,
                        deal,
                        manager,
                        COUNT(*) AS "count"
                    FROM activity
                    WHERE "dealId" = $1
                    GROUP BY isCompleted
                    ORDER BY "count" DESC;
                `,
                [dealId],
            );

            return deals;
        }

        const [deals] = await this.activityRepository.findAndCount({
            where: {deal: {id: dealId}},
            order: {updatedAt: 'DESC'},
            relations: {
                deal: true,
                manager: true,
            },
        });

        return deals;
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
