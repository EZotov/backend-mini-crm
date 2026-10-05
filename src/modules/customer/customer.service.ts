import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {DEFAULT_ORDER} from '~/consts';
import {IdResponseDto} from '~/dto';
import {ListResponse} from '~/interfaces';
import {getOffsetAndCheckPaginationParams, isUUID} from '~/utils';

import {CreateCustomerDto, CustomerDto} from './dto/customer.dto';
import {Customer} from './entities/customer.entity';

@Injectable()
export class CustomerService {
    constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>) {}

    async getList(pageNum: number, pageSize: number): Promise<ListResponse<Customer>> {
        const skipCounts = getOffsetAndCheckPaginationParams(pageNum, pageSize);

        const [customers, totalCounts] = await this.customerRepository.findAndCount({
            skip: skipCounts,
            take: pageSize,
            order: DEFAULT_ORDER,
        });

        return {
            data: customers,
            total: totalCounts,
        };
    }

    async getById(customerId: string): Promise<CustomerDto> {
        if (!isUUID(customerId)) {
            throw new BadRequestException('Передан некорректный формат UUID');
        }

        const customer = await this.customerRepository.findOneBy({id: customerId});

        if (!customer) {
            throw new NotFoundException('Заказчик не найден');
        }

        return customer;
    }

    async create(dto: CreateCustomerDto): Promise<IdResponseDto> {
        const result = await this.customerRepository.save(dto);

        return {id: result.id};
    }

    async updateById(id: string, dto: CreateCustomerDto): Promise<{id: string}> {
        const result = await this.customerRepository.update(id, {...dto, updatedAt: new Date()});

        if (!result.affected) {
            throw new NotFoundException(`Заказчик с ID ${id} не найден`);
        }

        return {id};
    }

    async removeById(customerId: string) {
        const result = await this.customerRepository.delete({id: customerId});

        if (!result.affected) {
            throw new NotFoundException('Заказчик не был найден для удаления');
        }
    }
}
