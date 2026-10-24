import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '~/consts';
import {getOffsetAndCheckPaginationParams} from '~/utils/helpers';
import {updateByIdWithRelations} from '~/utils/helpers';

import {CreateCustomerDto, UpdateCustomerDto} from './dto/customer.dto';
import {Customer} from './entities/customer.entity';

@Injectable()
export class CustomerService {
    constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>) {}

    async getList(pageNum: number, pageSize: number) {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [customers, totalCounts] = await this.customerRepository.findAndCount({
            skip: skipCounts,
            take: pageSize,
            order: DEFAULT_ORDER,
            relations: {
                company: true,
            },
        });

        return {
            customers,
            totalCounts,
        };
    }

    async getById(customerId: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: {id: customerId},
            relations: {
                company: true,
            },
        });

        if (!customer) {
            throw new NotFoundException('Заказчик не найден');
        }

        return customer;
    }

    async create(dto: CreateCustomerDto): Promise<string> {
        const {companyId, ...restDto} = dto;

        const result = await this.customerRepository.save({...restDto, company: {id: companyId}});

        return result.id;
    }

    async updateById(id: string, dto: UpdateCustomerDto): Promise<string> {
        const {companyId, patronymic = null, ...restDto} = dto;

        const result = await updateByIdWithRelations(
            this.customerRepository,
            Customer,
            id,
            {...restDto, patronymic},
            {
                company: companyId,
            },
        );

        if (!result.affected) {
            throw new NotFoundException(`Заказчик с ID ${id} не найден`);
        }

        return id;
    }

    async removeById(customerId: string): Promise<void> {
        const result = await this.customerRepository.delete({id: customerId});

        if (!result.affected) {
            throw new NotFoundException('Заказчик не был найден для удаления');
        }
    }
}
