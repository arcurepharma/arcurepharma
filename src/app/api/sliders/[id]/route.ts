import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sliders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slider = await db
      .select()
      .from(sliders)
      .where(eq(sliders.id, id))
      .limit(1);

    if (!slider.length) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(slider[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch slider" },
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
    const { imageUrl, title, subtitle, order } = body;

    const updated = await db
      .update(sliders)
      .set({
        ...(imageUrl !== undefined && { imageUrl }),
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(order !== undefined && { order }),
      })
      .where(eq(sliders.id, id))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update slider" },
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
      .delete(sliders)
      .where(eq(sliders.id, id))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slider deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}
