import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'dev.abir.07@gmail.com',
          pass: 'uess felf lidk qnkw',
        },
      },
      defaults: {
        from: '"My App" <dev.abir.07@gmail.com>',
      },
    }),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'email_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
