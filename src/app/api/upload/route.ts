import { NextRequest, NextResponse } from "next/server";
import { getImagekit, isImageKitConfigured } from "@/lib/imagekit";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "arcurepharma";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isImageKitConfigured) {
      return NextResponse.json(
        { error: "ImageKit is not configured. Add IMAGEKIT keys to .env." },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const result = await getImagekit().upload({
      file: dataUrl,
      fileName: file.name,
      folder,
    });

    return NextResponse.json({ url: result.url, fileId: result.fileId });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
