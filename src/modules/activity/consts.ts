import {ActivityStatus, ActivityType} from './types';

export const ACTIVITY_ENUM: ActivityType[] = ['CALL', 'EMAIL', 'MEETING', 'TELEGRAM'];
export const ACTIVITY_STATUS_ENUM: ActivityStatus[] = ['NEW', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELED'];

export const ACTIVITY_TYPE: Record<ActivityType, ActivityType> = {
    CALL: 'CALL',
    EMAIL: 'EMAIL',
    MEETING: 'MEETING',
    TELEGRAM: 'TELEGRAM',
};

export const ACTIVITY_STATUS: Record<ActivityStatus, ActivityStatus> = {
    NEW: 'NEW',
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    CANCELED: 'CANCELED',
};
