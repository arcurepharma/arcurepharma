import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { products } from "@/db/schema";

export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json([]);
  }
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, description, category, imageUrl, images, videoUrl } =
      body;

    if (!title || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Title, price, and image are required" },
        { status: 400 }
      );
    }

    const imagesArr = Array.isArray(images) ? images : [];

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
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
