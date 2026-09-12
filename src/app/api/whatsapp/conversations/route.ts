import { NextResponse } from "next/server";
import { db } from "@/db";
import { chatHistory } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "Active";
    const limit = parseInt(searchParams.get("limit") || "50");

    let conversations: any[] = [];

    if (status === "all") {
      conversations = await db
        .select()
        .from(chatHistory)
        .orderBy(desc(chatHistory.updatedAt))
        .limit(limit);
    } else {
      conversations = await db
        .select()
        .from(chatHistory)
        .where(eq(chatHistory.status, status))
        .orderBy(desc(chatHistory.updatedAt))
        .limit(limit);
    }

    return NextResponse.json({
      success: true,
      count: conversations.length,
      conversations: conversations.map((conv) => ({
        id: conv.id,
        sessionId: conv.sessionId,
        userName: conv.userName,
        userEmail: conv.userEmail,
        userPhone: conv.userPhone,
        messageCount: (conv.messages as any[])?.length || 0,
        status: conv.status,
        conversationType: conv.conversationType,
        shiftedToWhatsApp: conv.shiftedToWhatsApp,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessage:
          (conv.messages as any[]) && (conv.messages as any[]).length > 0
            ? (conv.messages as any[])[(conv.messages as any[]).length - 1]
                .content
            : "No messages",
      })),
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { sessionId, status, action } = await request.json();

    if (!sessionId || !action) {
      return NextResponse.json(
        { error: "Session ID and action are required" },
        { status: 400 }
      );
    }

    if (action === "updateStatus" && status) {
      await db
        .update(chatHistory)
        .set({ status, updatedAt: new Date() })
        .where(eq(chatHistory.sessionId, sessionId));

      return NextResponse.json({
        success: true,
        message: "Conversation status updated",
      });
    }

    if (action === "shiftToWhatsApp") {
      await db
        .update(chatHistory)
        .set({
          shiftedToWhatsApp: 1,
          status: "Transferred",
          updatedAt: new Date(),
        })
        .where(eq(chatHistory.sessionId, sessionId));

      return NextResponse.json({
        success: true,
        message: "Conversation shifted to WhatsApp",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
