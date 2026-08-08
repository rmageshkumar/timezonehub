import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        ...post,
        tags: post.tags ? JSON.parse(post.tags as string) : [],
      },
    });
  } catch (error) {
    console.error("Get blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Auto-generate slug if not provided
    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Check slug uniqueness (excluding current post)
    if (slug) {
      const existing = await prisma.blogPost.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: slug || undefined,
        excerpt: body.excerpt || null,
        content: body.content || "",
        featuredImage: body.featuredImage || null,
        status: body.status || "draft",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        publishedAt: body.status === "published" && !body.publishedAt ? new Date() : body.publishedAt ? new Date(body.publishedAt) : null,
        categoryId: body.categoryId || null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        seoKeywords: body.seoKeywords || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "blog_updated",
        details: JSON.stringify({ id: post.id, title: post.title, status: post.status }),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "blog_deleted",
        details: JSON.stringify({ id }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
