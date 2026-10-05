import {ActivityType} from './types';

export const ACTIVITY_ENUM: ActivityType[] = ['CALL', 'EMAIL', 'MEETING', 'TELEGRAM'];

export const ACTIVITY_TYPE: Record<ActivityType, ActivityType> = {
    CALL: 'CALL',
    EMAIL: 'EMAIL',
    MEETING: 'MEETING',
    TELEGRAM: 'TELEGRAM',
};
