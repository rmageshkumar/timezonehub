import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await prisma.feedback.create({
      data: {
        type: body.type || "suggestion",
        title: body.title,
        content: body.content,
        status: "open",
        priority: "medium",
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
