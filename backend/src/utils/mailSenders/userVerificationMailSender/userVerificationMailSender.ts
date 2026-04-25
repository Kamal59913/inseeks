// import FormData from "form-data";
// import Mailgun from "mailgun.js";
// import { config } from "dotenv";

// config();

// const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
// const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
// const MAILGUN_EMAIL_ALERT = process.env.MAILGUN_EMAIL_ALERT;
// const MAILGUN_EMAIL_ALERT_USER_VERIFICATION =
//   process.env.MAILGUN_EMAIL_ALERT_USER_VERIFICATION;

// if (
//   !MAILGUN_API_KEY ||
//   !MAILGUN_DOMAIN ||
//   !MAILGUN_EMAIL_ALERT_USER_VERIFICATION
// ) {
//   throw new Error("Mailgun environment variables are missing.");
// }

// const mailgun = new Mailgun(FormData as unknown as new () => FormData);
// const mg = mailgun.client({
//   username: "api",
//   key: MAILGUN_API_KEY,
// });

// const userVerificationMailSender = async (
//   title: string,
//   body: string
// ): Promise<{ status: string; message: string }> => {
//   try {
//     const info = await mg.messages.create(MAILGUN_DOMAIN, {
//       from: MAILGUN_EMAIL_ALERT,
//       to: MAILGUN_EMAIL_ALERT_USER_VERIFICATION,
//       subject: title,
//       html: body,
//     });

//     console.log("Mail sent:", info);

//     return { status: "success", message: "Mail sent successfully" };
//   } catch (error: any) {
//     console.error("Error sending mail:", error.message);
//     return { status: "error", message: error.message };
//   }
// };

// export default userVerificationMailSender;
