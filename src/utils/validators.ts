import {REG_EXP} from '@consts/index';

export const isUUID = (value: string): boolean => REG_EXP.UUID.test(value);
