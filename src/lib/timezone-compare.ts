/**
 * Shared timezone-comparison logic for country pages.
 *
 * Isomorphic: runs on the server (so the "X vs the World" + "Business Hours"
 * tables are server-rendered and visible to search engines) and on the client
 * (for live 10s updates). Kept in one module so SSR and CSR always agree.
 */

export interface RefCity {
  name: string;
  country: string;
  timezone: string;
}

export const REFERENCE_CITIES: RefCity[] = [
  { name: "New York", country: "United States", timezone: "America/New_York" },
  { name: "London", country: "United Kingdom", timezone: "Europe/London" },
  { name: "Dubai", country: "United Arab Emirates", timezone: "Asia/Dubai" },
  { name: "Mumbai", country: "India", timezone: "Asia/Kolkata" },
  { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore" },
  { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Sydney", country: "Australia", timezone: "Australia/Sydney" },
];

/** Current UTC offset in minutes for a timezone at a given instant (handles DST). */
export function getOffsetMinutes(timeZone: string, now: Date): number | null {
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

export function formatOffset(offset: number): string {
  const sign = offset >= 0 ? "+" : "−";
  const abs = Math.abs(offset);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

/** Short form for table cells, e.g. "2h 30m ahead of". */
export function formatDiff(diff: number): string {
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const dir = diff > 0 ? "ahead of" : "behind";
  const unit = h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
  return `${unit} ${dir}`;
}

/** Long form for FAQ prose, e.g. "2 hours 30 minutes ahead of". */
export function formatDiffLong(diff: number): string {
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const dir = diff > 0 ? "ahead of" : "behind";
  const unit = h > 0 && m > 0 ? `${h} hours ${m} minutes` : h > 0 ? `${h} hours` : `${m} minutes`;
  return `${unit} ${dir}`;
}

/** Local time in `targetTz` at `sourceHour:00` local in the source timezone. */
export function localTimeInSourceTz(
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

export interface ComparisonRow extends RefCity {
  off: number | null;
  diff: number | null;
  local: string;
  openAt: string;
  closeAt: string;
}

/** Compute the "X vs the world" + business-hours rows for a base timezone at `now`. */
export function computeComparisonRows(timezone: string, now: Date): ComparisonRow[] {
  const baseOffset = getOffsetMinutes(timezone, now);
  if (baseOffset === null) return [];
  return REFERENCE_CITIES.map((rc) => {
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
}
