import { registerAs } from '@nestjs/config';

export default registerAs('nodemailer', () => ({
  provider: process.env.SMTP_PROVIDER,
  password: process.env.SMTP_PASSWORD,
  user: process.env.SMTP_USER,
}));
