import { z } from "zod";

export const VerifyOtpValidation = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyOtpValidationType = z.infer<typeof VerifyOtpValidation>;
