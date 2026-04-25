// import userVerificationMailSender from "./userVerificationMailSender";
// import { alertOnDocumentUpload } from "../../../templates/userVerification/userVerificationTemplate";
// interface User {
//   name: string;
//   email: string;
// }

// const sendUserVerificationMail = async (
//   user: User,
//   createdAt: string,
//   adminPanelUrl: string
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

//     await userVerificationMailSender(
//       "User Verification Pending",
//       alertOnDocumentUpload(user, formattedCreatedAt, adminPanelUrl)
//     );
//     console.log(`Verification email sent successfully to admins.`);
//   } catch (error) {
//     console.error(`Error sending email:`, error);
//   }
// };

// export default sendUserVerificationMail;
