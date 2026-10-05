import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { DEFAULT_PRODUCTS } from "@/lib/default-products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const category = searchParams.get("category")?.toLowerCase().trim() || "";

  let list: any[] = [];

  if (isDbConfigured) {
    try {
      const allProducts = await db
        .select()
        .from(products)
        .orderBy(
          sql`CASE WHEN ${products.category} = 'Skin Care' THEN 0 WHEN ${products.category} = 'Supplements' THEN 1 ELSE 2 END`,
          products.createdAt
        );

      if (allProducts && allProducts.length > 0) {
        list = allProducts.map((p) => ({
          ...p,
          formula: p.ingredients || "",
        }));
      }
    } catch {
      // Fallback below
    }
  }

  // If DB not configured or returned no items, use default products catalogue
  if (!list || list.length === 0) {
    list = DEFAULT_PRODUCTS;
  }

  if (category) {
    list = list.filter(
      (p) => (p.category || "").toLowerCase() === category
    );
  }

  if (q) {
    list = list.filter((p) => {
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchCat = (p.category || "").toLowerCase().includes(q);
      const matchDesc = (p.description || "").toLowerCase().includes(q);
      const matchIngr = (p.ingredients || p.formula || "").toLowerCase().includes(q);
      const matchSku = (p.sku || "").toLowerCase().includes(q);
      return matchTitle || matchCat || matchDesc || matchIngr || matchSku;
    });
  }

  return NextResponse.json(list, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      price,
      description,
      category,
      imageUrl,
      images,
      videoUrl,
      formula,
      ingredients,
    } = body;

    if (!title || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Title, price, and image are required" },
        { status: 400 }
      );
    }

    const imagesArr = Array.isArray(images) ? images : [];
    const formulaVal = (formula !== undefined ? formula : ingredients) || "";

    const newProduct = await db
      .insert(products)
      .values({
        title,
        price: String(price),
        description,
        category,
        imageUrl,
        images: imagesArr.length ? imagesArr : [imageUrl],
        videoUrl: videoUrl || null,
        ingredients: formulaVal,
      })
      .returning();

    return NextResponse.json(
      { ...newProduct[0], formula: newProduct[0].ingredients || "" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
