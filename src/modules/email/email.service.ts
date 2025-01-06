import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import nodemailerConfig from './config/email.config';
import { MailSubject } from './mail.subject.enum';



@Injectable()
export class EmailService {
  constructor(
    private readonly transport: Transporter,
    @Inject(nodemailerConfig.KEY) private config: ConfigType<typeof nodemailerConfig>,
  ) {
    this.transport = createTransport({
      service: this.config.provider,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      }
    });
  }


  sendMail({ subject, html, to }: IMailData): Promise<boolean> {
    return this.transport.sendMail({
      from: "technoAra.company@gmail.com",
      to: to,
      subject,
      html,
    })
  }
}

interface IMailData {
  subject: MailSubject;
  html: string,
  to: string
}