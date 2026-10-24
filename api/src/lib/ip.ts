import { createHmac } from "node:crypto";
import type { Request } from "express";
import { env } from "../env.js";

/** Client IP. On Vercel, x-real-ip is set by the platform and can't be spoofed by the client. */
export function clientIp(req: Request): string {
  const real = req.headers["x-real-ip"];
  if (typeof real === "string" && real) return real;
  return req.ip ?? "unknown";
}

export function hashIp(ip: string): string {
  return createHmac("sha256", env.IP_HASH_SECRET).update(ip).digest("hex");
}
