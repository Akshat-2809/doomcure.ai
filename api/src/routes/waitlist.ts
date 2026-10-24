import { waitUntil } from "@vercel/functions";
import { count } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/client.js";
import { waitlistSignups } from "../db/schema.js";
import { env } from "../env.js";
import { sendSignupEmails } from "../lib/email.js";
import { HttpError } from "../lib/errors.js";
import { clientIp, hashIp } from "../lib/ip.js";
import { hit, secondsUntilNextHour } from "../lib/rateLimit.js";

export const waitlistRouter = Router();

const body = z.object({
  email: z
    .string({ error: "Email is required." })
    .trim()
    .toLowerCase()
    .max(254, "That email is too long.")
    .pipe(z.email({ error: "That email doesn't look right." })),
  source: z.enum(["hero", "cta"], { error: "Unknown source." }),
  /** Honeypot: real people never see or fill this. */
  website: z.string().max(500).optional().default(""),
});

waitlistRouter.post("/", async (req, res) => {
  const ipHash = hashIp(clientIp(req));

  const used = await hit(`waitlist:${ipHash}`);
  if (used > env.RATE_LIMIT_PER_HOUR) {
    throw new HttpError(429, "rate_limited", "Too many attempts. Try again later.", {
      "Retry-After": String(secondsUntilNextHour()),
    });
  }

  const { email, source, website } = body.parse(req.body ?? {});

  // Bots fill the honeypot: answer like a success, store nothing.
  if (website.trim() !== "") {
    req.log.info("honeypot triggered");
    res.status(200).json({ status: "joined" });
    return;
  }

  const userAgent = req.get("user-agent")?.slice(0, 500) ?? null;
  const inserted = await db
    .insert(waitlistSignups)
    .values({ email, source, ipHash, userAgent })
    .onConflictDoNothing({ target: waitlistSignups.email })
    .returning({ id: waitlistSignups.id });

  if (inserted.length === 0) {
    res.status(200).json({ status: "already_joined" });
    return;
  }

  // Send after responding; on Vercel waitUntil keeps the function alive until it finishes.
  waitUntil(sendSignupEmails(email, source));
  req.log.info({ source }, "waitlist signup");
  res.status(201).json({ status: "joined" });
});

// Founder-only number; not shown on the site. Cached for 60s in memory and at the edge.
let cached: { value: number; expires: number } | null = null;

waitlistRouter.get("/count", async (_req, res) => {
  const now = Date.now();
  if (!cached || cached.expires <= now) {
    const [row] = await db.select({ value: count() }).from(waitlistSignups);
    cached = { value: Number(row?.value ?? 0), expires: now + 60_000 };
  }
  res.set("Cache-Control", "public, max-age=60, s-maxage=60");
  res.json({ count: cached.value });
});
