import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { CompareClient } from "@/components/CompareClient";
import { BarChart3, Share2 } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slugs: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const names = slugs.map(s => s.replace(/-/g, " ")).join(", ");
  return {
    title: `Compare ${names} Timezones | ClockHive`,
    description: `Compare current times in ${names}. See working hours overlap and time differences instantly.`,
  };
}

/** Resolve a slug like "new-york" or "london" to actual cities */
async function resolveCities(slugs: string[]): Promise<{
  id: string; name: string; timezone: string;
  countryFlag: string; countryName: string; gmtOffset: string;
  slug: string;
}[]> {
  const results: typeof resolved[] = [];
  const resolved: any[] = [];

  for (const rawSlug of slugs) {
    const slug = rawSlug.toLowerCase().trim();
    if (!slug) continue;

    // Try multiple lookup strategies (SQLite-compatible)
    let city = await prisma.city.findFirst({
      where: {
        isActive: true,
        OR: [
          // contains is case-insensitive in SQLite by default
          { name: { contains: slug.replace(/-/g, " ") } },
          // Alias match
          { aliases: { contains: slug } },
        ],
      },
      include: { country: true },
    });

    // If not found, try prefix matching
    if (!city) {
      city = await prisma.city.findFirst({
        where: {
          isActive: true,
          name: { contains: slug.replace(/-/g, " ").substring(0, 4) },
        },
        include: { country: true },
        orderBy: { population: "desc" },
      });
    }

    if (city) {
      resolved.push({
        id: city.id,
        name: city.name,
        timezone: city.timezone,
        countryFlag: city.country.flag,
        countryName: city.country.name,
        gmtOffset: city.gmtOffset,
        slug: city.name.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }

  return resolved;
}

export default async function CompareSlugPage({ params }: Props) {
  const { slugs } = await params;

  if (!slugs || slugs.length === 0) notFound();

  const initialCities = await resolveCities(slugs);

  // Build the canonical slug URL (normalized)
  const canonical = `/compare/${initialCities.map(c => c.slug).join("/")}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <BarChart3 className="w-7 h-7 inline mr-2 text-primary-500" />
              Compare Timezones
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {initialCities.map(c => c.countryFlag).join(" ")} {initialCities.map(c => c.name).join(" · ")}
            </p>
          </div>

          <CompareClient initialCities={initialCities} />

          <div className="mt-6">
            <AdUnit placement="footer_banner" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
