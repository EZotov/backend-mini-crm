import {applyDecorators, Type} from '@nestjs/common';
import {HttpStatus} from '@nestjs/common/enums';
import {ApiExtraModels, ApiOkResponse, ApiResponse, getSchemaPath} from '@nestjs/swagger';
import {SchemaObject} from 'node_modules/@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import {ErrorResponseDto} from '@dto/errors.dto';

type ErrorType = {
    statusCode?: HttpStatus;
    dto: Type<unknown>;
};

interface ResponseOptions {
    /**
     * Определение, что параметр ответа dto является массивом
     */
    isArray?: boolean;
    /**
     * Определение nullable вместо undefined модели (Для GET-запросов)
     */
    isNullable?: boolean;
    /**
     * Включает отображение dto ошибки в спецификации
     */
    addError?: boolean;
    /**
     * Кастомные errorDto
     */
    errorDto?: ErrorType;
}

const getSchema = (dto: Type<unknown> | undefined, options: ResponseOptions | undefined): SchemaObject => {
    if (!dto) {
        return {type: 'object'};
    }

    const result = options?.isArray ? {type: 'array', items: {$ref: getSchemaPath(dto)}} : {$ref: getSchemaPath(dto)};

    // Базовые обязательные поля
    const requiredFields = ['data'];
    const properties: Record<string, SchemaObject> = {
        data: result,
    };

    // Если это массив, динамически добавляем пагинацию
    if (options?.isArray) {
        properties.total = {
            type: 'number',
            example: 0,
            description: 'Общее количество записей',
        };
        requiredFields.push('total');
    }

    const schema: SchemaObject = {
        type: 'object',
        properties,
        required: requiredFields,
    };

    // Если объект может быть null, согласно спецификации OpenAPI безопаснее оборачивать через allOf
    return options?.isNullable ? {allOf: [schema], nullable: true} : schema;
};

export const ApiOkModifyResponse = (dto?: Type<unknown>, options?: ResponseOptions) => {
    const models = [ErrorResponseDto];

    if (dto) {
        models.push(dto as Type);
    }

    if (options?.errorDto?.dto) {
        models.push(options.errorDto.dto as Type);
    }

    const decorators = [ApiExtraModels(...models), ApiOkResponse({schema: getSchema(dto, options)})];

    if (options?.addError) {
        decorators.push(
            ApiResponse({
                status: options?.errorDto?.statusCode ?? HttpStatus.BAD_REQUEST,
                schema: {
                    $ref: getSchemaPath(options?.errorDto?.dto ?? ErrorResponseDto),
                },
            }),
        );
    }

    return applyDecorators(...decorators);
};
