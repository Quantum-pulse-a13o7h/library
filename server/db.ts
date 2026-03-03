import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL;
const ssl =
  process.env.DB_SSL === "true" ||
  connectionString?.includes("sslmode=require") ||
  connectionString?.includes("ssl=true")
    ? { rejectUnauthorized: false }
    : undefined;

export const pool = new Pool({ connectionString, ssl });
export const db = drizzle(pool, { schema });
