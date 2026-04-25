import bcrypt from "bcrypt";

// Function to encrypt (hash) the OTP
const encryptOtp = async (otp: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
};

// Function to decrypt (verify) the OTP
const verifyOtp = async (
  submittedOtp: string,
  hashedOtp: string
): Promise<boolean> => {
  return await bcrypt.compare(submittedOtp, hashedOtp);
};
export { encryptOtp, verifyOtp };
