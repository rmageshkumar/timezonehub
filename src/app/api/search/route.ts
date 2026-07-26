import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/lib/timezone-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q || q.length < 1) {
    return NextResponse.json({ countries: [], cities: [], timezones: [] });
  }

  try {
    const results = await searchAll(q);

    // Record analytics
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.analyticsEvent.create({
        data: {
          type: "search",
          data: JSON.stringify({ query: q, resultCount: results.cities.length + results.countries.length }),
          createdAt: new Date(),
        },
      });
    } catch {}

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
