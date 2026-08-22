import { prisma } from "@/lib/prisma";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { MapPin, Clock, Globe, Plane, TrendingUp, Landmark, Navigation, Sun, Moon, PartyPopper } from "lucide-react";
import { LiveTime } from "@/components/LiveTime";
import { CityStatusBadges } from "@/components/CityStatusBadges";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CountryComparisonWidget } from "@/components/CountryComparisonWidget";
import { computeComparisonRows, getOffsetMinutes, formatDiffLong } from "@/lib/timezone-compare";
import Link from "next/link";
import { cityUrl } from "@/lib/utils";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

/** Generate a URL-safe slug from a city name: "New York" → "new-york" */
function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Check if a string looks like a Prisma CUID (starts with 'c', ~25 chars) */
function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str);
}

/** Resolve a city by CUID, IATA airport code, alias, or name slug */
async function findCity(param: string) {
  if (isCuid(param)) {
    return prisma.city.findUnique({
      where: { id: param },
      include: { country: true },
    });
  }

  const slug = param.toLowerCase();
  const nameSlug = slug.replace(/-/g, " ");

  // IATA airport code (e.g. /city/gva → Geneva). Only treat exact 3-letter
  // slugs as codes so we never hijack short city-name slugs.
  if (/^[a-z]{3}$/.test(slug)) {
    const byCode = await prisma.city.findFirst({
      where: { isActive: true, airportCode: slug.toUpperCase() },
      include: { country: true },
    });
    if (byCode) return byCode;
  }

  // Lookup by name slug (hyphenated city name) — preserves existing behaviour
  const byName = await prisma.city.findFirst({
    where: {
      isActive: true,
      name: { contains: nameSlug },
    },
    include: { country: true },
    orderBy: { population: "desc" },
  });
  if (byName) return byName;

  // Lookup by alias (e.g. /city/denpasar → Bali, /city/bombay → Mumbai)
  return prisma.city.findFirst({
    where: { isActive: true, aliases: { contains: slug } },
    include: { country: true },
    orderBy: { population: "desc" },
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const city = await findCity(id);
  if (!city) return { title: "City Not Found" };
  // Surface the IATA airport code (e.g. "Geneva (GVA) Time") so top-10
  // airport-code queries ("gva time", "jed time") convert to clicks.
  const airport = city.airportCode ? ` (${city.airportCode})` : "";
  const region = city.region ? `, ${city.region}` : ""; // e.g. "Dallas, Texas"
  const tzLabelMeta = city.timezone.replace(/_/g, " ");
  return {
    title: `${city.name}${airport} Time - Current Local Time in ${city.name}${region}, ${city.country.name}`,
    description: `What time is it in ${city.name}${region} right now? Current local time in ${city.name}${region}, ${city.country.name} (${tzLabelMeta}${city.gmtOffset ? `, UTC${city.gmtOffset}` : ""})${city.dstOffset ? " — observes daylight saving time." : " — no daylight saving time."} See the live clock, public holidays and ${city.name} time vs the world.`,
    alternates: {
      canonical: `${BASE_URL}/city/${slugify(city.name)}`,
    },
    openGraph: {
      title: `${city.name} Time Now - ${city.country.name} | ClockHive`,
      description: `Current local time in ${city.name}${region}, ${city.country.name} (${city.timezone}). Live clock, DST status and ${city.name} time vs major world cities.`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { id } = await params;
  const city = await findCity(id);

  if (!city) notFound();

  // Redirect CUID / airport-code / alias URLs to the canonical slug URL for SEO
  const citySlug = slugify(city.name);
  if (id !== citySlug) {
    permanentRedirect(`/city/${citySlug}`);
  }

  // Tourist attractions for this city (gracefully handles missing table in prod)
  let attractions: any[] = [];
  try {
    attractions = await prisma.attraction.findMany({
      where: { cityId: city.id },
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    // attractions table not yet pushed to production — silently fallback
  }

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

  // Public holidays in the city's country (e.g. Bali → Indonesia's holidays incl. Nyepi).
  const holidays = await prisma.publicHoliday.findMany({
    where: { countryId: city.countryId, isActive: true },
    orderBy: { date: "asc" },
    take: 14,
  });

  // DST flag + labels for the info card, intro copy and FAQs (all data-driven).
  const hasDST = !!city.dstOffset;
  const tzLabel = city.timezone.replace(/_/g, " ");
  const offsetLabel = city.gmtOffset ? `UTC${city.gmtOffset}` : "";
  const regionLabel = city.region ? `, ${city.region}` : ""; // e.g. ", Texas"
  const dstSuffix =
    hasDST && city.dstOffset
      ? `, switching to UTC${city.dstOffset} during daylight saving time`
      : "";

  // Server-computed rows so the "{city} vs the World" + business-hours tables are
  // present in the SSR HTML (crawlable), then stay live via the client widget.
  const comparisonRows = computeComparisonRows(city.timezone, new Date());

  // Live, DST-aware offsets powering the "time difference vs X" FAQs.
  const cityOffset = getOffsetMinutes(city.timezone, new Date());
  const indiaOffset = getOffsetMinutes("Asia/Kolkata", new Date());
  const nyOffset = getOffsetMinutes("America/New_York", new Date());

  const cityIntro = `${city.name}${regionLabel}, ${city.country.name} is in the ${tzLabel} time zone (${offsetLabel}) and ${hasDST ? "observes daylight saving time (DST)" : "does not observe daylight saving time (DST)"}. The current local time is shown live above. Use the comparison table below to see ${city.name}'s time against major cities around the world, and check ${city.country.name}'s public holidays.`;

  // City-specific FAQs stored on the city record (JSON array of {q, a}), e.g.
  // Washington DC → "What is DC time?", Geneva → "What is GVA time?"
  let extraFaqs: { q: string; a: string }[] = [];
  try {
    const parsed = city.seoFaqs ? JSON.parse(city.seoFaqs) : [];
    if (Array.isArray(parsed)) extraFaqs = parsed;
  } catch {
    extraFaqs = [];
  }

  const faqs = [
    {
      q: `What time zone is ${city.name} in?`,
      a: `${city.name}, ${city.country.name} is in the ${tzLabel} time zone (${offsetLabel})${hasDST ? ", which observes daylight saving time (DST)." : " and does not observe daylight saving time."}`,
    },
    {
      q: `What time is it in ${city.name} right now?`,
      a: `The current local time in ${city.name} is shown live at the top of this page, and the table below shows ${city.name}'s time against major cities worldwide.`,
    },
    {
      q: `Does ${city.name} observe daylight saving time (DST)?`,
      a: hasDST
        ? `Yes — ${city.name} moves its clocks forward in spring and back in autumn.`
        : `No — ${city.name} does not observe daylight saving time, so the local time stays the same all year round.`,
    },
    {
      q: `What is ${city.name}'s UTC / GMT offset?`,
      a: `${city.name} is in ${tzLabel} (${offsetLabel})${dstSuffix}.`,
    },
    ...(cityOffset !== null && indiaOffset !== null
      ? [
          {
            q: `What is the time difference between ${city.name} and India?`,
            a:
              cityOffset - indiaOffset === 0
                ? `${city.name} (${offsetLabel}) is on the same time as India (IST, UTC+5:30).`
                : `${city.name} (${offsetLabel}) is ${formatDiffLong(cityOffset - indiaOffset)} India (IST, UTC+5:30).`,
          },
        ]
      : []),
    ...(cityOffset !== null && nyOffset !== null
      ? [
          {
            q: `What is the time difference between ${city.name} and New York?`,
            a:
              cityOffset - nyOffset === 0
                ? `${city.name} (${offsetLabel}) is on the same time as New York (US Eastern Time).`
                : `${city.name} (${offsetLabel}) is ${formatDiffLong(cityOffset - nyOffset)} New York (US Eastern Time).`,
          },
        ]
      : []),
    ...(city.airportCode
      ? [
          {
            q: `What is ${city.name}'s airport code?`,
            a: `${city.name}'s main airport is ${city.airportCode} — the IATA code many people use when searching for ${city.name} time.`,
          },
        ]
      : []),
    ...extraFaqs,
  ];

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
                  {city.region ? `${city.region} · ` : ""}{city.country.name} · {city.timezone}
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

            {/* SEO intro — crawlable text answering "what time is it in X" */}
            <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">{cityIntro}</p>
          </div>

          {/* Sidebar Ad */}
          <div className="hidden lg:block fixed right-8 top-32 w-[300px]">
            <AdUnit placement="sidebar_300x600" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <InfoCard icon={<Clock />} label="Timezone" value={city.timezone} />
            <InfoCard icon={<Globe />} label="GMT Offset" value={city.gmtOffset} />
            <InfoCard icon={<Plane />} label="Airport" value={city.airportCode || "N/A"} />
            <InfoCard icon={<MapPin />} label="Coordinates" value={city.latitude ? `${city.latitude.toFixed(2)}, ${city.longitude?.toFixed(2)}` : "N/A"} />
            <InfoCard
              icon={hasDST ? <Sun /> : <Moon />}
              label="Daylight Saving"
              value={hasDST ? "Observed" : "None"}
            />
          </div>

          {/* {city} vs the World + business hours (SSR-friendly product content) */}
          <CountryComparisonWidget
            timezone={city.timezone}
            cityName={city.name}
            countryName={city.country.name}
            initialRows={comparisonRows}
          />

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

          {/* Public Holidays in the city's country (data-driven) */}
          {holidays.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-4">
                <PartyPopper className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Public Holidays in {city.country.name}
                </h2>
              </div>
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holiday</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Local Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidays.map((holiday) => (
                        <tr key={holiday.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-slate-900 dark:text-slate-100">
                              {formatHolidayDate(holiday.date)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {holiday.name}
                            </span>
                            {holiday.description && (
                              <p className="text-xs text-slate-500 mt-0.5">{holiday.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {holiday.localName || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <HolidayTypeBadge type={holiday.type} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
                    href={cityUrl(rc.name)}
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
                    href={cityUrl(dest.name)}
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

          {/* FAQ + FAQPage structured data */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{faq.q}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
          </div>
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

// Helper: format MM-DD date string to a readable format (e.g. "03-11" → "Mar 11")
function formatHolidayDate(dateStr: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [month, day] = dateStr.split("-");
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  if (isNaN(m) || isNaN(d)) return dateStr;
  return `${months[m - 1]} ${d}`;
}

// Helper: badge for holiday type
function HolidayTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    public: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    national: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    observance: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    bank: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    school: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    religious: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  const color = colorMap[type] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {type}
    </span>
  );
}
