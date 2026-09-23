import {BadRequestException} from '@nestjs/common';
import {PAGE_SIZES} from '~/consts';

export const isUUID = (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};

export const getOffsetAndCheckPaginationParams = (pageNum: number, pageSize: number) => {
    if (!PAGE_SIZES.includes(pageSize) || pageNum < 1) {
        throw new BadRequestException('Параметры пагинации неверны');
    }

    return (pageNum - 1) * pageSize;
};
