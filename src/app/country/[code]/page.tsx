import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Clock, Globe, Sun, Moon, CalendarDays, Building2, Plane, TrendingUp, PartyPopper } from "lucide-react";
import Link from "next/link";
import { cityUrl } from "@/lib/utils";
import { CountryLiveClock } from "@/components/CountryLiveClock";
import { CountryComparisonWidget } from "@/components/CountryComparisonWidget";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

// Informal country abbreviations people actually search ("KSA time", "UAE time").
// Only used when they add value beyond the ISO code.
const COUNTRY_ABBR: Record<string, string> = {
  SA: "KSA",
  AE: "UAE",
  US: "USA",
  GB: "UK",
};

/** Current UTC offset in minutes for a timezone at a given instant (handles DST). */
function getOffsetMinutes(timeZone: string, now = new Date()): number | null {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" });
    const name = dtf.formatToParts(now).find((p) => p.type === "timeZoneName")?.value || "";
    const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1] === "+" ? 1 : -1;
    return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3] || "0", 10));
  } catch {
    return null;
  }
}

/** "2 hours 30 minutes ahead of" from a minute difference. */
function formatTimeDiffMinutes(diff: number): string {
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const dir = diff > 0 ? "ahead of" : "behind";
  const unit = h > 0 && m > 0 ? `${h} hours ${m} minutes` : h > 0 ? `${h} hours` : `${m} minutes`;
  return `${unit} ${dir}`;
}

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const country = await prisma.country.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
        take: 1,
      },
    },
  });
  if (!country) return { title: "Country Not Found" };

  const primaryCity = country.cities[0];
  const tzLabel = primaryCity
    ? `${primaryCity.timezone.replace(/_/g, " ")} (UTC${primaryCity.gmtOffset})`
    : `${country.timezoneCount} timezone${country.timezoneCount !== 1 ? "s" : ""}`;
  const hasDST = country.cities.some((c) => c.dstOffset);
  const abbr = COUNTRY_ABBR[country.code];
  const abbrSuffix = abbr && abbr !== country.code ? ` (${abbr})` : "";

  return {
    title: `${country.name} Time Now${abbrSuffix} - Live Time, Time Zone & DST`,
    description: `What time is it in ${country.name} right now? Current time in ${country.name} (${country.code}): ${tzLabel}${hasDST ? " and it observes daylight saving time (DST)." : " with no daylight saving time."} See live city times, time zone info and public holidays.`,
    alternates: {
      canonical: `${BASE_URL}/country/${country.code.toLowerCase()}`,
    },
    openGraph: {
      title: `${country.name} Time Now${abbrSuffix} - ClockHive`,
      description: `Current time, time zone and DST info for ${country.name}. Check live city times and compare ${country.name} with cities around the world.`,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { code } = await params;
  const country = await prisma.country.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
      },
      publicHolidays: {
        where: { isActive: true },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!country) notFound();

  // Timezone / DST facts powering the SEO content sections below
  const primaryCity = country.cities[0];
  const hasDST = country.cities.some((c) => c.dstOffset);
  const timezoneNames = [...new Set(country.cities.map((c) => c.timezone))];
  const tzDisplay = primaryCity ? primaryCity.timezone.replace(/_/g, " ") : "";
  const offsetDisplay = primaryCity?.gmtOffset ? `UTC${primaryCity.gmtOffset}` : "";
  const abbr = COUNTRY_ABBR[country.code];
  const countryIntro =
    country.timezoneCount === 1 && primaryCity
      ? `${country.name} is in a single time zone — ${tzDisplay} (${offsetDisplay}). The country ${hasDST ? "observes daylight saving time, setting clocks forward in spring and back in autumn." : "does not observe daylight saving time, so local time stays the same all year round."}`
      : `${country.name} spans ${country.timezoneCount} time zones. Use the live clocks on this page to see the current time in each major city.`;

  // "Time difference vs India" FAQ — computed server-side with current offsets.
  const primaryOffset = primaryCity ? getOffsetMinutes(primaryCity.timezone) : null;
  const indiaOffset = getOffsetMinutes("Asia/Kolkata");
  const indiaDiffFaq =
    primaryOffset !== null && indiaOffset !== null
      ? [
          {
            q: `What is the time difference between ${country.name} and India?`,
            a: `${country.name} (${offsetDisplay}) is ${formatTimeDiffMinutes(primaryOffset - indiaOffset)} India (IST, UTC+5:30). Use the comparison table above to see the live difference.`,
          },
        ]
      : [];

  const faqs = [
    {
      q: `What time zone is ${country.name} in?`,
      a: `${country.name} uses ${tzDisplay || "a fixed time zone"} (${offsetDisplay || "UTC"})${hasDST ? " and observes daylight saving time (DST) in the summer months." : " and does not observe daylight saving time — the UTC offset stays constant all year."}`,
    },
    {
      q: `What time is it in ${country.name} right now?`,
      a: `The current time in ${primaryCity?.name || country.capital || country.name} is shown live above, and every city below shows its own live time.`,
    },
    {
      q: `Does ${country.name} observe daylight saving time (DST)?`,
      a: hasDST
        ? `Yes — ${country.name} moves its clocks forward in spring and back in autumn (DST is observed on ${tzDisplay}).`
        : `No — ${country.name} does not currently observe daylight saving time, so the time never changes throughout the year.`,
    },
    {
      q: `How many time zones does ${country.name} have?`,
      a: `${country.name} has ${country.timezoneCount} time zone${country.timezoneCount !== 1 ? "s" : ""}${timezoneNames.length > 1 ? ` — ${timezoneNames.join(", ")}` : ` (${tzDisplay})`}.`,
    },
    {
      q: `What is ${country.name}'s UTC / GMT offset?`,
      a: `${country.name} is in ${tzDisplay} (${offsetDisplay})${hasDST ? `, and switches between ${offsetDisplay} in winter and UTC${primaryCity?.dstOffset || ""} in summer for daylight saving.` : " all year round — the offset never changes."}`,
    },
    {
      q: `Is the time the same throughout ${country.name}?`,
      a: country.timezoneCount === 1
        ? `Yes — the whole of ${country.name} shares one time zone (${tzDisplay}, ${offsetDisplay}).`
        : `No — ${country.name} spans ${country.timezoneCount} time zones, so different cities can show different local times.`,
    },
    ...(abbr && abbr !== country.code
      ? [
          {
            q: `What is ${abbr} time?`,
            a: `"${abbr}" stands for ${country.name} (${country.code}). ${country.name} is in ${tzDisplay} (${offsetDisplay})${hasDST ? " and observes daylight saving time." : " and does not observe daylight saving time."}`,
          },
        ]
      : []),
    ...indiaDiffFaq,
  ];

  // Popular countries: same continent neighbors first, then global
  const sameContinentCountries = await prisma.country.findMany({
    where: {
      code: { not: country.code },
      continent: country.continent,
      isActive: true,
    },
    orderBy: { displayOrder: "asc" },
    take: 6,
  });

  const otherContinentCountries = await prisma.country.findMany({
    where: {
      code: { not: country.code },
      continent: { not: country.continent },
      isActive: true,
    },
    orderBy: { displayOrder: "asc" },
    take: 6,
  });

  const popularCountries = [...sameContinentCountries, ...otherContinentCountries].slice(0, 9);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Country Hero — answers "what time is it in X" immediately */}
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-5xl">{country.flag}</span>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{country.code}</span>
                    <span>·</span>
                    <span>{country.capital}</span>
                    <span>·</span>
                    <span>{country.continent}</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                  Current Time in {country.name}
                </h1>
                <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {country.name}
                  {abbr && abbr !== country.code ? ` (${abbr})` : ""} uses <strong>{tzDisplay}</strong> (
                  {offsetDisplay})
                  {hasDST
                    ? " and observes daylight saving time."
                    : " and does not observe daylight saving time."}{" "}
                  See the live time across {country.name} below.
                </p>
              </div>
              {primaryCity && (
                <CountryLiveClock timezone={primaryCity.timezone} cityName={primaryCity.name} />
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Timezones"
                value={`${country.timezoneCount}`}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5" />}
                label="Cities Tracked"
                value={`${country.cities.length}`}
              />
              <InfoCard
                icon={<Building2 className="w-5 h-5" />}
                label="Capital"
                value={country.capital || "N/A"}
              />
              <InfoCard
                icon={<Globe className="w-5 h-5" />}
                label="Population"
                value={country.population ? `${(country.population / 1000000).toFixed(1)}M` : "N/A"}
              />
            </div>
          </div>

          {/* Time across {country.name} — tz facts + full city table */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Time across {country.name}
              </h2>
              <span className="text-xs text-slate-400">{country.cities.length} cities tracked</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <InfoCard icon={<Clock className="w-5 h-5" />} label="Time Zone" value={tzDisplay || "—"} />
              <InfoCard icon={<Globe className="w-5 h-5" />} label="UTC Offset" value={offsetDisplay || "—"} />
              <InfoCard
                icon={hasDST ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                label="Daylight Saving"
                value={hasDST ? "Observed" : "None"}
              />
              <InfoCard
                icon={<Building2 className="w-5 h-5" />}
                label="Timezone Count"
                value={`${country.timezoneCount}`}
              />
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{countryIntro}</p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Local Time</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timezone</th>
                  </tr>
                </thead>
                <tbody>
                  {country.cities.map((city) => (
                    <tr key={city.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={cityUrl(city.name)}
                          className="font-medium text-slate-900 dark:text-slate-100 hover:text-primary-500 transition-colors"
                        >
                          {city.name}
                        </Link>
                        {city.name === country.capital && (
                          <span className="ml-2 text-xs font-medium text-primary-500">Capital</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <LiveTime timezone={city.timezone} />
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {city.timezone.replace(/_/g, " ")} · {city.gmtOffset}
                        {city.airportCode && <span className="ml-2 font-mono text-xs">{city.airportCode}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Public Holidays */}
          {country.publicHolidays.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <PartyPopper className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Public Holidays in {country.name}
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
                      {country.publicHolidays.map((holiday) => (
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

          {/* Compare with the world + business hours (product advantage) */}
          {primaryCity && (
            <CountryComparisonWidget
              timezone={primaryCity.timezone}
              cityName={primaryCity.name}
              countryName={country.name}
            />
          )}

          {/* FAQ */}
          <div className="mt-10">
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

          {/* Popular Countries */}
          {popularCountries.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Popular from {country.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {popularCountries.map((pc) => (
                  <Link
                    key={pc.id}
                    href={`/country/${pc.code.toLowerCase()}`}
                    className="glass rounded-xl p-4 card-hover group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pc.flag}</span>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                          {pc.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {pc.capital} · {pc.timezoneCount} timezone{pc.timezoneCount !== 1 ? "s" : ""}
                        </div>
                      </div>
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

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1 text-primary-500">{icon}</div>
      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

// Helper: format MM-DD date string to a readable format
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

// Client component for live time
import { LiveTime } from "@/components/LiveTime";
