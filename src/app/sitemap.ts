import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/countries`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/converter`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/ai-scheduler`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/meeting-planner`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/scrum-poker`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/feedback`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/schedule`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.4 },
    { url: `${baseUrl}/settings`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/api-docs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  // Lazy-load prisma so build doesn't fail if DB is unreachable
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/lib/prisma");

    const countries = await prisma.country.findMany({ where: { isActive: true }, select: { code: true, updatedAt: true } });
    dynamicPages.push(...countries.map((c) => ({
      url: `${baseUrl}/country/${c.code}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })));

    const cities = await prisma.city.findMany({ where: { isActive: true }, take: 1000, select: { id: true, name: true, updatedAt: true } });
    dynamicPages.push(...cities.map((c) => ({
      url: `${baseUrl}/city/${c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })));

    const categories = await prisma.blogCategory.findMany({ select: { slug: true, createdAt: true } });
    dynamicPages.push(...categories.map((cat) => ({
      url: `${baseUrl}/blog/category/${cat.slug}`,
      lastModified: cat.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })));

    const posts = await prisma.blogPost.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true, publishedAt: true } });
    dynamicPages.push(...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })));
  } catch {
    // DB unreachable — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}

export const dynamic = "force-dynamic";
