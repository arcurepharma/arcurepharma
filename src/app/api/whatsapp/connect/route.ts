import { NextResponse } from "next/server";
import { connectWhatsApp, isWhatsAppConnected } from "@/lib/whatsapp";

export async function POST() {
  try {
    const connected = isWhatsAppConnected();

    if (connected) {
      return NextResponse.json({
        success: true,
        message: "WhatsApp already connected",
        connected: true,
      });
    }

    // Attempt connection
    await connectWhatsApp();

    return NextResponse.json({
      success: true,
      message: "WhatsApp connection initiated. Check server logs for QR code.",
      connected: isWhatsAppConnected(),
    });
  } catch (error) {
    console.error("WhatsApp connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect WhatsApp",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const connected = isWhatsAppConnected();
    return NextResponse.json({
      connected,
      message: connected
        ? "WhatsApp is connected"
        : "WhatsApp is not connected",
    });
  } catch (error) {
    console.error("Error checking WhatsApp status:", error);
    return NextResponse.json(
      { connected: false, error: "Failed to check status" },
      { status: 500 }
    );
  }
}
