import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {FunnelStages} from '../entities/funnel-stages.entity';

@Injectable()
export class FunnelStagesService {
    constructor(@InjectRepository(FunnelStages) private readonly funnelStagesRepository: Repository<FunnelStages>) {}
}
