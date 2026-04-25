import { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import { MailConfig, TemplateEmailOptions, PlainEmailOptions } from '../types/mail.types';

export class EmailService {
  private transporter: Transporter;
  private noReplyFrom: string;

  constructor(transporter: Transporter, config: MailConfig) {
    this.transporter = transporter;
    this.noReplyFrom = config.MAIL_FROM_NO_REPLY;
  }

  private compileMjmlTemplate(templateName: string, context: any): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.mjml`);
    const source = fs.readFileSync(filePath, 'utf-8');
    const compiled = Handlebars.compile(source)(context);
    const { html, errors } = mjml2html(compiled);

    if (errors && errors.length > 0) {
      console.error('MJML Errors:', errors);
    }

    return html;
  }

  async sendTemplateEmail({ to, template, context, from = this.noReplyFrom }: TemplateEmailOptions) {
    const html = this.compileMjmlTemplate(template, context);

    return this.transporter.sendMail({
      to,
      from,
      subject: `📧 ${template.replace(/[-_]/g, ' ').toUpperCase()}`,
      html,
    });
  }

  async sendPlainEmail({ to, subject, text, from = this.noReplyFrom }: PlainEmailOptions) {
    return this.transporter.sendMail({ to, from, subject, text });
  }
}
