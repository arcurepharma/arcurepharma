import { NextRequest, NextResponse } from "next/server";
import { sendOrderNotificationEmail, getEmailCredentials } from "@/lib/mailer";

export async function GET(request: NextRequest) {
  const { user, pass } = getEmailCredentials();
  const url = new URL(request.url);
  // If ?send=1, execute the test email
  if (url.searchParams.get("send") === "1") {
    return handleTest(request);
  }
  return NextResponse.json({
    status: "ok",
    senderEmail: user,
    passConfigured: Boolean(pass),
    passLength: pass ? pass.length : 0,
    hasEnvPass: Boolean(process.env.EMAIL_PASS),
    hasEnvUser: Boolean(process.env.EMAIL_USER),
  });
}

export async function POST(request: NextRequest) {
  return handleTest(request);
}

async function handleTest(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const targetEmail =
      url.searchParams.get("to") ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      "arcurepharma3007@gmail.com";

    const testOrder = {
      orderId: `TEST-${Date.now().toString().slice(-6)}`,
      customerName: "Test Notification",
      customerLastName: "Verification",
      customerEmail: targetEmail,
      customerPhone: "+92 330 5115999",
      address: "Arcure Pharma Head Office, Pakistan",
      landmark: "Near Main Boulevard",
      postalCode: "54000",
      items: [
        {
          title: "Ultimate Radiance Skincare Bundle (Test)",
          price: "7999",
          quantity: 1,
        },
      ],
      totalAmount: "7999",
      deliveryFee: "0",
      paymentMethod: "Cash on Delivery (Test)",
    };

    const result = await sendOrderNotificationEmail(testOrder);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test order notification email successfully dispatched to ${targetEmail} (via Port ${result.portUsed || 465})`,
        messageId: result.messageId,
        orderId: testOrder.orderId,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            result.error ||
            "Failed to dispatch email. Check SMTP credentials or server logs.",
        },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
