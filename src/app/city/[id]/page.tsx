import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { MapPin, Clock, Globe, Plane } from "lucide-react";
import { LiveTime } from "@/components/LiveTime";
import { CityStatusBadges } from "@/components/CityStatusBadges";
import { FavoriteButton } from "@/components/FavoriteButton";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({
    where: { id: params.id },
    include: { country: true },
  });
  if (!city) return { title: "City Not Found" };
  return {
    title: `${city.name} Time - Current Local Time in ${city.name}, ${city.country.name}`,
    description: `Current local time in ${city.name}, ${city.country.name} (${city.timezone}). Airport code: ${city.airportCode || "N/A"}.`,
  };
}

export default async function CityPage({ params }: Props) {
  const city = await prisma.city.findUnique({
    where: { id: params.id },
    include: { country: true },
  });

  if (!city) notFound();

  // Related cities in same country
  const relatedCities = await prisma.city.findMany({
    where: {
      countryId: city.countryId,
      id: { not: city.id },
      isActive: true,
    },
    orderBy: { population: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* City Header */}
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href={`/country/${city.country.code.toLowerCase()}`} className="text-3xl hover:scale-110 transition-transform">
                    {city.country.flag}
                  </Link>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {city.name}
                  </h1>
                  {city.airportCode && (
                    <span className="text-sm font-mono bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-lg">
                      {city.airportCode}
                    </span>
                  )}
                  <FavoriteButton cityId={city.id} />
                </div>
                <p className="text-slate-500">
                  {city.country.name} · {city.timezone}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  <LiveTime timezone={city.timezone} />
                </div>
                <CurrentDate timezone={city.timezone} />
              </div>
            </div>

            {/* Status Badges */}
            <CityStatusBadges timezone={city.timezone} gmtOffset={city.gmtOffset} countryCode={city.country.code} />
          </div>

          {/* Sidebar Ad */}
          <div className="hidden lg:block fixed right-8 top-32 w-[300px]">
            <AdUnit placement="sidebar_300x600" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <InfoCard icon={<Clock />} label="Timezone" value={city.timezone} />
            <InfoCard icon={<Globe />} label="GMT Offset" value={city.gmtOffset} />
            <InfoCard icon={<Plane />} label="Airport" value={city.airportCode || "N/A"} />
            <InfoCard icon={<MapPin />} label="Coordinates" value={city.latitude ? `${city.latitude.toFixed(2)}, ${city.longitude?.toFixed(2)}` : "N/A"} />
          </div>

          {/* Related Cities */}
          {relatedCities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Other Cities in {city.country.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedCities.map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/city/${rc.id}`}
                    className="glass rounded-xl p-4 card-hover flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{rc.name}</div>
                      <div className="text-xs text-slate-500">{rc.timezone}</div>
                    </div>
                    <LiveTime timezone={rc.timezone} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper: non-interactive info card
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-primary-500 mb-2 flex justify-center">{icon}</div>
      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 break-all">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

// Non-interactive current date display (server-rendered snapshot)
function CurrentDate({ timezone }: { timezone: string }) {
  let date = "";
  try {
    date = new Date().toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: timezone,
    });
  } catch {}
  return <div className="text-sm text-slate-500 mt-1">{date}</div>;
}
