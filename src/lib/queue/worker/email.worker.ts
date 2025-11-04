/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { queue_name } from '../../../const/queue.const';
import { Job } from 'bullmq';
import { EmailService } from '../../email/email.service';

interface EmailJobData {
  to: string;
  otp: string;
  title: string;
}

@Processor(queue_name.EMAIL)
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job<EmailJobData>): Promise<any> {
    console.log(job.data, 'bg-job');
    await this.emailService.sendVerificationEmail(
      job.data?.to,
      job.data?.otp,
      job.data?.title,
    );
  }
}
