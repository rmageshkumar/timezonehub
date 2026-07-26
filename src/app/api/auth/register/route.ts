import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function verifyCaptcha(token: string, answer: string): boolean {
  if (!token || !answer) return false;

  // Backward-compatible fallback: simple base64 token (generated client-side on API failure)
  if (token.length < 20) {
    try {
      const expected = atob(token);
      return expected === answer.trim();
    } catch {
      return false;
    }
  }

  // HMAC-signed token
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");
    if (parts.length !== 4) return false;

    const [, expectedAnswer, timestampStr, signature] = parts;

    // Check expiry: 10 minutes
    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() - timestamp > 10 * 60 * 1000) return false;

    // Verify HMAC
    const payload = parts.slice(0, 3).join("|");
    const secret = process.env.AUTH_SECRET || "fallback-secret";
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (signature !== expectedSig) return false;

    return answer.trim() === expectedAnswer;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, captchaToken, captchaAnswer } = await request.json();

    // Validate captcha
    if (!verifyCaptcha(captchaToken, captchaAnswer)) {
      return NextResponse.json({ error: "Incorrect captcha answer. Please try again." }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token (24-hour expiry)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        role: "user",
        status: "active",
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Log the registration
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "user_registered",
        details: JSON.stringify({ email: user.email }),
      },
    });

    // Build verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

    // Log verification link (in production, send via email)
    console.log(`📧 Verification email for ${email}: ${verifyUrl}`);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      verificationUrl: verifyUrl,
      message: "Account created! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
