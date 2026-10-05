import {OmitType} from '@nestjs/mapped-types';

import {Company} from '../entities/company.entity';

export class CreateCompanyDto extends OmitType(Company, ['id']) {}
