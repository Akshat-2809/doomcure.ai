import type { CorsOptions } from "cors";
import { env, isProd } from "../env.js";

const BASE_ORIGINS = ["https://doomcure.com", "https://www.doomcure.com"];

function toMatcher(pattern: string): (origin: string) => boolean {
  if (!pattern.includes("*")) return (origin) => origin === pattern;
  const re = new RegExp(`^${pattern.split("*").map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[a-z0-9-]*")}$`, "i");
  return (origin) => re.test(origin);
}

const matchers = [...BASE_ORIGINS, ...env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)].map(toMatcher);
const LOCALHOST = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(origin: string): boolean {
  if (!isProd && LOCALHOST.test(origin)) return true;
  return matchers.some((m) => m(origin));
}

export const corsOptions: CorsOptions = {
  // Requests without an Origin header (curl, server-to-server) aren't subject to CORS.
  origin: (origin, cb) => cb(null, !origin || isAllowedOrigin(origin)),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 86400,
};
