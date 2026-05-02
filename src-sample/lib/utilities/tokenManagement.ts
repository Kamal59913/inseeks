import { AUTH_CONFIG } from "../config/config";

const isBrowser = typeof window !== "undefined";

export const getAuthToken = (): string | null => {
  if (!isBrowser) return null;

  return getCookie(AUTH_CONFIG.TOKEN_NAME);
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser) return;

  // Use Secure; SameSite=Strict for production, restricted for dev
  const cookieOptions = process.env.NEXT_PUBLIC_PROD
    ? "secure; samesite=strict"
    : "samesite=lax";

  document.cookie = `${AUTH_CONFIG.TOKEN_NAME}=${token}; path=/; ${cookieOptions}`;
};

export const clearAuthToken = (): void => {
  if (!isBrowser) return;

  const cookieOptions = process.env.NEXT_PUBLIC_PROD
    ? "; secure; samesite=strict"
    : "; samesite=lax";

  document.cookie = `${
    AUTH_CONFIG.TOKEN_NAME
  }=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${cookieOptions}`;
};

const getCookie = (name: string): string | null => {
  if (!isBrowser) return null;

  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return match ? decodeURIComponent(match[2]) : null;
};

export const getAuthTokenServer = (request: any): string | null => {
  return request.cookies.get(AUTH_CONFIG.TOKEN_NAME)?.value || null;
};
