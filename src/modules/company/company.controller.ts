import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CompanyService} from './company.service';
import {CreateCompanyDto} from './dto/company.dto';
import {Company} from './entities/company.entity';

@ApiTags('Компании')
@AuthProtected()
@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @ApiOperation({summary: 'Получить список компаний'})
    @ApiOkModifyResponse(Company, {isArray: true})
    @Get()
    async getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CollectionResponseDto<Company>> {
        const {companies, total} = await this.companyService.getList(pageNum, pageSize);

        return {
            data: companies,
            total,
        };
    }

    @ApiOperation({summary: 'Получить компанию'})
    @ApiOkModifyResponse(Company)
    @Get(':id')
    async get(@Param('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<Company>> {
        const company = await this.companyService.getById(id);

        return new ResponseDto({data: company});
    }

    @ApiOperation({summary: 'Создать новую компанию'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(
        @UserTokenData('id') userId: string,
        @Body() dto: CreateCompanyDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.companyService.create(userId, dto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Обновить информацию о компании'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: CreateCompanyDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.companyService.updateById(id, dto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить компанию'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.companyService.deleteById(id);
    }
}
