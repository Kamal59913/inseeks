import { AUTH_CONFIG } from "../config/config";

const isBrowser = typeof window !== "undefined";

export const getAuthToken = (): string | null => {
  if (!isBrowser) return null;

  const cookieToken = getCookie(AUTH_CONFIG.TOKEN_NAME);
  const localStorageToken = localStorage.getItem(AUTH_CONFIG.TOKEN_NAME);
  return cookieToken || localStorageToken;
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser) return;

  document.cookie = `${AUTH_CONFIG.TOKEN_NAME}=${token}; path=/; ${
    process.env.NEXT_PUBLIC_PROD ? "secure; samesite=strict" : ""
  }`;
  localStorage.setItem(AUTH_CONFIG.TOKEN_NAME, token);
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser) return null;

  const cookieToken = getCookie(AUTH_CONFIG.REFRESH_TOKEN_NAME);
  const localStorageToken = localStorage.getItem(
    AUTH_CONFIG.REFRESH_TOKEN_NAME,
  );
  return cookieToken || localStorageToken;
};

export const setRefreshToken = (token: string): void => {
  if (!isBrowser) return;

  document.cookie = `${AUTH_CONFIG.REFRESH_TOKEN_NAME}=${token}; path=/; ${
    process.env.NEXT_PUBLIC_PROD ? "secure; samesite=strict" : ""
  }`;
  localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_NAME, token);
};

export const clearAuthToken = (): void => {
  if (!isBrowser) return;

  localStorage.removeItem(AUTH_CONFIG.TOKEN_NAME);
  localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_NAME);

  const cookieOptions = `; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    process.env.NEXT_PUBLIC_PROD ? "; secure; samesite=strict" : ""
  }`;

  document.cookie = `${AUTH_CONFIG.TOKEN_NAME}=${cookieOptions}`;
  document.cookie = `${AUTH_CONFIG.REFRESH_TOKEN_NAME}=${cookieOptions}`;
};

const getCookie = (name: string): string | null => {
  if (!isBrowser) return null;

  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return match ? decodeURIComponent(match[2]!) : null;
};

export const getAuthTokenServer = (request: any): string | null => {
  return request.cookies.get(AUTH_CONFIG.TOKEN_NAME)?.value || null;
};

export const getRefreshTokenServer = (request: any): string | null => {
  return request.cookies.get(AUTH_CONFIG.REFRESH_TOKEN_NAME)?.value || null;
};
