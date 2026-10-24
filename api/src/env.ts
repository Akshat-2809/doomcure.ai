import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  /** Secret used to HMAC visitor IPs; raw IPs are never stored. */
  IP_HASH_SECRET: z.string().min(16, "IP_HASH_SECRET must be at least 16 characters"),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Doomcure <hello@doomcure.com>"),
  NOTIFY_EMAIL: z.string().optional(),

  /** Extra CORS origins, comma separated. `*` matches any characters, e.g. https://doomcure-*.vercel.app */
  ALLOWED_ORIGINS: z.string().default(""),
  RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(10),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
