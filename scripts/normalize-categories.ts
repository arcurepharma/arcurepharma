import "dotenv/config";
import { db } from "../src/db";
import { categories, products } from "../src/db/schema";
import { eq, inArray } from "drizzle-orm";

const SKIN_CARE = "Skin Care";
const SUPPLEMENTS = "Supplements";

const SKIN_CARE_CATS = [
  "Skin Care",
  "Skincare",
  "Serums",
  "Serum",
  "Facewash",
  "Face Wash",
  "Moisturizers",
  "Moisturizer",
  "Sunblock",
  "Sun Block",
  "Sunscreen",
];

async function mapCategory(name: string | null | undefined): Promise<string> {
  const n = (name || "").trim();
  if (SKIN_CARE_CATS.includes(n)) return SKIN_CARE;
  const lower = n.toLowerCase();
  if (lower.includes("skin") || lower.includes("serum") || lower.includes("face") ||
      lower.includes("moist") || lower.includes("sun") || lower.includes("spf") ||
      lower.includes("cream") || lower.includes("cleans")) {
    return SKIN_CARE;
  }
  return SUPPLEMENTS;
}

async function main() {
  // 1. Reset categories to exactly the two fixed ones.
  console.log("Clearing categories table...");
  await db.delete(categories);

  await db.insert(categories).values([
    { name: SKIN_CARE, imageUrl: "/categories/skin-care.png" },
    { name: SUPPLEMENTS, imageUrl: "/categories/oral-medicines.png" },
  ]);
  console.log("Inserted Skin Care + Supplements");

  // 2. Reclassify every product into one of the two categories.
  const allProducts = await db.select().from(products);
  for (const p of allProducts) {
    const target = await mapCategory(p.category);
    if (p.category !== target) {
      await db.update(products).set({ category: target }).where(eq(products.id, p.id));
      console.log(`  ${p.title} [${p.category}] -> ${target}`);
    }
  }

  // 3. Report final state.
  const final = await db
    .select({ category: products.category })
    .from(products)
    .where(inArray(products.category, [SKIN_CARE, SUPPLEMENTS]));
  const counts = final.reduce<Record<string, number>>((acc, p) => {
    const key = p.category ?? "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log("Final product category counts:", counts);

  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});