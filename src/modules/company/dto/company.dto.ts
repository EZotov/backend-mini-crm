import {OmitType} from '@nestjs/swagger';

import {Company} from '../entities/company.entity';

export class CreateOrUpdateCompanyDto extends OmitType(Company, ['id', 'createdBy', 'createdAt', 'updatedAt']) {}
