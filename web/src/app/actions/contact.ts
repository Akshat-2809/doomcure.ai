"use server";

import { and, count, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { sendContactEmails } from "@/lib/contact/email";
import { CONTACT_FIELDS, contactSchema, type ContactField, type ContactState } from "@/lib/contact/schema";
import { getDb } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";
import { clientIp, hashIp, userAgent } from "@/lib/request";
import { CONTACT_EMAIL } from "@/lib/site";

const RATE_LIMIT = 5;
const RATE_WINDOW = "1 hour";

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };
  const values = { name: raw.name, email: raw.email, message: raw.message };

  // Honeypot filled: pretend it worked, store nothing.
  if (raw.website.trim() !== "") {
    console.info("[contact] honeypot triggered, dropping submission");
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (CONTACT_FIELDS.includes(key) && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields and try again.", fieldErrors, values };
  }

  const db = getDb();
  if (!db) {
    console.error("[contact] DATABASE_URL is not set");
    return { status: "error", message: `We couldn't send your message just now. Please try again, or email ${CONTACT_EMAIL}.`, values };
  }

  const h = await headers();
  const ipHash = hashIp(clientIp(h));
  const { name, email, message } = parsed.data;

  try {
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(contactMessages)
      .where(and(eq(contactMessages.ipHash, ipHash), gt(contactMessages.createdAt, sql`now() - ${RATE_WINDOW}::interval`)));

    if (recent >= RATE_LIMIT) {
      return {
        status: "error",
        message: `We've had several messages from your network in the last hour. Please try again later, or email ${CONTACT_EMAIL}.`,
        values,
      };
    }

    const [row] = await db
      .insert(contactMessages)
      .values({ name, email, message, ipHash, userAgent: userAgent(h) })
      .returning({ id: contactMessages.id });

    // Emails go out after the response is sent; failures are logged, never surfaced.
    after(() => sendContactEmails({ id: row.id, name, email, message }));

    return { status: "success" };
  } catch (err) {
    console.error("[contact] failed to store message", err);
    return {
      status: "error",
      message: `Something went wrong on our side and your message wasn't sent. Please try again, or email ${CONTACT_EMAIL}.`,
      values,
    };
  }
}
