import { Suspense } from "react";
import { db, isDbConfigured } from "@/db";
import { products, sliders, categories } from "@/db/schema";
import { sql, asc } from "drizzle-orm";
import HomeContent from "@/components/storefront/HomeContent";
import { DEFAULT_PRODUCTS } from "@/lib/default-products";
import { getActiveReels } from "@/lib/reels";

export const dynamic = "force-dynamic";

async function getInitialProducts(): Promise<any[]> {
  if (!isDbConfigured) return DEFAULT_PRODUCTS as any[];
  try {
    const rows = await db
      .select()
      .from(products)
      .orderBy(
        sql`CASE WHEN ${products.category} = 'Skin Care' THEN 0 WHEN ${products.category} = 'Supplements' THEN 1 ELSE 2 END`,
        products.createdAt
      );
    if (rows.length > 0) {
      return rows.map((p) => ({
        ...p,
        description: p.description || "",
        category: p.category || "General",
        images: p.images || [],
        benefits: p.benefits || [],
        ingredients: p.ingredients || "",
        formula: p.ingredients || "",
        videoUrl: p.videoUrl || null,
        sku: p.sku || "",
      }));
    }
  } catch {}
  return DEFAULT_PRODUCTS as any[];
}

async function getInitialSlides(): Promise<any[]> {
  if (!isDbConfigured) return [];
  try {
    const rows = await db.select().from(sliders).orderBy(asc(sliders.order));
    return rows.map((s) => ({
      id: s.id,
      imageUrl: s.imageUrl,
      title: s.title || "",
      subtitle: s.subtitle || "",
    }));
  } catch {}
  return [];
}

async function getInitialCategories(): Promise<any[]> {
  if (!isDbConfigured) return [];
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.name));
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.imageUrl || null,
    }));
  } catch {}
  return [];
}

async function getInitialReels(): Promise<any[]> {
  try {
    const rows = await getActiveReels();
    return rows.map((r) => ({
      id: r.id,
      src: r.videoUrl,
      handle: r.handle || "@arcurepharma",
      creator: r.creator || "Arcure Creator",
      product: r.product || "Arcure Formula",
    }));
  } catch {}
  return [];
}

export default async function HomePage() {
  const [initialProducts, initialSlides, initialCategories, initialReels] =
    await Promise.all([
      getInitialProducts(),
      getInitialSlides(),
      getInitialCategories(),
      getInitialReels(),
    ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#c8a882]" />}>
      <HomeContent
        initialProducts={initialProducts}
        initialSlides={initialSlides}
        initialCategories={initialCategories}
        initialReels={initialReels}
      />
    </Suspense>
  );
}
