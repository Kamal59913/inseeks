/**
 * Centralized Configuration
 *
 * This file serves as the single source of truth for all environment variables
 * and global constants. Direct access to `process.env` should be restricted
 * to this file to ensure fail-fast validation and type safety.
 */

export const config = {
  env: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",

  // API & Services
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || "",

  // Third Party Tokens
  mapboxToken: process.env.NEXT_PUBLIC_PUBLIC_TOKEN || "",
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
} as const;

export type AppConfig = typeof config;
