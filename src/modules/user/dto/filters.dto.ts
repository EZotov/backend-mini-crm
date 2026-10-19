import {ApiProperty} from '@nestjs/swagger';

export class UserListFiltersDto {
    @ApiProperty({required: false, example: 'ADMIN'})
    role?: string;
}
