import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const waitlistSignups = pgTable(
  "waitlist_signups",
  {
    id: serial("id").primaryKey(),
    // Stored trimmed and lowercased, so the unique constraint catches duplicates.
    email: text("email").notNull().unique(),
    // "hero" or "cta": which form was used.
    source: text("source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    // Salted SHA-256 of the client IP, used only for rate limiting. Never the raw IP.
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent"),
  },
  (t) => [index("waitlist_signups_ip_created_idx").on(t.ipHash, t.createdAt)],
);

export type WaitlistSignupRow = typeof waitlistSignups.$inferSelect;

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    // Salted SHA-256 of the client IP, used only for rate limiting. Never the raw IP.
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent"),
  },
  (t) => [index("contact_messages_ip_created_idx").on(t.ipHash, t.createdAt)],
);

export type ContactMessageRow = typeof contactMessages.$inferSelect;
