import { z } from "zod";
import { validationUtils } from "../validationUtils";

export const requestOtpSchema = z.object({
  email: validationUtils.email("Account"),
});

export const verifyOtpSchema = z.object({
  otp: validationUtils.requiredString("OTP").length(6, "OTP must be 6 characters"),
});

export const resetPasswordSchema = z.object({
  password: validationUtils.password("New"),
  confirmPassword: validationUtils.confirmPasswd("Confirm"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  identifier: validationUtils.requiredString("Username or Email"),
  password: validationUtils.requiredString("Password"),
});

export const signUpSchema = z.object({
  fullname: validationUtils.name("Full name"),
  username: validationUtils.name("Username"),
  email: validationUtils.email("Account"),
  password: validationUtils.password("Account"),
});
