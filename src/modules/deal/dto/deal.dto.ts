import {OmitType} from '@nestjs/mapped-types';

import {Deal} from '../entities/deal.entity';

export class CreateDealDto extends OmitType(Deal, ['id', 'status']) {}

export class UpdateDealDto extends OmitType(Deal, ['id', 'status']) {}
