import dotenv from 'dotenv';
import { MailConfig } from '../types/mail.types';
import { createTransporter } from '../../config/mail.config';
import { EmailService } from './email.service';
import { MailTriggerService } from './mail-trigger.service';

dotenv.config();

const config: MailConfig = {
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: parseInt(process.env.SMTP_PORT!, 10),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  MAIL_FROM_NO_REPLY: process.env.MAIL_FROM_NO_REPLY!,
};


const transporter = createTransporter(config);
const emailService = new EmailService(transporter, config);
const mailTriggerService = new MailTriggerService(emailService);

export { emailService, mailTriggerService };