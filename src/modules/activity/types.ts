import type {Activity} from './entities/activity.entity';

export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'TELEGRAM';
export type ActivityStatus = 'NEW' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';

export class GroupedActivityEntities {
    status: ActivityStatus;
    count: number;
    activities: Activity[];
}
