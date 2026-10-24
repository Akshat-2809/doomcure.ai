import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

// prepare: false keeps it compatible with pooled (PgBouncer) connection strings such as Neon's.
const client = postgres(env.DATABASE_URL, { max: 5, idle_timeout: 20, prepare: false });

export const db = drizzle(client, { schema });
