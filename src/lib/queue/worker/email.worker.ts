import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { queue_name } from '../../../common/const/queue.const';
import { Job } from 'bullmq';
import { EmailService } from '../../email/email.service';
import { EmailJobData } from '../../../types/bullmq_jobs/email_job.interface';

@Processor(queue_name.EMAIL, { concurrency: 3 })
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job<EmailJobData>): Promise<any> {
    return await this.emailService.sendVerificationEmail(
      job.data?.to,
      job.data?.otp,
      job.data?.title,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<EmailJobData>): void {
    console.log(`Job ${job.id} completed successfully`, job.name, job.data);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<EmailJobData>, err: Error): void {
    console.error(`Job ${job.id} failed`, err);
  }
}
