/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { queue_name, rabbitmq_service } from './RabitMq.const';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: rabbitmq_service.EMAIL_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: queue_name.EMAIL,
            queueOptions: { durable: true },
          },
        }),
      },
      // You can add more services here later easily
      // {
      //   name: rabbitmq_service.NOTIFICATION_SERVICE,
      //   ...
      // },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitmqModule {}
