import {ApiProperty} from '@nestjs/swagger';

import {CodeType} from '@interfaces/errors.interface';

export class ErrorResponseDto {
    @ApiProperty()
    code: CodeType | null;

    @ApiProperty()
    message: string | null;
}
