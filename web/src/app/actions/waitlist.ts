"use server";

import { and, count, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { getDb } from "@/lib/db/client";
import { waitlistSignups } from "@/lib/db/schema";
import { clientIp, hashIp, userAgent } from "@/lib/request";
import { CONTACT_EMAIL } from "@/lib/site";
import { sendWaitlistEmails } from "@/lib/waitlist/email";
import { waitlistSchema, type WaitlistResult } from "@/lib/waitlist/schema";

const RATE_LIMIT = 10;
const RATE_WINDOW = "1 hour";

export async function joinWaitlist(input: { email: string; source: string; website: string }): Promise<WaitlistResult> {
  // Honeypot filled: pretend it worked, store nothing.
  if (String(input.website ?? "").trim() !== "") {
    console.info("[waitlist] honeypot triggered, dropping submission");
    return { status: "joined" };
  }

  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your email and try again." };
  }

  const db = getDb();
  if (!db) {
    console.error("[waitlist] DATABASE_URL is not set");
    return { status: "error", message: `We couldn't add you just now. Please try again, or email ${CONTACT_EMAIL}.` };
  }

  const h = await headers();
  const ipHash = hashIp(clientIp(h));
  const { email, source } = parsed.data;

  try {
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(waitlistSignups)
      .where(and(eq(waitlistSignups.ipHash, ipHash), gt(waitlistSignups.createdAt, sql`now() - ${RATE_WINDOW}::interval`)));

    if (recent >= RATE_LIMIT) {
      return { status: "error", message: "Too many sign-ups from your network in the last hour. Please try again later." };
    }

    const [row] = await db
      .insert(waitlistSignups)
      .values({ email, source, ipHash, userAgent: userAgent(h) })
      .onConflictDoNothing({ target: waitlistSignups.email })
      .returning({ id: waitlistSignups.id });

    // Already on the list: treat as success, no error shown and no second welcome email.
    if (!row) return { status: "already_joined" };

    // Emails go out after the response is sent; failures are logged, never surfaced.
    after(() => sendWaitlistEmails({ id: row.id, email, source }));

    return { status: "joined" };
  } catch (err) {
    console.error("[waitlist] failed to store signup", err);
    return {
      status: "error",
      message: "Something went wrong on our side, so you're not on the list yet. Please try again.",
    };
  }
}
