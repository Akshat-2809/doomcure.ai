import { pino } from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: ["req.headers.cookie", "req.headers.authorization", "email"],
  ...(env.NODE_ENV === "development" ? { transport: { target: "pino-pretty", options: { colorize: true } } } : {}),
});
