import { NextRequest, NextResponse } from "next/server";
import { getAllReels, getActiveReels, createReel } from "@/lib/reels";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const items = showAll ? await getAllReels() : await getActiveReels();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch reels:", error);
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoUrl, title, creator, handle, product, order, isActive } = body;

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "Video URL or uploaded file is required" },
        { status: 400 }
      );
    }

    const created = await createReel({
      videoUrl: videoUrl.trim(),
      title: title?.trim() || "",
      creator: creator?.trim() || "Arcure Creator",
      handle: handle?.trim() || "@arcurepharma",
      product: product?.trim() || "Skin Care Essentials",
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create reel:", error);
    return NextResponse.json({ error: "Failed to create reel" }, { status: 500 });
  }
}
