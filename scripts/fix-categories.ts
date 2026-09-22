import "dotenv/config";
import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  // Fix Moisturizer products
  await db.update(products)
    .set({ category: "Moisturizers" })
    .where(eq(products.id, "20000000-0000-4000-8000-000000000007"));
  console.log("✓ ARCUDERM Daily Moisturizer → Moisturizers");

  await db.update(products)
    .set({ category: "Moisturizers" })
    .where(eq(products.id, "20000000-0000-4000-8000-000000000008"));
  console.log("✓ ARCUDERM Night Repair Cream → Moisturizers");

  // Fix Sunblock products
  await db.update(products)
    .set({ category: "Sunblock" })
    .where(eq(products.id, "20000000-0000-4000-8000-000000000009"));
  console.log("✓ ARCURE SPF 50 Sunblock → Sunblock");

  await db.update(products)
    .set({ category: "Sunblock" })
    .where(eq(products.id, "20000000-0000-4000-8000-000000000010"));
  console.log("✓ ARCURE Tinted Sunscreen SPF 30 → Sunblock");

  console.log("Done!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
