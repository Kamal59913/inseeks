import FormData from "form-data";
import Mailgun from "mailgun.js";
import nodemailer from "nodemailer";

import { config } from "dotenv";
import { Response } from "express";
config();
const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<Response> => {
  try {
    const mailgun = new Mailgun(FormData as unknown as new () => FormData);
    //init mailgun client
    console.log("here is the key", process.env.MAILGUN_API_KEY);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    });

    const domain = process.env.MAILGUN_DOMAIN || "";

    const from = process.env.MAILGUN_EMAIL_USER;

    // console.log(domain, from, process.env.MAILGUN_API_KEY);
    // const data =
    // console.log(data);
    const info = await mg.messages.create(domain, {
      from: from,
      to: email, // Recipient email
      subject: title, // Email subject
      html: body, // HTML email body
    });

    console.log("Mail sent :", info);

    return {
      status: "success",
      message: "Mail sent successfully",
    } as unknown as Response;
  } catch (error: any) {
    console.error("mailSender issue:", error.message);

    return {
      status: "error",
      message: error.message,
    } as unknown as Response;
  }
};

export default mailSender;

// ///////////////////////////////NOdemailer

// const mailSender = async (
//   email: string,
//   title: string,
//   body: string
// ): Promise<Response> => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });
//     console.log("mail send");
//     let info = await transporter.sendMail({
//       from: `"InverstorRow" <${process.env.MAIL_USER}>`,
//       to: email,
//       subject: title,
//       html: body,
//     });

//     console.log(info);

//     return {
//       status: "success",
//       // info: info,
//     } as unknown as Response;
//   } catch (error: any) {
//     console.log("mailSender issue", error.message);

//     return {
//       status: "error",
//       message: error.message,
//     } as unknown as Response;
//   }
// };
// export default mailSender;
