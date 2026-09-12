import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { sendWhatsAppMessage, isWhatsAppConnected } from "@/lib/whatsapp";
import { db } from "@/db";
import { chatHistory } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const { phoneNumber, message, sessionId, userName, userEmail } =
      await request.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: "Phone number and message are required" },
        { status: 400 }
      );
    }

    if (!isWhatsAppConnected()) {
      return NextResponse.json(
        { error: "WhatsApp not connected. Please connect first." },
        { status: 503 }
      );
    }

    // Send the message
    const success = await sendWhatsAppMessage(phoneNumber, message);

    if (success && sessionId) {
      // Save to database
      try {
        const existingChat = await db
          .select()
          .from(chatHistory)
          .where(eq(chatHistory.sessionId, sessionId))
          .limit(1);

        const timestamp = new Date().toISOString();
        const newMessage = {
          role: "user",
          content: message,
          timestamp,
        };

        if (existingChat.length > 0) {
          const existing = existingChat[0];
          const updatedMessages = [...(existing.messages || []), newMessage];

          await db
            .update(chatHistory)
            .set({
              messages: updatedMessages,
              updatedAt: new Date(),
            })
            .where(eq(chatHistory.sessionId, sessionId));
        } else {
          await db.insert(chatHistory).values({
            sessionId,
            userPhone: phoneNumber,
            userName: userName || "Guest",
            userEmail: userEmail || "",
            messages: [newMessage],
          });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Don't fail the API call, just log the error
      }
    }

    return NextResponse.json({
      success,
      message: success ? "Message sent successfully" : "Failed to send message",
    });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
