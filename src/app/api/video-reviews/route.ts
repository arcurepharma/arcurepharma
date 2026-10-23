import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videoReviews } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { isPlayableVideoUrl } from "@/lib/video-source";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "1";

  // Public feed only shows active videos, admin passes ?all=1 for everything.
  const where = showAll ? undefined : eq(videoReviews.isActive, 1);

  try {
    const all = await db
      .select()
      .from(videoReviews)
      .where(where)
      .orderBy(asc(videoReviews.order), desc(videoReviews.createdAt));
    return NextResponse.json(all);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch video reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, customerName, videoUrl, thumbnailUrl, order, isActive } = body;

    if (!isPlayableVideoUrl(videoUrl)) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    const created = await db
      .insert(videoReviews)
      .values({
        title: String(title || "").trim(),
        customerName: String(customerName || "").trim(),
        videoUrl: String(videoUrl).trim(),
        thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : null,
        order: order || 0,
        isActive: isActive === undefined ? 1 : Number(isActive) ? 1 : 0,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create video review" },
      { status: 500 }
    );
  }
}
