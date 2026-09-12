import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    if (!review.length) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role, rating, text, imageUrl, order } = body;

    const clampedRating =
      rating !== undefined
        ? Math.min(5, Math.max(1, Math.round(Number(rating) || 5)))
        : undefined;

    const updated = await db
      .update(reviews)
      .set({
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(clampedRating !== undefined && { rating: clampedRating }),
        ...(text !== undefined && { text }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
      })
      .where(eq(reviews.id, id))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}