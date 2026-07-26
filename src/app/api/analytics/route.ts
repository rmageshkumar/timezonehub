import { NextRequest, NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/timezone-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    const device = body.device || (userAgent && /Mobi|Android/i.test(userAgent) ? "mobile" : "desktop");
    const browser = body.browser || (userAgent?.includes("Chrome") ? "Chrome" : userAgent?.includes("Firefox") ? "Firefox" : userAgent?.includes("Safari") ? "Safari" : "Other");

    await recordAnalyticsEvent({
      type: body.type || "pageview",
      data: body.data,
      ip: ip as string,
      device,
      browser,
      referrer: body.referrer,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
