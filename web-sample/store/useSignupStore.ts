import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

/**
 * Persists signup form data across the signup → verify-otp navigation.
 * Used to:
 *   1. Resend OTP by replaying the original signup API call.
 *   2. Drive the OTP expiry countdown with the server's expires_in_seconds.
 *
 * Stored in sessionStorage — cleared when the tab is closed.
 */

export interface SignupPayload {
  username: string;
  account_of: string;
  full_name: string;
  email: string;
  password: string;
  birthday?: string | Date;
  phone?: string;
  phoneData?: {
    fullPhone: string;
    countryCode: string;
    phoneNumber: string;
  };
}

interface SignupState {
  /** The original form data, used verbatim to resend OTP. */
  payload: SignupPayload | null;
  /** Absolute Unix timestamp (ms) at which the OTP expires. */
  otpExpiresAt: number | null;
  /** User ID returned by the API — may be needed for verification. */
  userId: number | null;

  /**
   * Called after a successful sendRegisterOtp response.
   * Stores the payload and computes the absolute expiry timestamp.
   */
  saveSignupAttempt: (
    payload: SignupPayload,
    expiresInSeconds: number,
    userId: number,
  ) => void;

  /** Clear all state after successful verification or explicit logout. */
  clear: () => void;
}

export const useSignupStore = create<SignupState>()(
  devtools(
    persist(
      (set) => ({
        payload: null,
        otpExpiresAt: null,
        userId: null,

        saveSignupAttempt: (payload, expiresInSeconds, userId) =>
          set({
            payload,
            otpExpiresAt: Date.now() + expiresInSeconds * 1000,
            userId,
          }),

        clear: () => set({ payload: null, otpExpiresAt: null, userId: null }),
      }),
      {
        name: "avom-signup",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: "SignupStore" },
  ),
);
