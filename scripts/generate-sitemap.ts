/**
 * Build-time sitemap generator for ClockHive.
 * Queries the database once at build time and writes a static sitemap.xml
 * to public/ — no serverless function timeout risk, always fast.
 *
 * Usage: tsx scripts/generate-sitemap.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastModified.toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoToken || undefined,
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

async function main() {
  console.log("🔍 Generating sitemap for", BASE_URL);
  const prisma = createPrismaClient();

  const entries: SitemapEntry[] = [];

  // ── Static pages ──────────────────────────────────────────────
  const now = new Date();
  const staticPages: [string, SitemapEntry["changeFrequency"], number][] = [
    ["", "daily", 1],
    ["/countries", "weekly", 0.9],
    ["/converter", "monthly", 0.8],
    ["/compare", "monthly", 0.8],
    ["/ai-scheduler", "monthly", 0.7],
    ["/meeting-planner", "monthly", 0.8],
    ["/blog", "weekly", 0.7],
    ["/scrum-poker", "monthly", 0.7],
    ["/search", "weekly", 0.6],
    ["/contact", "monthly", 0.5],
    ["/feedback", "monthly", 0.4],
    ["/schedule", "weekly", 0.5],
    ["/dashboard", "daily", 0.4],
    ["/settings", "monthly", 0.3],
    ["/faq", "monthly", 0.6],
    ["/privacy", "monthly", 0.3],
    ["/terms", "monthly", 0.3],
    ["/cookies", "monthly", 0.3],
    ["/api-docs", "monthly", 0.5],
  ];

  for (const [slug, freq, prio] of staticPages) {
    entries.push({ url: `${BASE_URL}${slug}`, lastModified: now, changeFrequency: freq, priority: prio });
  }

  // ── Converter pages ──────────────────────────────────────────
  const converterPairs = [
    ["est-to-ist", 0.8], ["pst-to-gmt", 0.8], ["cet-to-est", 0.8],
    ["est-to-pst", 0.7], ["gmt-to-ist", 0.7], ["jst-to-pst", 0.7],
    ["aest-to-est", 0.7], ["cet-to-gmt", 0.6], ["utc-to-est", 0.6],
    ["cst-to-est", 0.6], ["pst-to-ist", 0.6], ["mst-to-est", 0.5],
    ["jst-to-cet", 0.5],
  ] as const;

  for (const [slug, prio] of converterPairs) {
    entries.push({ url: `${BASE_URL}/converter/${slug}`, lastModified: now, changeFrequency: "monthly", priority: prio });
  }

  // ── Database-powered pages ───────────────────────────────────
  try {
    // Countries
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      select: { code: true, updatedAt: true },
    });
    for (const c of countries) {
      entries.push({
        url: `${BASE_URL}/country/${c.code}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    console.log(`  ✅ ${countries.length} countries`);

    // Cities (limited to prevent oversized sitemaps)
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      take: 500,
      select: { name: true, updatedAt: true },
    });
    for (const c of cities) {
      const slug = c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      entries.push({
        url: `${BASE_URL}/city/${slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    console.log(`  ✅ ${cities.length} cities`);

    // Blog categories
    const categories = await prisma.blogCategory.findMany({
      select: { slug: true, updatedAt: true },
    });
    for (const cat of categories) {
      entries.push({
        url: `${BASE_URL}/blog/category/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    console.log(`  ✅ ${categories.length} blog categories`);

    // Blog posts
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      take: 100,
      select: { slug: true, updatedAt: true, publishedAt: true },
    });
    for (const p of posts) {
      entries.push({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt || p.publishedAt || now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    console.log(`  ✅ ${posts.length} blog posts`);
  } catch (error) {
    console.error("⚠️  Database queries failed — sitemap will contain static pages only.");
    console.error("   Error:", (error as Error).message);
  } finally {
    await prisma.$disconnect();
  }

  // ── Write sitemap ────────────────────────────────────────────
  const xml = renderSitemap(entries);
  const outPath = path.resolve(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");

  console.log(`\n📄 Sitemap written to public/sitemap.xml (${entries.length} URLs, ${(xml.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("❌ Sitemap generation failed:", err);
  process.exit(1);
});
