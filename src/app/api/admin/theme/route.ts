import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    await prisma.themeConfig.upsert({
      where: { id: "default" },
      update: {
        primaryColor: body.primaryColor,
        accentColor: body.accentColor,
        fontFamily: body.fontFamily,
        borderRadius: body.borderRadius,
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        footerText: body.footerText,
        customCss: body.customCss,
      },
      create: {
        id: "default",
        primaryColor: body.primaryColor || "#3b82f6",
        accentColor: body.accentColor || "#d946ef",
        fontFamily: body.fontFamily || "Inter",
        borderRadius: body.borderRadius || "0.5rem",
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        footerText: body.footerText,
        customCss: body.customCss,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "theme_updated",
        details: JSON.stringify({ primaryColor: body.primaryColor }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
