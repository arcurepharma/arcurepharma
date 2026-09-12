import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allSettings = await db.select().from(settings);
    const settingsMap: Record<string, string> = {};
    allSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json(settingsMap);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing.length) {
      await db
        .update(settings)
        .set({ value: String(value) })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value: String(value) });
    }

    return NextResponse.json({ key, value: String(value) });
  } catch {
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
