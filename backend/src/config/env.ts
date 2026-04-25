import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  // Add other required env variables
});

export const env = envSchema.parse(process.env);