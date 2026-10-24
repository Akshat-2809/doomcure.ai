import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const waitlistSource = pgEnum("waitlist_source", ["hero", "cta"]);

export const waitlistSignups = pgTable("waitlist_signups", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  source: waitlistSource("source").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** HMAC-SHA256 of the visitor IP. Never the raw IP. */
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
});

/** Fixed-window counters for per-IP rate limiting (works across serverless instances). */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull(),
});
