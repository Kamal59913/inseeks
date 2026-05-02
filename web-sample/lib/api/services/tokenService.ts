import axios from "axios";
import { setAuthToken } from "@/lib/utilities/tokenManagement";

/**
 * Lean service dedicated to token refreshing.
 * This file should NOT import apiClient or authService to avoid circular dependencies.
 */
export const tokenService = {
  refreshAccessToken: async (refresh_token: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`,
      {
        refresh_token,
      },
    );

    const access_token = response?.data?.access_token;
    if (access_token) {
      setAuthToken(access_token);
    }

    return response;
  },
};
