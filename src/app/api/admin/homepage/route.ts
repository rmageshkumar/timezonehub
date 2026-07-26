import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { sections } = await request.json();

    for (const section of sections) {
      await prisma.homepageSection.update({
        where: { id: section.id },
        data: { enabled: section.enabled },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "homepage_updated",
        details: JSON.stringify(sections.map((s: any) => ({ section: s.section, enabled: s.enabled }))),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
