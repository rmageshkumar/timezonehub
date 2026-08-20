"use client";

import { useEffect, useState } from "react";

/**
 * Big live clock for the country page hero. Shows the current time (with seconds)
 * plus the full local date in the given timezone, updating every second.
 * Client component so the time stays live without a page reload.
 */
export function CountryLiveClock({
  timezone,
  cityName,
}: {
  timezone: string;
  cityName: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    // Reserve space on first paint to avoid layout shift.
    return <div className="lg:w-64" aria-hidden />;
  }

  let time = "--:--:--";
  let date = "";
  try {
    time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
    date = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: timezone,
    });
  } catch {
    // invalid timezone — keep placeholders
  }

  return (
    <div className="text-left lg:text-right">
      <div className="text-4xl md:text-5xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums leading-none">
        {time}
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{date}</div>
      <div className="mt-1 text-xs text-slate-400">
        {cityName} · {timezone.replace(/_/g, " ")}
      </div>
    </div>
  );
}
