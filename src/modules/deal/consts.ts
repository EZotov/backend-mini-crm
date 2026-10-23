import {DealStatus, FunnelStageType} from './types';

export const DEAL_STATUS_ENUM: DealStatus[] = ['NEW', 'IN_PROGRESS', 'CLOSE', 'REOPEN'];

export const DEAL_STATUS: Record<DealStatus, DealStatus> = {
    NEW: 'NEW',
    IN_PROGRESS: 'IN_PROGRESS',
    CLOSE: 'CLOSE',
    REOPEN: 'REOPEN',
};

export const DEAL_AVAILABLE_STATUS: Record<DealStatus, DealStatus[]> = {
    NEW: ['IN_PROGRESS'],
    IN_PROGRESS: ['CLOSE'],
    CLOSE: ['REOPEN'],
    REOPEN: ['IN_PROGRESS'],
};

export const FUNNEL_STAGE_TYPE_ENUM: FunnelStageType[] = ['IN_PROGRESS', 'WON', 'LOST'];

export const FUNNEL_STAGE_TYPE: Record<FunnelStageType, FunnelStageType> = {
    IN_PROGRESS: 'IN_PROGRESS',
    WON: 'WON',
    LOST: 'LOST',
};
