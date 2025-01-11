import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import nodemailerConfig from './config/email.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(nodemailerConfig)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
