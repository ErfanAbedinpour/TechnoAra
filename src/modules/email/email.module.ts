import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import nodemailerConfig from './config/email.config';
import { SendMailProcessor } from './processor/send-mail.processor';


@Module({
  imports: [ConfigModule.forFeature(nodemailerConfig)],
  providers: [EmailService, SendMailProcessor],
  exports: [EmailService],
})
export class EmailModule { }
