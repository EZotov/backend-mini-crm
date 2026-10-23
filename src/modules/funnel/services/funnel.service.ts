import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Funnel} from '../entities/funnel.entity';

@Injectable()
export class FunnelService {
    constructor(@InjectRepository(Funnel) private readonly funnelRepository: Repository<Funnel>) {}
}
