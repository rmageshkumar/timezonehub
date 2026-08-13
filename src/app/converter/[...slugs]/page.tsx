import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { TimeConverterClient } from "@/components/TimeConverterClient";
import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slugs: string[] }>;
}

// Timezone abbreviation to representative city mapping
const TIMEZONE_ABBREVIATIONS: Record<string, { name: string; timezone: string; gmtOffset: string }> = {
  est: { name: "New York", timezone: "America/New_York", gmtOffset: "-05:00" },
  pst: { name: "Los Angeles", timezone: "America/Los_Angeles", gmtOffset: "-08:00" },
  cet: { name: "Paris", timezone: "Europe/Paris", gmtOffset: "+01:00" },
  gmt: { name: "London", timezone: "Europe/London", gmtOffset: "+00:00" },
  ist: { name: "Mumbai", timezone: "Asia/Kolkata", gmtOffset: "+05:30" },
  utc: { name: "UTC", timezone: "UTC", gmtOffset: "+00:00" },
  jst: { name: "Tokyo", timezone: "Asia/Tokyo", gmtOffset: "+09:00" },
  aest: { name: "Sydney", timezone: "Australia/Sydney", gmtOffset: "+10:00" },
  cst: { name: "Chicago", timezone: "America/Chicago", gmtOffset: "-06:00" },
  mst: { name: "Denver", timezone: "America/Denver", gmtOffset: "-07:00" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  
  // Handle both formats: "est-to-ist" (single slug) and ["est", "to", "ist"] (multiple slugs)
  let fromTz = "";
  let toTz = "";
  
  if (slugs.length === 1 && slugs[0].includes("-to-")) {
    const parts = slugs[0].split("-to-");
    fromTz = parts[0]?.toUpperCase() || "";
    toTz = parts[1]?.toUpperCase() || "";
  } else {
    fromTz = slugs[0]?.toUpperCase() || "";
    toTz = slugs[slugs.length - 1]?.toUpperCase() || "";
  }
  
  return {
    title: `Convert ${fromTz} to ${toTz} Time`,
    description: `Instantly convert ${fromTz} time to ${toTz}. See current time and convert any hour between ${fromTz} and ${toTz} timezones.`,
  };
}

/** Resolve timezone abbreviations to actual cities */
async function resolveTimezonePairs(slugs: string[]): Promise<{
  id: string; name: string; timezone: string;
  countryFlag: string; countryName: string; gmtOffset: string;
}[]> {
  const results: any[] = [];

  for (const rawSlug of slugs) {
    const slug = rawSlug.toLowerCase().trim();
    if (!slug) continue;

    // Handle formats like "est-to-ist" by splitting on "-to-"
    if (slug.includes("-to-")) {
      const [from, to] = slug.split("-to-");
      const fromTz = TIMEZONE_ABBREVIATIONS[from];
      const toTz = TIMEZONE_ABBREVIATIONS[to];

      if (fromTz) {
        const city = await prisma.city.findFirst({
          where: { isActive: true, name: { contains: fromTz.name } },
          include: { country: true },
        });

        if (city) {
          results.push({
            id: city.id,
            name: city.name,
            timezone: city.timezone,
            countryFlag: city.country.flag,
            countryName: city.country.name,
            gmtOffset: city.gmtOffset,
          });
        } else {
          results.push({
            id: from,
            name: fromTz.name,
            timezone: fromTz.timezone,
            countryFlag: "🌍",
            countryName: "",
            gmtOffset: fromTz.gmtOffset,
          });
        }
      }

      if (toTz) {
        const city = await prisma.city.findFirst({
          where: { isActive: true, name: { contains: toTz.name } },
          include: { country: true },
        });

        if (city) {
          results.push({
            id: city.id,
            name: city.name,
            timezone: city.timezone,
            countryFlag: city.country.flag,
            countryName: city.country.name,
            gmtOffset: city.gmtOffset,
          });
        } else {
          results.push({
            id: to,
            name: toTz.name,
            timezone: toTz.timezone,
            countryFlag: "🌍",
            countryName: "",
            gmtOffset: toTz.gmtOffset,
          });
        }
      }
      continue;
    }

    // Skip "to" if used as separate slug
    if (slug === "to") continue;

    // Check if it's a timezone abbreviation
    const tzInfo = TIMEZONE_ABBREVIATIONS[slug];
    if (tzInfo) {
      // Find the actual city in the database to get country info
      const city = await prisma.city.findFirst({
        where: {
          isActive: true,
          name: { contains: tzInfo.name },
        },
        include: { country: true },
      });

      if (city) {
        results.push({
          id: city.id,
          name: city.name,
          timezone: city.timezone,
          countryFlag: city.country.flag,
          countryName: city.country.name,
          gmtOffset: city.gmtOffset,
        });
      } else {
        // Fallback if city not found in database
        results.push({
          id: slug,
          name: tzInfo.name,
          timezone: tzInfo.timezone,
          countryFlag: "🌍",
          countryName: "",
          gmtOffset: tzInfo.gmtOffset,
        });
      }
    } else {
      // Try to resolve as a city name
      const city = await prisma.city.findFirst({
        where: {
          isActive: true,
          OR: [
            { name: { contains: slug.replace(/-/g, " ") } },
            { aliases: { contains: slug } },
          ],
        },
        include: { country: true },
      });

      if (city) {
        results.push({
          id: city.id,
          name: city.name,
          timezone: city.timezone,
          countryFlag: city.country.flag,
          countryName: city.country.name,
          gmtOffset: city.gmtOffset,
        });
      }
    }
  }

  return results;
}

export default async function ConverterSlugPage({ params }: Props) {
  const { slugs } = await params;

  if (!slugs || slugs.length === 0) notFound();

  const initialCities = await resolveTimezonePairs(slugs);

  if (initialCities.length === 0) notFound();

  // Extract timezone names for display
  let fromTz = "";
  let toTz = "";
  
  if (slugs.length === 1 && slugs[0].includes("-to-")) {
    const parts = slugs[0].split("-to-");
    fromTz = parts[0]?.toUpperCase() || "";
    toTz = parts[1]?.toUpperCase() || "";
  } else {
    fromTz = slugs[0]?.toUpperCase() || "";
    toTz = slugs[slugs.length - 1]?.toUpperCase() || "";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <ArrowLeftRight className="w-7 h-7 inline mr-2 text-primary-500" />
              Convert {fromTz} to {toTz}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {initialCities.map(c => c.countryFlag).join(" ")} {initialCities.map(c => c.name).join(" · ")}
            </p>
          </div>

          <TimeConverterClient initialCities={initialCities} />

          <div className="mt-6">
            <AdUnit placement="footer_banner" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
