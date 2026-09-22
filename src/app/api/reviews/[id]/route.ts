import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const patch: Record<string, unknown> = {};
    if (body.approved !== undefined) patch.approved = body.approved ? 1 : 0;
    if (body.name !== undefined) patch.name = body.name;
    if (body.role !== undefined) patch.role = body.role;
    if (body.rating !== undefined) patch.rating = Number(body.rating);
    if (body.text !== undefined) patch.text = body.text;
    if (body.imageUrl !== undefined) patch.imageUrl = body.imageUrl;
    if (body.order !== undefined) patch.order = Number(body.order);

    const updated = await db
      .update(reviews)
      .set(patch)
      .where(eq(reviews.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await db.delete(reviews).where(eq(reviews.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}