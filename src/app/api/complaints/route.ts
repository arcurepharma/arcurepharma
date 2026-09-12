import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allComplaints = await db
      .select()
      .from(complaints)
      .orderBy(desc(complaints.createdAt));
    return NextResponse.json(allComplaints);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, orderId, subject, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const newComplaint = await db
      .insert(complaints)
      .values({
        name: name || "",
        email,
        orderId: orderId || "",
        subject: subject || "",
        message,
      })
      .returning();

    return NextResponse.json(newComplaint[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit complaint" },
      { status: 500 }
    );
  }
}