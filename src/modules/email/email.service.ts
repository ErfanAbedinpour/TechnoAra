import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import nodemailerConfig from './config/email.config';
import { IEmail } from './email.interfaces';

@Injectable()
export class EmailService {
  private readonly transport: Transporter;
  constructor(
    @Inject(nodemailerConfig.KEY) private config: ConfigType<typeof nodemailerConfig>,
  ) {
    console.log('cinfog is ', config)
    this.transport = createTransport({
      service: this.config.provider,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      },
    });
  }

  // send Mail 
  sendMail({ subject, html, to }: IEmail): Promise<boolean> {
    return this.transport.sendMail({
      from: 'technoAra.company@gmail.com',
      to: to,
      subject,
      html,
    });
  }
}
