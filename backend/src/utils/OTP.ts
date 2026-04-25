import otpTemplate from "../templates/emailTemp";
import authMailSender from "./authMailSender";

const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    const mailResponse = await authMailSender(
      email,
      "Verification Email",
      otpTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
};

export default sendVerificationEmail;
