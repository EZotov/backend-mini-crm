import {DealStatus} from './types';

export const DEAL_STATUS_ENUM: DealStatus[] = ['INVOICE', 'IN_PROGRESS', 'LOST', 'NEW', 'WON'];

export const DEAL_STATUS: Record<DealStatus, DealStatus> = {
    NEW: 'NEW',
    IN_PROGRESS: 'IN_PROGRESS',
    INVOICE: 'INVOICE',
    LOST: 'LOST',
    WON: 'WON',
};

export const DEAL_AVAILABLE_STATUS: Record<Exclude<DealStatus, 'LOST' | 'WON'>, DealStatus[]> = {
    NEW: ['IN_PROGRESS', 'LOST'],
    IN_PROGRESS: ['INVOICE', 'WON', 'LOST'],
    INVOICE: ['WON', 'LOST', 'IN_PROGRESS'],
};
