import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerEmail,
      customerPhone,
      customerName,
      address,
      landmark,
      postalCode,
      items,
      deliveryFee,
      totalAmount,
    } = body;

    if (!customerEmail || !customerPhone || !address || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const newOrder = await db
      .insert(orders)
      .values({
        userId: user?.id || null,
        customerEmail,
        customerPhone,
        customerName: customerName || "",
        address,
        landmark: landmark || "",
        postalCode: postalCode || "",
        items: JSON.parse(items),
        deliveryFee: String(deliveryFee || 0),
        totalAmount: String(totalAmount),
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
