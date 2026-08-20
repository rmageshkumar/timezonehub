"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RefCity {
  name: string;
  country: string;
  timezone: string;
}

const REFERENCE_CITIES: RefCity[] = [
  { name: "New York", country: "United States", timezone: "America/New_York" },
  { name: "London", country: "United Kingdom", timezone: "Europe/London" },
  { name: "Dubai", country: "United Arab Emirates", timezone: "Asia/Dubai" },
  { name: "Mumbai", country: "India", timezone: "Asia/Kolkata" },
  { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore" },
  { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Sydney", country: "Australia", timezone: "Australia/Sydney" },
];

/** Current UTC offset in minutes for a timezone at a given instant (handles DST). */
function getOffsetMinutes(timeZone: string, now: Date): number | null {
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

function formatOffset(offset: number): string {
  const sign = offset >= 0 ? "+" : "−";
  const abs = Math.abs(offset);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

function formatDiff(diff: number): string {
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const dir = diff > 0 ? "ahead of" : "behind";
  const unit = h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
  return `${unit} ${dir}`;
}

/** Local time in `targetTz` at `sourceHour:00` local in the source timezone. */
function localTimeInSourceTz(
  targetTz: string,
  now: Date,
  sourceHour: number,
  sourceOffsetMinutes: number
): string {
  const utcMinutesOfDay = sourceHour * 60 - sourceOffsetMinutes;
  const base = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    utcMinutesOfDay
  );
  return new Date(base).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: targetTz,
  });
}

/**
 * "X vs the world" + business-hours tables for a country page. Client component
 * so DST-aware offsets and live times are computed in the browser.
 */
export function CountryComparisonWidget({
  timezone,
  cityName,
  countryName,
}: {
  timezone: string;
  cityName: string;
  countryName: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  // Reserve space until mounted to avoid layout shift / hydration mismatch.
  if (!now) return <div className="glass rounded-2xl p-6 min-h-[220px]" aria-hidden />;

  const baseOffset = getOffsetMinutes(timezone, now);
  if (baseOffset === null) return null;

  const rows = REFERENCE_CITIES.map((rc) => {
    const off = getOffsetMinutes(rc.timezone, now);
    const diff = off === null ? null : baseOffset - off;
    const local = new Date(now).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: rc.timezone,
    });
    const openAt = localTimeInSourceTz(rc.timezone, now, 9, baseOffset);
    const closeAt = localTimeInSourceTz(rc.timezone, now, 17, baseOffset);
    return { ...rc, off, diff, local, openAt, closeAt };
  });

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        {cityName} vs the World
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Current time difference between {cityName}, {countryName} and major cities worldwide
        (DST-adjusted live).
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Local Time</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Offset</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">vs {cityName}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.timezone} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{r.name}</span>
                  <span className="block text-xs text-slate-400">{r.country}</span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">{r.local}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{r.off !== null ? formatOffset(r.off) : "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {r.diff === null ? "—" : r.diff === 0 ? "Same time" : formatDiff(r.diff)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Business hours — 9 AM–5 PM in the country, mapped to the world */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-8 mb-1">
        Business Hours in {cityName} (9:00 AM – 5:00 PM)
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        When it&apos;s 9:00 AM – 5:00 PM in {cityName}, here&apos;s the corresponding time in each city.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">9:00 AM in {cityName}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">5:00 PM in {cityName}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.timezone} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{r.name}</td>
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">{r.openAt}</td>
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">{r.closeAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Offsets and times update automatically and account for daylight saving time. Use the{" "}
        <Link href="/converter" className="text-primary-500 hover:underline">time converter</Link>{" "}
        or{" "}
        <Link href="/business-time" className="text-primary-500 hover:underline">Business Hours</Link>{" "}
        tool for more.
      </p>
    </div>
  );
}
