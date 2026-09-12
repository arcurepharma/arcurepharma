import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sliders } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allSliders = await db
      .select()
      .from(sliders)
      .orderBy(asc(sliders.order));
    return NextResponse.json(allSliders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, title, subtitle, order } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const newSlider = await db
      .insert(sliders)
      .values({ imageUrl, title, subtitle, order: order || 0 })
      .returning();

    return NextResponse.json(newSlider[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create slider" },
      { status: 500 }
    );
  }
}
