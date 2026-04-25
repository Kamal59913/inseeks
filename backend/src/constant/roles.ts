export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
