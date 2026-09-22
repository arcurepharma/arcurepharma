import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

const existing = await db
      .select({ id: products.id, imageUrl: products.imageUrl })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await db
      .update(products)
      .set({ views: sql`${products.views} + 1` })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      price,
      description,
      category,
      imageUrl,
      images,
      videoUrl,
      benefits,
      ingredients,
      howToUse,
      warnings,
      isPrescriptionRequired,
      sku,
      isActive,
    } = body;

    const existing = await db
      .select({ id: products.id, imageUrl: products.imageUrl })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const imagesArr = Array.isArray(images)
      ? images.filter(Boolean)
      : body.images !== undefined
        ? []
        : undefined;

    const updated = await db
      .update(products)
      .set({
        title: title !== undefined ? title : undefined,
        price: price !== undefined ? String(price) : undefined,
        description: description !== undefined ? description : undefined,
        category: category !== undefined ? category : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        images:
          body.images !== undefined
            ? imagesArr!.length
              ? imagesArr
              : [imageUrl || existing[0].imageUrl]
            : undefined,
        videoUrl: videoUrl !== undefined ? videoUrl : undefined,
        benefits: benefits !== undefined ? benefits : undefined,
        ingredients: ingredients !== undefined ? ingredients : undefined,
        howToUse: howToUse !== undefined ? howToUse : undefined,
        warnings: warnings !== undefined ? warnings : undefined,
        isPrescriptionRequired:
          isPrescriptionRequired !== undefined ? Number(isPrescriptionRequired) : undefined,
        sku: sku !== undefined ? sku : undefined,
        isActive: isActive !== undefined ? Number(isActive) : undefined,
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}