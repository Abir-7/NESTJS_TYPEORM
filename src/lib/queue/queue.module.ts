import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { queue_name } from '../../common/const/queue.const';
import { EmailProcessor } from './worker/email.worker';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule, // make ConfigService available
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: 500,
          removeOnFail: 300,
          backoff: 2000,
        },
      }),
    }),
    BullModule.registerQueue({
      name: queue_name.EMAIL,
    }),
    EmailModule,
  ],
  providers: [EmailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
