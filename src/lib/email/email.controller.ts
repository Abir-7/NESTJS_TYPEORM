import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { queue_name } from '../rabbitmq/RabitMq.const';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern(queue_name.EMAIL)
  async handleEmail(
    @Payload() data: { to: string; otp: string; title: string },
  ) {
    return await this.emailService.sendWelcomeEmail(
      data.to,
      data.otp,
      data.title,
    );
  }
}
