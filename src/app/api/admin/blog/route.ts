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

    // Auto-generate slug if not provided
    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Check slug uniqueness
    if (slug) {
      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: slug || `post-${Date.now().toString(36)}`,
        excerpt: body.excerpt || null,
        content: body.content || "",
        featuredImage: body.featuredImage || null,
        status: body.status || "draft",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        publishedAt: body.status === "published" ? new Date() : null,
        categoryId: body.categoryId || null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        seoKeywords: body.seoKeywords || null,
        authorId: (session.user as any)?.id || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        action: "blog_published",
        details: JSON.stringify({ id: post.id, title: post.title, status: post.status }),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
