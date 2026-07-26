import { NextRequest, NextResponse } from "next/server";
import { getActiveAds } from "@/lib/timezone-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placement = searchParams.get("placement") || "header_banner";

  try {
    const ads = await getActiveAds(placement);

    // Update impressions
    for (const ad of ads) {
      try {
        const { prisma } = await import("@/lib/prisma");
        await prisma.advertisement.update({
          where: { id: ad.id },
          data: { impressions: { increment: 1 } },
        });
      } catch {}
    }

    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json({ ads: [] });
  }
}
