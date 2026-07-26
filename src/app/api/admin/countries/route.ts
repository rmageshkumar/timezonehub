import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - list all countries (for dropdown)
export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ countries });
  } catch {
    return NextResponse.json({ countries: [] });
  }
}

// POST - create new country
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Check duplicate code
    const existing = await prisma.country.findUnique({
      where: { code: body.code },
    });
    if (existing) {
      return NextResponse.json({ error: `Country code "${body.code}" already exists` }, { status: 400 });
    }

    const country = await prisma.country.create({
      data: {
        name: body.name,
        code: body.code,
        flag: body.flag || "🌍",
        capital: body.capital || null,
        continent: body.continent || null,
        population: body.population || null,
        timezoneCount: body.timezoneCount || 1,
        displayOrder: body.displayOrder || 0,
        dstRules: body.dstRules || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "country_created",
        details: JSON.stringify({ id: country.id, name: country.name, code: country.code }),
      },
    });

    return NextResponse.json({ success: true, country });
  } catch (error) {
    console.error("Create country error:", error);
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 });
  }
}
