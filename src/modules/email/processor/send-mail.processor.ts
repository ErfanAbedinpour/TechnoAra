import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Worker } from 'bullmq';
import { IEmail } from '../email.interfaces';
import { Injectable } from '@nestjs/common';
import { EmailService } from '../email.service';
import { QUEUES } from '../../../enums/queues.enum';


@Injectable()
@Processor(QUEUES.WELCOME_EMAIL)
export class SendMailProcessor extends WorkerHost {
    constructor(private readonly emailService: EmailService) {
        super();
    }

    async process(job: Job<IEmail, boolean>): Promise<any> {
        await this.emailService.sendMail(job.data);
    }

}