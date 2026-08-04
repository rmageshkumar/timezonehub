import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { MapPin, Clock, Globe, Plane, TrendingUp, Landmark, Navigation } from "lucide-react";
import { LiveTime } from "@/components/LiveTime";
import { CityStatusBadges } from "@/components/CityStatusBadges";
import { FavoriteButton } from "@/components/FavoriteButton";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const city = await prisma.city.findUnique({
    where: { id },
    include: { country: true },
  });
  if (!city) return { title: "City Not Found" };
  return {
    title: `${city.name} Time - Current Local Time in ${city.name}, ${city.country.name}`,
    description: `Current local time in ${city.name}, ${city.country.name} (${city.timezone}). Airport code: ${city.airportCode || "N/A"}.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { id } = await params;
  const city = await prisma.city.findUnique({
    where: { id },
    include: { country: true },
  });

  if (!city) notFound();

  // Tourist attractions for this city
  const attractions = await prisma.attraction.findMany({
    where: { cityId: city.id },
    orderBy: { displayOrder: "asc" },
  });

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

  // Popular destinations: top international cities (exclude current country)
  // This shows global hubs relevant to someone looking at this city
  const popularDestinations = await prisma.city.findMany({
    where: {
      countryId: { not: city.countryId },
      id: { not: city.id },
      isActive: true,
    },
    orderBy: { population: "desc" },
    take: 6,
    include: { country: true },
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

          {/* Tourist Attractions */}
          {attractions.length > 0 && (
            <div className="mt-8 mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Popular Places in {city.name}
                </h2>
              </div>

              {/* Area-based tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {attractions.map((attr) => (
                  <div
                    key={attr.id}
                    className="glass rounded-xl p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                          {attr.name}
                        </div>
                        {attr.area && (
                          <div className="text-xs text-slate-500 mt-0.5">{attr.area}</div>
                        )}
                      </div>
                      {attr.category && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 whitespace-nowrap shrink-0">
                          {attr.category}
                        </span>
                      )}
                    </div>

                    {attr.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {attr.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {attr.distanceKm != null && (
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {attr.distanceKm} km
                        </span>
                      )}
                      {attr.travelTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {attr.travelTime}
                        </span>
                      )}
                      {attr.suggestedDay && (
                        <span className="ml-auto text-primary-500 font-medium">
                          Day {attr.suggestedDay}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Itinerary */}
              {attractions.some(a => a.suggestedDay) && (
                <div className="mt-4 glass rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    🗺️ Suggested {attractions.filter(a => a.suggestedDay).length >= 8 ? "5-Day" : "3-4 Day"} Itinerary
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(attractions.filter(a => a.suggestedDay).map(a => a.suggestedDay!))).sort().map((day) => (
                      <div key={day} className="flex-1 min-w-[140px]">
                        <div className="text-xs font-bold text-primary-500 mb-1">Day {day}</div>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                          {attractions.filter(a => a.suggestedDay === day).map(a => (
                            <li key={a.id} className="truncate">• {a.name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Cities - OTHER CITIES IN COUNTRY */}
          {relatedCities.length > 0 && (
            <div className="mt-12">
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

          {/* Popular Destinations */}
          {popularDestinations.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Popular from {city.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {popularDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/city/${dest.id}`}
                    className="glass rounded-xl p-4 card-hover group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{dest.country.flag}</span>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                          {dest.name}
                        </div>
                        <div className="text-xs text-slate-500">{dest.country.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">{dest.timezone}</span>
                      <span className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300">
                        <LiveTime timezone={dest.timezone} />
                      </span>
                    </div>
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
