import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - create new city
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Check duplicate in same country
    const existing = await prisma.city.findFirst({
      where: {
        name: body.name,
        countryId: body.countryId,
      },
    });
    if (existing) {
      return NextResponse.json({ error: `City "${body.name}" already exists in this country` }, { status: 400 });
    }

    const city = await prisma.city.create({
      data: {
        name: body.name,
        countryId: body.countryId,
        timezone: body.timezone || null,
        gmtOffset: body.gmtOffset,
        dstOffset: body.dstOffset || null,
        airportCode: body.airportCode || null,
        aliases: body.aliases ? JSON.stringify(body.aliases) : null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        population: body.population || null,
        displayOrder: body.displayOrder || 0,
      },
      include: { country: true },
    });

    // Update country timezone count
    const cityCount = await prisma.city.count({ where: { countryId: body.countryId } });
    await prisma.country.update({
      where: { id: body.countryId },
      data: { timezoneCount: cityCount },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "city_created",
        details: JSON.stringify({ id: city.id, name: city.name, country: city.country.name }),
      },
    });

    return NextResponse.json({ success: true, city });
  } catch (error) {
    console.error("Create city error:", error);
    return NextResponse.json({ error: "Failed to create city" }, { status: 500 });
  }
}
