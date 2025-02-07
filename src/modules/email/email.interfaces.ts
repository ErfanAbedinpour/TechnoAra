import { MailSubject } from './enums/mail.subject.enum';

export interface IEmail {
  subject: MailSubject;
  html: string;
  to: string;
}
