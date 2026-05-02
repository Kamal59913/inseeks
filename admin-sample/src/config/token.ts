// src/config/auth.ts
export const AUTH_CONFIG = {
  TOKEN_NAME: import.meta.env.VITE_EMPERA_AUTH_TOKEN_NAME || "token-admin",
} as const;
