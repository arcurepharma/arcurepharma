import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const isDbConfigured = Boolean(
  process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0
);

function createSql(): unknown {
  if (!isDbConfigured) {
    return (_args: unknown[]) => {
      throw new Error(
        "DATABASE_URL is not configured. Add it to .env to enable database features."
      );
    };
  }
  try {
    return neon(process.env.DATABASE_URL!);
  } catch {
    return (() => {
      throw new Error(
        "DATABASE_URL is invalid or not supported. Fix it in .env to enable database features."
      );
    }) as never;
  }
}

const sql = createSql();

export const db = drizzle(sql as any, { schema });