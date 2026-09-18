import "dotenv/config";
import { db } from "../src/db";
import { products } from "../src/db/schema";

const PLACEHOLDERS = [
  // Moisturizers
  {
    id: "20000000-0000-4000-8000-000000000007",
    title: "ARCUDERM Daily Moisturizer",
    price: "1899",
    description: "Lightweight daily moisturizer with SPF protection. Keeps skin hydrated, soft and radiant all day.",
    category: "Moisturizers",
    imageUrl: "/arcure/Arcu_Gleam_Seerom3.jpeg",
    images: ["/arcure/Arcu_Gleam_Seerom3.jpeg"],
    sku: "ADM-P07",
    isActive: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000008",
    title: "ARCUDERM Night Repair Cream",
    price: "2299",
    description: "Deep repair night cream with Retinol and Peptides. Restores and rejuvenates skin overnight.",
    category: "Moisturizers",
    imageUrl: "/arcure/arcuderm-serum.png",
    images: ["/arcure/arcuderm-serum.png"],
    sku: "ANR-P08",
    isActive: 0,
  },
  // Sunblock
  {
    id: "20000000-0000-4000-8000-000000000009",
    title: "ARCURE SPF 50 Sunblock",
    price: "1599",
    description: "Broad spectrum SPF 50 sunblock. Protects against UVA & UVB rays. Lightweight, non-greasy formula.",
    category: "Sunblock",
    imageUrl: "/arcure/Arcu_Gleam_Seerom.jpeg",
    images: ["/arcure/Arcu_Gleam_Seerom.jpeg"],
    sku: "ASB-P09",
    isActive: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000010",
    title: "ARCURE Tinted Sunscreen SPF 30",
    price: "1799",
    description: "Tinted mineral sunscreen with SPF 30. Provides sun protection with a natural skin-tone finish.",
    category: "Sunblock",
    imageUrl: "/arcure/Arcu_Gleam_Seerom2.jpeg",
    images: ["/arcure/Arcu_Gleam_Seerom2.jpeg"],
    sku: "ATS-P10",
    isActive: 0,
  },
];

async function main() {
  console.log("Seeding placeholder products...");
  for (const p of PLACEHOLDERS) {
    await db.insert(products).values(p).onConflictDoNothing();
    console.log(`✓ ${p.title} (${p.category})`);
  }
  console.log("Done!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
