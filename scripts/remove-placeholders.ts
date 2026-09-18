import "dotenv/config";
import { db } from "../src/db";
import { products } from "../src/db/schema";
import { inArray } from "drizzle-orm";

async function main() {
  const ids = [
    "20000000-0000-4000-8000-000000000001", // Face Wash
    "20000000-0000-4000-8000-000000000002", // Face Wash
    "20000000-0000-4000-8000-000000000003", // Face Wash
    "20000000-0000-4000-8000-000000000004", // Serums
    "20000000-0000-4000-8000-000000000005", // Serums
    "20000000-0000-4000-8000-000000000006", // Serums
  ];

  await db.delete(products).where(inArray(products.id, ids));
  console.log("✓ Face Wash & Serums placeholder products removed.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
