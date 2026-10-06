import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {CreateResponseDto} from '@dto/index';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CompanyService} from './company.service';
import {CreateCompanyDto} from './dto/company.dto';
import {Company} from './entities/company.entity';

@ApiTags('Компании')
@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @ApiOperation({summary: 'Получить список компаний'})
    @ApiOkModifyResponse(Company, {isArray: true})
    @Get()
    getAll(@Query('pageNum', ParseIntPipe) pageNum: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.companyService.getList(pageNum, pageSize);
    }

    @ApiOperation({summary: 'Получить компанию'})
    @ApiOkModifyResponse(Company)
    @Get(':id')
    get(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.companyService.getById(id);
    }

    @ApiOperation({summary: 'Создать новую компанию'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    create(@Body() dto: CreateCompanyDto) {
        return this.companyService.create(dto);
    }

    @ApiOperation({summary: 'Обновить информацию о компании'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    update(@Param('id', ParseUUIDModifyPipe) id: string, @Body() dto: CreateCompanyDto) {
        return this.companyService.updateById(id, dto);
    }

    @ApiOperation({summary: 'Удалить компанию'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string) {
        this.companyService.deleteById(id);
    }
}
