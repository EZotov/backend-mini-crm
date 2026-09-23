import {FindOptionsOrder} from 'typeorm';

export const DEFAULT_ORDER: FindOptionsOrder<unknown> = {createdAt: 'DESC'};

export const PAGE_SIZES = [25, 50, 100];
