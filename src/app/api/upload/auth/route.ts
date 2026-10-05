import { NextResponse } from "next/server";
import { getImagekit, isImageKitConfigured } from "@/lib/imagekit";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isImageKitConfigured) {
    return NextResponse.json(
      { error: "ImageKit is not configured" },
      { status: 500 }
    );
  }

  try {
    const ik = getImagekit();
    const auth = ik.getAuthenticationParameters();
    return NextResponse.json({
      ...auth,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Failed to generate ImageKit auth params:", error);
    return NextResponse.json(
      { error: "Failed to generate auth parameters" },
      { status: 500 }
    );
  }
}
