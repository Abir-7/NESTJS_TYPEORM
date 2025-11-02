import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Welcome!',
      html: `<h3>Hello ${name}</h3><p>Thanks for joining our platform</p>`,
    });
  }
}
