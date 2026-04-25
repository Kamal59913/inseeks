import { EmailPayload, TriggerFn } from "../types/mail.types";
import { EmailService } from "./email.service";

export class MailTriggerService {
  private emailService: EmailService;
  private triggers: Record<string, TriggerFn>;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
    this.triggers = {
      "user:welcome": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "welcome",
          context: context ?? {},
        }),
      "admin:alert": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "admin-alert",
          context: context ?? {},
        }),
      "user:plain-welcome": (to) =>
        this.emailService.sendPlainEmail({
          to,
          subject: "Welcome!",
          text: "Thanks for signing up!",
        }),
      "forgot-password": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "forgot-password",
          context: context ?? {},
        }),
      "forgot-password-otp": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "forgot-password-otp",
          context: context ?? {},
        }),
      "lead-mail": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "lead-mail",
          context: context ?? {},
        }),

      "track-user": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "track-user",
          context: context ?? {},
        }),
      "user:signup": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "signup",
          context: context ?? {},
        }),
      "user:signup-otp": (to, context) =>
        this.emailService.sendTemplateEmail({
          to,
          template: "signup-otp",
          context: context ?? {},
        }),
    };
  }

  async trigger(triggerKey: string, payload: EmailPayload) {
    const triggerFn = this.triggers[triggerKey];
    if (!triggerFn) {
      throw new Error(`Unknown email trigger: ${triggerKey}`);
    }
    return triggerFn(payload.to, payload.context);
  }
}
