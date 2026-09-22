import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sliders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(sliders)
      .where(eq(sliders.id, id))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch slider" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { imageUrl, title, subtitle, order } = body;

    const existing = await db
      .select({ id: sliders.id })
      .from(sliders)
      .where(eq(sliders.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    const updated = await db
      .update(sliders)
      .set({
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        order: order !== undefined ? Number(order) : undefined,
      })
      .where(eq(sliders.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update slider" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await db
      .select({ id: sliders.id })
      .from(sliders)
      .where(eq(sliders.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    await db.delete(sliders).where(eq(sliders.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}