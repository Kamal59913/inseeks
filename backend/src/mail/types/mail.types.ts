export interface MailConfig {
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  MAIL_FROM_NO_REPLY: string;
}

export interface EmailPayload {
  to: string;
  context?: Record<string, any>;
}

export interface TemplateEmailOptions {
  to: string;
  template: string;
  context: Record<string, any>;
  from?: string;
}

export interface PlainEmailOptions {
  to: string;
  subject: string;
  text: string;
  from?: string;
}

export type TriggerFn = (to: string, context?: Record<string, any>) => Promise<any>;