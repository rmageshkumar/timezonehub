import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - add favorite
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { cityId } = await request.json();
    const userId = (session.user as any).id;

    const existing = await prisma.userFavorite.findUnique({
      where: { userId_cityId: { userId, cityId } },
    });

    if (existing) {
      return NextResponse.json({ success: true, favorited: true, id: existing.id });
    }

    const fav = await prisma.userFavorite.create({
      data: { userId, cityId },
    });

    return NextResponse.json({ success: true, favorited: true, id: fav.id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE - remove favorite
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.userFavorite.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET - check if favorited
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ favorited: false });

  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId");
  if (!cityId) return NextResponse.json({ favorited: false });

  const userId = (session.user as any).id;
  const fav = await prisma.userFavorite.findUnique({
    where: { userId_cityId: { userId, cityId } },
  });

  return NextResponse.json({ favorited: !!fav, id: fav?.id });
}
