"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { computeComparisonRows, formatDiff, formatOffset, type ComparisonRow } from "@/lib/timezone-compare";

/**
 * "X vs the world" + business-hours tables for a country page.
 *
 * SSR-friendly: the server pre-computes `initialRows` and passes them in, so the
 * tables exist in the initial HTML and are visible to search engines. After
 * mount, rows are recomputed every 10s so times stay live in the browser. Because
 * `initialRows` comes from the server render, first client paint matches the
 * server HTML (no hydration mismatch).
 */
export function CountryComparisonWidget({
  timezone,
  cityName,
  countryName,
  initialRows,
}: {
  timezone: string;
  cityName: string;
  countryName: string;
  initialRows: ComparisonRow[];
}) {
  const [rows, setRows] = useState<ComparisonRow[]>(initialRows);

  useEffect(() => {
    const update = () => setRows(computeComparisonRows(timezone, new Date()));
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [timezone]);

  // Server couldn't compute rows (invalid timezone) → hide the section entirely.
  if (rows.length === 0) return null;

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
