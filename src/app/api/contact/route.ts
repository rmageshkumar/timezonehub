import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function verifyCaptcha(token: string, answer: string): boolean {
  if (!token || !answer) return false;
  if (token.length < 20) {
    try { return atob(token) === answer.trim(); } catch { return false; }
  }
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");
    if (parts.length !== 4) return false;
    const [, expectedAnswer, timestampStr, signature] = parts;
    if (Date.now() - parseInt(timestampStr, 10) > 10 * 60 * 1000) return false;
    const payload = parts.slice(0, 3).join("|");
    const secret = process.env.AUTH_SECRET || "fallback-secret";
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (signature !== expectedSig) return false;
    return answer.trim() === expectedAnswer;
  } catch { return false; }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!verifyCaptcha(body.captchaToken, body.captchaAnswer)) {
      return NextResponse.json({ error: "Incorrect captcha answer" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
        status: "unread",
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
