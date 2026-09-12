import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chatHistory, products } from "@/db/schema";

// Groq API client
async function getGroqResponse(userMessage: string): Promise<string> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY not configured");
      return getDefaultResponse(userMessage);
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are a helpful customer support chatbot for Arcure Pharma, a Pakistani pharmaceutical and skincare company. 
            
You should help customers with:
- Product information (ARCUDERM CS Serum Rs.2999, ARCU GLEAM Face Wash Rs.1499, ARCU-CAL K2 Rs.1999, Mida-D Vitamin D3 Rs.1799)
- Order tracking
- Payment options (COD, JazzCash, EasyPaisa, Card)
- Prescription verification
- General customer support

Be friendly, helpful, and professional. Keep responses concise. Use emojis where appropriate.`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", response.status, response.statusText);
      return getDefaultResponse(userMessage);
    }

    const data = await response.json();
    return data.choices[0].message.content || getDefaultResponse(userMessage);
  } catch (error) {
    console.error("Groq API error:", error);
    return getDefaultResponse(userMessage);
  }
}

function getDefaultResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Keyword matching fallback
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("assalam")
  ) {
    return `👋 Welcome to Arcure Pharma Support!

I'm here to help you with:
1️⃣ Product Information
2️⃣ Order Tracking
3️⃣ Payment Options
4️⃣ General Questions

How can I assist you today?`;
  }

  if (
    message.includes("product") ||
    message.includes("items") ||
    message.includes("serum") ||
    message.includes("gleam") ||
    message.includes("k2")
  ) {
    return `🏥 Our Popular Products:

1. ARCUDERM CS Serum - Rs. 2,999 (Anti-aging, Hydrating)
2. ARCU GLEAM Face Wash - Rs. 1,499 (Gentle cleanser)
3. ARCU-CAL K2 - Rs. 1,999 (Vitamin K2)
4. Mida-D Vitamin D3 - Rs. 1,799 (Supplement)

Which product would you like to know more about?`;
  }

  if (
    message.includes("price") ||
    message.includes("cost") ||
    message.includes("rupee") ||
    message.includes("payment")
  ) {
    return `💳 Payment Options:

✅ Cash on Delivery (COD)
✅ JazzCash/EasyPaisa
✅ Credit/Debit Card
✅ Bank Transfer

All payments are secure and encrypted.`;
  }

  if (message.includes("track") || message.includes("order")) {
    return `📦 Order Tracking:

To track your order, please provide your Order ID or Email. Our team will help you with real-time updates.`;
  }

  if (message.includes("prescription") || message.includes("doctor")) {
    return `📋 Prescription Verification:

For prescription-required products, please share:
- Your prescription (image/PDF)
- Doctor's contact information
- Patient name

Our team will verify within 24 hours.`;
  }

  if (message.includes("help") || message.includes("contact")) {
    return `📞 Need More Help?

For urgent matters, contact us:
📱 WhatsApp: 03162647620
📧 Email: support@arcurepharma.com

Our team is available 24/7!`;
  }

  return `✨ Thanks for your interest in Arcure Pharma!

I can help you with:
🏥 Product details
💳 Payment information
📦 Order tracking
📋 Prescription verification
📞 Customer support

Just ask me about any of these topics!`;
}

export async function POST(request: Request) {
  try {
    const { sessionId, userMessage, userName, userEmail } =
      await request.json();

    if (!sessionId || !userMessage) {
      return NextResponse.json(
        { error: "Session ID and message are required" },
        { status: 400 }
      );
    }

    // Get response from Groq API (with fallback to default)
    const botResponse = await getGroqResponse(userMessage);
    const timestamp = new Date().toISOString();

    // Save messages to database
    try {
      const existingChat = await db
        .select()
        .from(chatHistory)
        .where(eq(chatHistory.sessionId, sessionId))
        .limit(1);

      const userMsg = { role: "user", content: userMessage, timestamp };
      const botMsg = { role: "bot", content: botResponse, timestamp };

      if (existingChat.length > 0) {
        const existing = existingChat[0];
        const updatedMessages = [...(existing.messages || []), userMsg, botMsg];

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
          userPhone: "",
          userName: userName || "Guest",
          userEmail: userEmail || "",
          messages: [userMsg, botMsg],
          status: "Active",
          conversationType: "Support",
        });
      }
    } catch (dbError) {
      console.error("Database error saving chat:", dbError);
    }

    return NextResponse.json({
      success: true,
      response: botResponse,
      timestamp,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve chat history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const chat = await db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.sessionId, sessionId))
      .limit(1);

    if (chat.length === 0) {
      return NextResponse.json({ messages: [], found: false });
    }

    return NextResponse.json({
      messages: chat[0].messages || [],
      found: true,
      sessionInfo: {
        userName: chat[0].userName,
        userEmail: chat[0].userEmail,
        userPhone: chat[0].userPhone,
        status: chat[0].status,
      },
    });
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
