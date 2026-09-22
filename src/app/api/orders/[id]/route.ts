import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = result[0];
    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    const updated = await db
      .update(orders)
      .set({
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        statusHistory: [
          ...history,
          { status, timestamp: now, note: "" },
        ],
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}