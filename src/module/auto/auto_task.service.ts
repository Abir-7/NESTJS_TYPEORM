import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthStatus,
  UserAuthentication,
} from '../user/user_authentication/entities/user_authentication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AutoTaskService {
  private readonly logger = new Logger('Check_expired_code');
  constructor(
    @InjectRepository(UserAuthentication)
    private readonly authRepo: Repository<UserAuthentication>,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS) // Runs every minute
  async handleCron() {
    const now = new Date();

    const result = await this.authRepo
      .createQueryBuilder()
      .update(UserAuthentication)
      .set({ status: AuthStatus.EXPIRED })
      .where('expire_date < :now', { now })
      .andWhere('status = :pending', { pending: AuthStatus.PENDING })
      .execute();

    if (result.affected && result.affected > 0) {
      this.logger.log(`✅ Expired ${result.affected} old verification codes`);
    } else {
      this.logger.debug('No pending codes to expire');
    }
  }

  @Cron('0 30 9 * * 1-5') // Runs at 9:30 AM on weekdays (Monday-Friday)
  dailyReport() {
    console.log('Generating daily report...');
    // Logic for generating and sending daily reports
  }
}
