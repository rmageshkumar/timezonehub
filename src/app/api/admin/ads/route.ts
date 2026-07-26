import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const ad = await prisma.advertisement.create({
      data: {
        name: body.name || "Untitled Ad",
        type: body.type || "html",
        placement: body.placement || "header_banner",
        content: body.content || null,
        imageUrl: body.imageUrl || null,
        linkUrl: body.linkUrl || null,
        priority: body.priority || 0,
        weight: body.weight || 1,
        status: body.status || "draft",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        targetCountries: body.targetCountries || null,
        targetDevices: body.targetDevices || null,
        targetHours: body.targetHours || null,
        createdBy: (session.user as any)?.id || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "advertisement_created",
        details: JSON.stringify({ id: ad.id, name: ad.name }),
      },
    });

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error("Create ad error:", error);
    return NextResponse.json({ error: "Failed to create advertisement" }, { status: 500 });
  }
}
