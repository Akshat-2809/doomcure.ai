import { z } from "zod";

export const WAITLIST_SOURCES = ["hero", "cta"] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email.")
    .max(254, "That email is too long.")
    .pipe(z.email("That email doesn't look quite right. Check it and try again.")),
  source: z.enum(WAITLIST_SOURCES, "Unknown form."),
  // Honeypot: real visitors never see or fill this.
  website: z.string().optional().default(""),
});

export type WaitlistResult =
  | { status: "joined" | "already_joined" }
  | { status: "error"; message: string };
