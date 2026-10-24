import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { isProd } from "../env.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public headers: Record<string, string> = {},
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "not_found", message: "Not found." });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    res.set(err.headers).status(err.status).json({ error: err.code, message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: "invalid_request", message: err.issues[0]?.message ?? "Invalid request." });
    return;
  }
  // body-parser errors: malformed JSON, payload too large
  if (typeof err?.status === "number" && err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ error: "bad_request", message: err.expose ? err.message : "Bad request." });
    return;
  }

  req.log?.error({ err }, "unhandled error");
  res.status(500).json({
    error: "internal_error",
    message: "Something went wrong.",
    ...(isProd ? {} : { detail: String(err?.message ?? err), stack: err?.stack }),
  });
};
