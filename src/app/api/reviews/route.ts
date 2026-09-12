import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { asc, desc } from "drizzle-orm";

export async function GET() {
  try {
    const allReviews = await db
      .select()
      .from(reviews)
      .orderBy(asc(reviews.order), desc(reviews.createdAt));
    return NextResponse.json(allReviews);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, rating, text, imageUrl, order } = body;

    if (!name || !text) {
      return NextResponse.json(
        { error: "Name and review text are required" },
        { status: 400 }
      );
    }

    const clampedRating = Math.min(
      5,
      Math.max(1, Math.round(Number(rating) || 5))
    );

    const newReview = await db
      .insert(reviews)
      .values({
        name,
        role: role || "",
        rating: clampedRating,
        text,
        imageUrl: imageUrl || null,
        order: order || 0,
      })
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}