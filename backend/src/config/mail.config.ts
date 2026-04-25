import nodemailer from 'nodemailer';
import { MailConfig } from '../mail/types/mail.types';

export const createTransporter = (config: MailConfig) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
     tls: {
    rejectUnauthorized: false, // 👈 Allow self-signed certs
  },
  });

  return transporter;
};
