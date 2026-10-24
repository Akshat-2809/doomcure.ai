import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { corsOptions } from "./lib/cors.js";
import { errorHandler, notFound } from "./lib/errors.js";
import { logger } from "./logger.js";
import { waitlistRouter } from "./routes/waitlist.js";

// Vercel's Express support uses this default export as the function entry.
// For local development, see local.ts.
const app = express();

app.set("trust proxy", true);
app.use(helmet());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ id: req.id, method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    autoLogging: { ignore: (req) => req.url === "/health" },
  }),
);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/v1/waitlist", waitlistRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
