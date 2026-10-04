import { NextRequest, NextResponse } from "next/server";
import { getReelById, updateReel, deleteReel } from "@/lib/reels";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reel = await getReelById(id);

    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json(reel);
  } catch (error) {
    console.error("Failed to fetch reel:", error);
    return NextResponse.json({ error: "Failed to fetch reel" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateReel(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update reel:", error);
    return NextResponse.json({ error: "Failed to update reel" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteReel(id);

    if (!deleted) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Reel deleted" });
  } catch (error) {
    console.error("Failed to delete reel:", error);
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}
