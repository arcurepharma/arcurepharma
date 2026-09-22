import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

const MAX_NAME_LENGTH = 60;
const MAX_TEXT_LENGTH = 600;
const MIN_TEXT_LENGTH = 10;
const MAX_SUBMISSIONS_PER_HOUR = 3;
const rateLimit: Record<string, number[]> = {};

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const times = (rateLimit[key] || []).filter((t) => now - t < hour);
  rateLimit[key] = times;
  return times.length >= MAX_SUBMISSIONS_PER_HOUR;
}

function recordSubmission(key: string) {
  if (!rateLimit[key]) rateLimit[key] = [];
  rateLimit[key].push(Date.now());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "1";

  // Admin flow: ?all=1 returns every review (including pending).
  // Public flow: only approved reviews are visible.
  const where = showAll ? undefined : eq(reviews.approved, 1);

  try {
    const allReviews = await db
      .select()
      .from(reviews)
      .where(where)
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
    const { name, role, rating, text, imageUrl, order, website } = body;

    // Honeypot: bots usually fill every field. Silently ignore them.
    if (website) {
      return NextResponse.json(
        { message: "Thanks! Your review has been received." },
        { status: 201 }
      );
    }

    const trimmedName = String(name || "").trim();
    const trimmedText = String(text || "").trim();

    // Boundary validation â€” the "feedback collector bot" guard rails.
    if (!trimmedName) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (trimmedName.length < 2 || trimmedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be between 2 and ${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (!trimmedText) {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }
    if (trimmedText.length < MIN_TEXT_LENGTH || trimmedText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Review must be between ${MIN_TEXT_LENGTH} and ${MAX_TEXT_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const clampedRating = Math.min(
      5,
      Math.max(1, Math.round(Number(rating) || 5))
    );

    // Simple rate limit per IP to stop spam flooding.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many reviews submitted. Please try again later." },
        { status: 429 }
      );
    }
    recordSubmission(ip);

    // Submitted reviews always start as pending and need admin approval.
    const newReview = await db
      .insert(reviews)
      .values({
        name: trimmedName,
        role: String(role || "").trim(),
        rating: clampedRating,
        text: trimmedText,
        imageUrl: imageUrl || null,
        order: order || 0,
        approved: 0,
      })
      .returning();

    return NextResponse.json(
      { ...newReview[0], approved: false },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}


