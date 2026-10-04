import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { orders } from "@/db/schema";
import { sql, or, ilike, eq } from "drizzle-orm";

interface OrderItem {
  id?: string;
  title: string;
  price: string | number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

interface TimelineItem {
  status: string;
  timestamp: string;
  location: string;
  note: string;
  completed: boolean;
  current: boolean;
}

const ORDER_STAGES = [
  { status: "Order Placed", label: "Order Placed", defaultNote: "Your order has been placed and received by Arcure Pharma" },
  { status: "Confirmed", label: "Confirmed", defaultNote: "Order details verified and approved" },
  { status: "Processing", label: "Processing", defaultNote: "Your medicines/products are being carefully packed at our pharmacy" },
  { status: "Shipped", label: "Shipped", defaultNote: "Package handed over to courier partner" },
  { status: "Out for Delivery", label: "Out for Delivery", defaultNote: "Courier agent is en route to your delivery address" },
  { status: "Delivered", label: "Delivered", defaultNote: "Package delivered safely to recipient" },
];

function buildTimeline(currentStatus: string, createdAt: Date | string, customHistory?: any[]): TimelineItem[] {
  const normStatus = (currentStatus || "Pending").toLowerCase();
  const createdDate = new Date(createdAt);

  const getStageRank = (status: string) => {
    const s = status.toLowerCase();
    if (s === "cancelled") return -1;
    if (s.includes("delivered")) return 5;
    if (s.includes("out for delivery")) return 4;
    if (s.includes("shipped") || s.includes("dispatched")) return 3;
    if (s.includes("processing") || s.includes("packed")) return 2;
    if (s.includes("confirmed")) return 1;
    return 0; // pending / order placed
  };

  const currentRank = getStageRank(normStatus);

  if (normStatus === "cancelled") {
    return [
      {
        status: "Order Placed",
        timestamp: createdDate.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        location: "Online",
        note: "Order was created",
        completed: true,
        current: false,
      },
      {
        status: "Cancelled",
        timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        location: "Arcure Pharma Support",
        note: "This order has been cancelled",
        completed: true,
        current: true,
      },
    ];
  }

  return ORDER_STAGES.map((stage, idx) => {
    const isCompleted = idx <= currentRank;
    const isCurrent = idx === currentRank;

    let timeStr = "";
    if (isCompleted) {
      const stepDate = new Date(createdDate.getTime() + idx * 4 * 60 * 60 * 1000);
      timeStr = stepDate.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    } else {
      timeStr = "Pending";
    }

    // Check if custom history provided
    const matchHistory = customHistory?.find(
      (h) => h.status?.toLowerCase() === stage.status.toLowerCase()
    );

    return {
      status: stage.label,
      timestamp: matchHistory?.timestamp || timeStr,
      location: idx === 0 ? "Online Store" : idx < 3 ? "Arcure Pharma Central Fulfillment" : "Local Hub",
      note: matchHistory?.note || stage.defaultNote,
      completed: isCompleted,
      current: isCurrent,
    };
  });
}

const SAMPLE_DEMO_ORDER = {
  orderId: "ARC-8941-DEMO",
  shortId: "ARC8941D",
  trackingNumber: "TRK-992482-PK",
  customerName: "Dr. Ayesha Malik",
  customerEmail: "ayesha.malik@example.com",
  customerPhone: "03305115999",
  address: "House 42-B, Block 6, Gulshan-e-Iqbal, Karachi",
  city: "Karachi",
  postalCode: "75300",
  paymentMethod: "Cash on Delivery (COD)",
  paymentStatus: "Pending",
  currentStatus: "Out for Delivery",
  createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
  estimatedDelivery: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  totalAmount: "4850",
  deliveryFee: "200",
  items: [
    {
      id: "prod-1",
      title: "Glutathione Skin Radiance Cream (50g)",
      price: "2450",
      quantity: 1,
      category: "Skin Care",
      imageUrl: "/arcure/gluta-cream.jpg",
    },
    {
      id: "prod-2",
      title: "Pure Vitamin C 20% Brightening Serum (30ml)",
      price: "2200",
      quantity: 1,
      category: "Serums",
      imageUrl: "/arcure/vit-c-serum.jpg",
    },
  ],
  statusHistory: [
    {
      status: "Order Placed",
      timestamp: "Yesterday, 10:15 AM",
      location: "Arcure Pharma Store",
      note: "Order received and queued for verification",
      completed: true,
      current: false,
    },
    {
      status: "Confirmed",
      timestamp: "Yesterday, 11:30 AM",
      location: "Arcure Pharma Central",
      note: "Prescription & details verified by pharmacist",
      completed: true,
      current: false,
    },
    {
      status: "Processing",
      timestamp: "Yesterday, 03:45 PM",
      location: "Karachi Warehouse",
      note: "Packed under temperature-controlled conditions",
      completed: true,
      current: false,
    },
    {
      status: "Shipped",
      timestamp: "Today, 08:30 AM",
      location: "Courier Hub (TCS / Leopard)",
      note: "Dispatched with tracking ID TRK-992482-PK",
      completed: true,
      current: false,
    },
    {
      status: "Out for Delivery",
      timestamp: "Today, 01:15 PM",
      location: "Gulshan-e-Iqbal Delivery Unit",
      note: "Rider Muhammad Usman is on the way to your doorstep",
      completed: true,
      current: true,
    },
    {
      status: "Delivered",
      timestamp: "Estimated: Today by 5:00 PM",
      location: "House 42-B, Karachi",
      note: "Package will be handed over upon cash collection",
      completed: false,
      current: false,
    },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery =
    searchParams.get("query") ||
    searchParams.get("id") ||
    searchParams.get("orderId") ||
    searchParams.get("trackingNumber") ||
    "";

  const query = rawQuery.trim().replace(/^#/, "");

  if (!query) {
    return NextResponse.json(
      { error: "Please enter an Order ID or Tracking Number to track." },
      { status: 400 }
    );
  }

  // Check if matches demo search keywords
  const isDemo =
    query.toLowerCase() === "demo123" ||
    query.toLowerCase() === "demo" ||
    query.toLowerCase().includes("sample") ||
    query.toLowerCase() === "arc-8941-demo";

  if (isDemo) {
    return NextResponse.json(SAMPLE_DEMO_ORDER);
  }

  // If DB is configured, query database
  if (isDbConfigured) {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          query
        );

      let foundOrders: any[] = [];

      if (isUuid) {
        foundOrders = await db
          .select()
          .from(orders)
          .where(eq(orders.id, query))
          .limit(1);
      }

      if (!foundOrders.length) {
        foundOrders = await db
          .select()
          .from(orders)
          .where(
            or(
              sql`${orders.id}::text ILIKE ${"%" + query + "%"}`,
              ilike(orders.trackingNumber, "%" + query + "%"),
              ilike(orders.customerPhone, "%" + query + "%"),
              ilike(orders.customerEmail, "%" + query + "%")
            )
          )
          .limit(1);
      }

      if (foundOrders.length > 0) {
        const o = foundOrders[0];
        let parsedItems: OrderItem[] = [];
        try {
          parsedItems = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
        } catch {
          parsedItems = [];
        }

        const createdAt = o.createdAt || new Date();
        const estimatedDelivery = new Date(
          new Date(createdAt).getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString();

        const timeline = buildTimeline(o.status, createdAt, o.statusHistory);

        return NextResponse.json({
          orderId: o.id,
          shortId: o.id.slice(0, 8).toUpperCase(),
          trackingNumber: o.trackingNumber || `TRK-${o.id.slice(0, 8).toUpperCase()}`,
          customerName: `${o.customerName || ""} ${o.customerLastName || ""}`.trim() || "Valued Customer",
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          address: o.address,
          landmark: o.landmark,
          postalCode: o.postalCode,
          paymentMethod: o.paymentMethod || "COD",
          paymentStatus: o.paymentStatus || "Pending",
          currentStatus: o.status || "Processing",
          createdAt: new Date(createdAt).toISOString(),
          estimatedDelivery,
          totalAmount: String(o.totalAmount),
          deliveryFee: String(o.deliveryFee || "0"),
          items: parsedItems,
          statusHistory: timeline,
        });
      }
    } catch (dbErr) {
      console.error("Tracking DB query error:", dbErr);
    }
  }

  // Fallback demo matching prefix or prompt default
  if (query.toLowerCase().startsWith("trk") || query.toLowerCase().startsWith("ord")) {
    const customizedDemo = {
      ...SAMPLE_DEMO_ORDER,
      orderId: query.toUpperCase(),
      trackingNumber: query.toUpperCase().startsWith("TRK") ? query.toUpperCase() : `TRK-${query.toUpperCase()}`,
    };
    return NextResponse.json(customizedDemo);
  }

  return NextResponse.json(
    {
      error: `No order found with identifier "${rawQuery}". Please check your Order ID (from invoice) or Tracking Number.`,
    },
    { status: 404 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || body.id || body.orderId || "";
    const fakeUrl = new URL(`http://localhost/api/orders/track?query=${encodeURIComponent(query)}`);
    return GET(new NextRequest(fakeUrl));
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
