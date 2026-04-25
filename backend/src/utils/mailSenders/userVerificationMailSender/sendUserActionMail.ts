// import { alertOnAccountSuspension } from "../../../templates/userAction/userActionTemplate";
// import userVerificationMailSender from "./userVerificationMailSender";

// interface User {
//   name: string;
//   email: string;
// }

// const sendUserActionMail = async (
//   user: User,
//   createdAt: string,
//   supportUrl: string,
//   willBeSuspended: boolean
// ): Promise<void> => {
//   try {
//     const createdAtDate = new Date(createdAt);
//     const formattedCreatedAt = createdAtDate.toLocaleString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//       timeZoneName: "short",
//     });

//     console.log("here is the log", willBeSuspended)
//     const textToDisplay = willBeSuspended
//     ? `We regret to inform you that your account has been suspended as of`
//     : `We are pleased to inform you that your account has been unsuspended as of`;

//     console.log("here is the log", textToDisplay)

//     await userVerificationMailSender(
//       "User Action Notice",
//       alertOnAccountSuspension(user, formattedCreatedAt, textToDisplay, supportUrl)
//     );
//     console.log(`Verification email sent successfully to admins.`);
//   } catch (error) {
//     console.error(`Error sending email:`, error);
//   }
// };

// export default sendUserActionMail;
