import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));
    return NextResponse.json(allCategories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim();

    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, cleanName))
      .limit(1);

    if (existing.length) {
      return NextResponse.json(
        { error: "This category already exists" },
        { status: 409 }
      );
    }

    const newCategory = await db
      .insert(categories)
      .values({ name: cleanName })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
