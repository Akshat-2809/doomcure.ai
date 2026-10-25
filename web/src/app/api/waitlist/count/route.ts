import { count } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/lib/db/client";
import { waitlistSignups } from "@/lib/db/schema";

// Founder-only number; not shown on the site. Cached for 60s per instance and at the CDN.
let cached: { value: number; expires: number } | null = null;

export async function GET() {
  // Always run at request time, never prerendered at build.
  await connection();

  const db = getDb();
  if (!db) return Response.json({ error: "DATABASE_URL is not set" }, { status: 503 });

  const now = Date.now();
  if (!cached || cached.expires <= now) {
    const [row] = await db.select({ value: count() }).from(waitlistSignups);
    cached = { value: row?.value ?? 0, expires: now + 60_000 };
  }
  return Response.json({ count: cached.value }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
}
