import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '@consts/index';
import {IdResponseDto} from '@dto/index';
import {getOffsetAndCheckPaginationParams} from '~/utils';

import {CreateCompanyDto} from './dto/company.dto';
import {Company} from './entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(@InjectRepository(Company) private readonly companyRepository: Repository<Company>) {}

    async getList(pageNum: number, pageSize: number) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [companies, total] = await this.companyRepository.findAndCount({
            take: pageSize,
            skip: skipCounts,
            order: DEFAULT_ORDER,
        });

        return {
            data: companies,
            total,
        };
    }

    async getById(id: string): Promise<Company> {
        const company = await this.companyRepository.findOne({where: {id}});

        if (!company) {
            throw new NotFoundException(`Компания с ID ${id} не найдена`);
        }

        return company;
    }

    create(dto: CreateCompanyDto): Promise<IdResponseDto> {
        return this.companyRepository.save(dto);
    }

    async updateById(id: string, dto: CreateCompanyDto): Promise<IdResponseDto> {
        const result = await this.companyRepository.update(id, dto);

        if (!result.affected) {
            throw new NotFoundException(`Компания с ID ${id} не найдена для обновления`);
        }

        return {id};
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.companyRepository.delete(id);

        if (!result.affected) {
            throw new NotFoundException(`Компания с ID ${id} не найдена для удаления`);
        }

        return;
    }
}
