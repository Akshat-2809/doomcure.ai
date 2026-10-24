import { sql } from "drizzle-orm";
import { db } from "../db/client.js";

/**
 * Fixed hourly window per key, stored in Postgres so the limit holds across
 * serverless instances. Returns how many hits this key has used this hour.
 */
export async function hit(key: string): Promise<number> {
  const rows = await db.execute<{ count: number }>(sql`
    insert into rate_limits (key, window_start, count)
    values (${key}, date_trunc('hour', now()), 1)
    on conflict (key) do update set
      count = case when rate_limits.window_start = date_trunc('hour', now()) then rate_limits.count + 1 else 1 end,
      window_start = date_trunc('hour', now())
    returning count
  `);
  return Number(rows[0]?.count ?? 0);
}

/** Seconds until the current hourly window resets. */
export function secondsUntilNextHour(now = new Date()): number {
  return 3600 - (now.getUTCMinutes() * 60 + now.getUTCSeconds());
}
