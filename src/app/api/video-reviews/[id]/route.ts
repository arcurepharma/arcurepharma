import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videoReviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isPlayableVideoUrl } from "@/lib/video-source";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(videoReviews)
      .where(eq(videoReviews.id, id))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Video review not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch video review" },
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
    const { title, customerName, videoUrl, thumbnailUrl, order, isActive } = body;

    const existing = await db
      .select({ id: videoReviews.id })
      .from(videoReviews)
      .where(eq(videoReviews.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Video review not found" }, { status: 404 });
    }

    if (videoUrl !== undefined && !isPlayableVideoUrl(videoUrl)) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(videoReviews)
      .set({
        title: title !== undefined ? String(title).trim() : undefined,
        customerName:
          customerName !== undefined ? String(customerName).trim() : undefined,
        videoUrl: videoUrl !== undefined ? String(videoUrl).trim() : undefined,
        thumbnailUrl:
          thumbnailUrl === undefined
            ? undefined
            : String(thumbnailUrl || "").trim() || null,
        order: order !== undefined ? Number(order) : undefined,
        isActive:
          isActive !== undefined ? (Number(isActive) ? 1 : 0) : undefined,
      })
      .where(eq(videoReviews.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update video review" },
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
    const existing = await db
      .select({ id: videoReviews.id })
      .from(videoReviews)
      .where(eq(videoReviews.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json({ error: "Video review not found" }, { status: 404 });
    }

    await db.delete(videoReviews).where(eq(videoReviews.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete video review" },
      { status: 500 }
    );
  }
}
