import { AUTH_CONFIG } from "../config/token";

const isBrowser = typeof window !== "undefined";

export const getAuthToken = (): string | null => {
  // const cookieToken = getCookie(AUTH_CONFIG.TOKEN_NAME);
  const localStorageToken = localStorage.getItem(AUTH_CONFIG.TOKEN_NAME);
  return localStorageToken;
};
// Helper function to get cookie
// const getCookie = (name: string): string | null => {
//   const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
//   return match ? decodeURIComponent(match[2]) : null;
// };

export const setAuthToken = (token: string): void => {
  // Set cookie
  // console.log("this is the thing is aaa", token)
  // document.cookie = `${AUTH_CONFIG.TOKEN_NAME}=${token}; path=/; ${
  //   import.meta.env.PROD ? "secure; samesite=strict" : ""
  // }`;

  // Set localStorage
  localStorage.setItem(AUTH_CONFIG.TOKEN_NAME, token);
};

export const clearToken = (): void => {
  // Remove from localStorage
  localStorage.removeItem(AUTH_CONFIG.TOKEN_NAME);

  // Remove cookie by setting an expired date
  // document.cookie = `${AUTH_CONFIG.TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${
  //   import.meta.env.PROD ? "; secure; samesite=strict" : ""
  // }`;
};

export const clearAuthToken = (): void => {
  if (!isBrowser) return;

  localStorage.removeItem(AUTH_CONFIG.TOKEN_NAME);
  document.cookie = `${
    AUTH_CONFIG.TOKEN_NAME
  }=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    process.env.NEXT_PUBLIC_PROD ? "; secure; samesite=strict" : ""
  }`;
};
