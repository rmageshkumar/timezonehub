/**
 * DST (Daylight Saving Time) detection & alert utility.
 * Uses Intl.DateTimeFormat to detect current DST status and upcoming transitions.
 */

interface DSTInfo {
  /** Whether DST is currently active */
  isDST: boolean;
  /** Current UTC offset string e.g. "+05:30" */
  currentOffset: string;
  /** Standard (non-DST) UTC offset */
  standardOffset: string;
  /** DST offset (if applicable) */
  dstOffset: string | null;
  /** Human-readable description */
  status: string;
  /** Next transition date (if detectable) */
  nextTransition: Date | null;
  /** Days until next transition */
  daysUntilTransition: number | null;
  /** Whether transition is imminent (within 7 days) */
  transitionIsImminent: boolean;
  /** Human-readable transition description */
  transitionLabel: string | null;
}

// Cache to avoid repeated Intl calls
const dstCache = new Map<string, { info: DSTInfo; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getOffsetForDate(timezone: string, date: Date): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    }).formatToParts(date);
    const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "";
    const m = tzName.match(/GMT([+-]\d{2}):?(\d{2})?/);
    if (m) {
      const sign = m[1].startsWith("-") ? -1 : 1;
      const hours = parseInt(m[1].replace("-", ""));
      const mins = m[2] ? parseInt(m[2]) : 0;
      return sign * (hours + mins / 60);
    }
    return 0;
  } catch {
    return 0;
  }
}

function formatOffset(offsetHours: number): string {
  const sign = offsetHours >= 0 ? "+" : "-";
  const absH = Math.abs(Math.floor(offsetHours));
  const absM = Math.round((Math.abs(offsetHours) - absH) * 60);
  if (absM === 0) return sign + absH.toString().padStart(2, "0") + ":00";
  return sign + absH.toString().padStart(2, "0") + ":" + absM.toString().padStart(2, "0");
}

/**
 * Check DST status for a given IANA timezone.
 * Returns comprehensive DST information.
 */
export function getDSTInfo(timezone: string): DSTInfo {
  // Check cache
  const cached = dstCache.get(timezone);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.info;
  }

  try {
    const now = new Date();
    const currentOffset = getOffsetForDate(timezone, now);

    // Check standard offset: look at January 1 (always standard in Northern Hemisphere)
    // and July 1 (always standard in Southern Hemisphere)
    const jan1 = new Date(now.getFullYear(), 0, 1, 12, 0, 0);
    const jul1 = new Date(now.getFullYear(), 6, 1, 12, 0, 0);

    const janOffset = getOffsetForDate(timezone, jan1);
    const julOffset = getOffsetForDate(timezone, jul1);

    // Standard offset is the one that's not DST (typically the smaller one
    // in Northern Hemisphere, but we determine by looking at which offset
    // appears in the "winter" month for the hemisphere)
    const standardOffset = janOffset <= julOffset ? janOffset : julOffset;
    const dstOffset = janOffset > julOffset ? janOffset : julOffset;
    const hasDST = Math.abs(janOffset - julOffset) > 0.01;
    const isDST = Math.abs(currentOffset - standardOffset) > 0.01 && hasDST;

    // Find next DST transition by binary search over the next 365 days
    let nextTransition: Date | null = null;
    let daysUntil: number | null = null;
    let transitionLabel: string | null = null;

    if (hasDST) {
      const currentOffset = getOffsetForDate(timezone, now);
      let lo = 0; // today
      let hi = 365; // 365 days from now

      // Binary search for the transition point
      for (let i = 0; i < 20; i++) {
        const mid = Math.floor((lo + hi) / 2);
        const midDate = new Date(now);
        midDate.setDate(midDate.getDate() + mid);
        midDate.setHours(12, 0, 0, 0);

        const midOffset = getOffsetForDate(timezone, midDate);
        if (Math.abs(midOffset - currentOffset) < 0.01) {
          lo = mid;
        } else {
          hi = mid;
        }

        if (hi - lo <= 1) break;
      }

      const transitionDay = hi;
      if (transitionDay > 0 && transitionDay < 365) {
        const transitionDate = new Date(now);
        transitionDate.setDate(transitionDate.getDate() + transitionDay);
        transitionDate.setHours(2, 0, 0, 0); // DST transitions typically at 2 AM
        nextTransition = transitionDate;
        daysUntil = transitionDay;

        const isSpringForward = !isDST; // If not in DST now, next is spring forward
        transitionLabel = isSpringForward
          ? "⏰ Clocks spring FORWARD 1 hour"
          : "⏰ Clocks fall BACK 1 hour";
      }
    }

    const transitionIsImminent = daysUntil !== null && daysUntil <= 7;

    let status: string;
    if (!hasDST) {
      status = "No DST observed";
    } else if (isDST) {
      if (transitionIsImminent) {
        status = "DST ending soon — clocks fall back in " + daysUntil + " days";
      } else {
        status = "Daylight Saving Active";
      }
    } else {
      if (transitionIsImminent) {
        status = "DST starting soon — clocks spring forward in " + daysUntil + " days";
      } else {
        status = "Standard Time";
      }
    }

    const info: DSTInfo = {
      isDST,
      currentOffset: formatOffset(currentOffset),
      standardOffset: formatOffset(standardOffset),
      dstOffset: hasDST ? formatOffset(dstOffset) : null,
      status,
      nextTransition,
      daysUntilTransition: daysUntil,
      transitionIsImminent,
      transitionLabel,
    };

    dstCache.set(timezone, { info, timestamp: Date.now() });
    return info;
  } catch {
    return {
      isDST: false,
      currentOffset: "+00:00",
      standardOffset: "+00:00",
      dstOffset: null,
      status: "Unknown",
      nextTransition: null,
      daysUntilTransition: null,
      transitionIsImminent: false,
      transitionLabel: null,
    };
  }
}

/**
 * Quick check: is DST currently active?
 */
export function isDSTActive(timezone: string): boolean {
  return getDSTInfo(timezone).isDST;
}

/**
 * Get a human-readable DST alert if transition is imminent.
 * Returns null if no alert needed.
 */
export function getDSTAlert(timezone: string): string | null {
  const info = getDSTInfo(timezone);
  if (!info.transitionIsImminent) return null;
  return info.status;
}
