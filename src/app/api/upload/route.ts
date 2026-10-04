import { NextRequest, NextResponse } from "next/server";
import { getImagekit, isImageKitConfigured } from "@/lib/imagekit";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "arcurepharma";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If ImageKit is configured in .env, upload directly to ImageKit CDN
    if (isImageKitConfigured) {
      try {
        const result = await getImagekit().upload({
          file: buffer,
          fileName: file.name,
          folder,
        });
        return NextResponse.json({
          url: result.url,
          fileId: result.fileId,
          source: "imagekit",
        });
      } catch (uploadErr) {
        console.warn("ImageKit upload error, falling back to local:", uploadErr);
      }
    }

    // Fallback: save to public/ directory so the app works seamlessly
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    const subDir = isVideo ? path.join("videos", "reels") : path.join("uploads");
    const targetDir = path.join(process.cwd(), "public", subDir);
    await fs.mkdir(targetDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(targetDir, safeName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/${subDir.replace(/\\/g, "/")}/${safeName}`;

    return NextResponse.json({
      url: publicUrl,
      source: "local",
      message: "Uploaded locally (configure ImageKit in .env for CDN hosting)",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}



