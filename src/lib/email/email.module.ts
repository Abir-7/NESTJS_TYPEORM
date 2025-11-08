import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule, // make ConfigService available
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.getOrThrow<string>('EMAIL_SERVICE'),
          auth: {
            user: configService.getOrThrow<string>('GMAIL_USER'),
            pass: configService.getOrThrow<string>('GMAIL_PASS'),
          },
        },
        defaults: {
          from: `"My App" <${configService.get<string>('GMAIL_USER')}>`,
        },
      }),
    }),
  ],
  providers: [EmailService],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}
