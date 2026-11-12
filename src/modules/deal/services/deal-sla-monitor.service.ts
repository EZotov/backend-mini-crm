import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {InjectRedis} from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import {DataSource, LessThan, Repository} from 'typeorm';

import {getFullName} from '~/utils/helpers';

import {Deal} from '../entities/deal.entity';
import {SlaLog} from '../entities/sla.entity';
import {DEAL_STATUS} from './../consts';

@Injectable()
export class SlaMonitorService {
    constructor(
        @InjectRepository(Deal)
        private readonly dealRepository: Repository<Deal>,
        private readonly dataSource: DataSource,
        @InjectRedis() private readonly redisService: Redis,
    ) {}

    private readonly logger = new Logger(SlaMonitorService.name);
    private isProcessing = false;
    private readonly LOCK_KEY = 'cron:lock:check_sla';
    // Время жизни замка: 55 секунд (чуть меньше минутного интервала)
    private readonly LOCK_TTL_MS = 55 * 1000;

    private async processOverdueDeal(deal: Deal, currentTime: Date): Promise<void> {
        const diffMs = currentTime.getTime() - deal.slaDeadline.getTime();
        const minutesOverdue = Math.max(1, Math.floor(diffMs / 60000));

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.update(Deal, deal.id, {
                isSlaViolated: true,
            });

            await transactionalEntityManager.save(SlaLog, {
                managerId: deal?.manager ? deal.manager.id : null,
                managerFullname: deal?.manager
                    ? getFullName({
                          lastName: deal.manager?.lastName,
                          firstName: deal.manager?.firstName,
                          patronymic: deal.manager?.patronymic,
                      })
                    : null,
                minutesOverdue,
                deal: {id: deal.id},
            });
        });
    }

    /**
     * Крон процесс проверки SLA каждую минуту с распределённым локом через Redis для множества инстансов
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async checkSla(): Promise<void> {
        if (this.isProcessing) {
            this.logger.warn('Предыдущая проверка SLA еще выполняется, пропускаем тик');
            return;
        }

        const lockValue = `${process.pid}-${Date.now()}`;
        const acquired = await this.redisService.set(this.LOCK_KEY, lockValue, 'PX', this.LOCK_TTL_MS, 'NX');

        if (!acquired) {
            return;
        }

        this.isProcessing = true;

        try {
            const now = new Date();

            const overdueDeals = await this.dealRepository.find({
                where: {
                    status: DEAL_STATUS.NEW,
                    isSlaViolated: false,
                    slaDeadline: LessThan(now),
                },
                relations: {
                    manager: true,
                },
            });

            if (!overdueDeals.length) {
                return;
            }

            this.logger.warn(`Найдено просроченных сделок: ${overdueDeals.length}`);

            for (const deal of overdueDeals) {
                try {
                    await this.processOverdueDeal(deal, now);
                } catch (error) {
                    this.logger.error(
                        `Ошибка при обработке SLA для сделки #${deal.id}`,
                        error instanceof Error ? error.stack : String(error),
                    );
                }
            }
        } finally {
            const currentLock = await this.redisService.get(this.LOCK_KEY);

            if (currentLock === lockValue) {
                await this.redisService.del(this.LOCK_KEY);
            }

            this.isProcessing = false;
        }
    }
}
