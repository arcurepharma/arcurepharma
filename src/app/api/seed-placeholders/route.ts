import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";

const PLACEHOLDERS = [
  // ── Face Wash (existing) ──
  {
    id: "20000000-0000-4000-8000-000000000001",
    title: "ARCU GLEAM Gentle Cleanser",
    price: "1299",
    description: "Mild soap-free face wash for sensitive skin. Removes impurities without stripping natural moisture.",
    category: "Face Wash",
    imageUrl: "/arcure/arcu-gleam.jpeg",
    images: ["/arcure/arcu-gleam.jpeg"],
    sku: "AGL-P01",
    isActive: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    title: "ARCU GLEAM Oil Control Wash",
    price: "1399",
    description: "Deep cleansing face wash for oily skin. Controls excess sebum and prevents breakouts.",
    category: "Face Wash",
    imageUrl: "/arcure/arcu-gleam.jpeg",
    images: ["/arcure/arcu-gleam.jpeg"],
    sku: "AOW-P02",
    isActive: 0,
  },
  // ── Serums (existing) ──
  {
    id: "20000000-0000-4000-8000-000000000004",
    title: "ARCUDERM Brightening Serum",
    price: "2499",
    description: "Advanced brightening serum with Niacinamide and Vitamin C. Fades dark spots and evens skin tone.",
    category: "Serums",
    imageUrl: "/arcure/Arcu_Gleam_Seerom.jpeg",
    images: ["/arcure/Arcu_Gleam_Seerom.jpeg"],
    sku: "ABS-P04",
    isActive: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    title: "ARCUDERM Hydra Boost Serum",
    price: "2799",
    description: "Intense hydration serum with Hyaluronic Acid. Plumps and moisturizes for visibly supple skin.",
    category: "Serums",
    imageUrl: "/arcure/Arcu_Gleam_Seerom2.jpeg",
    images: ["/arcure/Arcu_Gleam_Seerom2.jpeg"],
    sku: "AHB-P05",
    isActive: 0,
  },
  // ── Moisturizers (NEW) ──
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
  // ── Sunblock (NEW) ──
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

export async function POST() {
  try {
    for (const p of PLACEHOLDERS) {
      await db.insert(products).values(p).onConflictDoNothing();
    }
    return NextResponse.json({ success: true, count: PLACEHOLDERS.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
