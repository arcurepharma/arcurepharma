import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(complaints)
      .set({ status })
      .where(eq(complaints.id, id))
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update complaint" },
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
      .delete(complaints)
      .where(eq(complaints.id, id))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Complaint deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete complaint" },
      { status: 500 }
    );
  }
}