import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { sendOrderNotificationEmail } from "@/lib/mailer";

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
      paymentMethod,
      notes,
    } = body;

    if (!customerEmail || !customerPhone || !address || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const parsedItems = JSON.parse(items);

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
        items: parsedItems,
        deliveryFee: String(deliveryFee || 0),
        totalAmount: String(totalAmount),
        paymentMethod: paymentMethod || "COD",
        notes: notes || null,
      })
      .returning();

    const order = newOrder[0];

    // Send notification email â€” fire and forget (don't block the response)
    sendOrderNotificationEmail({
      orderId: order.id,
      customerName: customerName || "",
      customerEmail,
      customerPhone,
      address,
      landmark: landmark || "",
      postalCode: postalCode || "",
      items: parsedItems,
      totalAmount: String(totalAmount),
      deliveryFee: String(deliveryFee || 0),
      paymentMethod: paymentMethod || "COD",
    }).catch((err) => {
      console.error("Order email failed:", err);
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}



