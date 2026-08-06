"use client";

import Link from "next/link";
import { Clock, MapPin, Sun, Moon, Briefcase, CalendarDays, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cityUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CityData {
  id: string;
  name: string;
  timezone: string;
  gmtOffset: string;
  dstOffset: string | null;
  airportCode: string | null;
  population: number | null;
}

interface CountryCardProps {
  country: {
    id: string;
    name: string;
    code: string;
    flag: string;
    timezoneCount: number;
    cities: CityData[];
    _count?: { cities: number };
  };
  expanded?: boolean;
}

export function CountryCard({ country, expanded: defaultExpanded = false }: CountryCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasMultipleTimezones = country.timezoneCount > 1;

  // Get primary city's time info
  const primaryCity = country.cities[0];
  const now = new Date();

  return (
    <div className="glass rounded-2xl p-6 card-hover group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Link href={`/country/${country.code.toLowerCase()}`} className="flex items-center gap-3">
          <span className="text-3xl">{country.flag}</span>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
              {country.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {country.timezoneCount} {country.timezoneCount === 1 ? "Timezone" : "Timezones"}
            </p>
          </div>
        </Link>
      </div>

      {/* Time Info */}
      {primaryCity && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Current Time</span>
            <TimeDisplay timezone={primaryCity.timezone} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Current Date</span>
            <DateDisplay timezone={primaryCity.timezone} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">GMT Offset</span>
            <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
              {primaryCity.gmtOffset}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <StatusBadge timezone={primaryCity.timezone} />
            <WeekendBadge timezone={primaryCity.timezone} />
          </div>
        </div>
      )}

      {/* Multiple Timezones Toggle */}
      {hasMultipleTimezones && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors w-full"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
            {expanded ? "Hide" : "View"} {country.cities.length} Cities
          </button>

          {expanded && (
            <div className="mt-3 space-y-2 animate-slide-up">
              {country.cities.map((city) => (
                <Link
                  key={city.id}
                  href={cityUrl(city.name)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{city.name}</span>
                    {city.airportCode && (
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                        {city.airportCode}
                      </span>
                    )}
                  </div>
                  <TimeDisplaySmall timezone={city.timezone} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TimeDisplay({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: timezone,
          })
        );
      } catch {
        setTime("--:--");
      }
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{time || "--:--"}</span>;
}

function DateDisplay({ timezone }: { timezone: string }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setDate(
          new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: timezone,
          })
        );
      } catch {
        setDate("---");
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{date || "---"}</span>;
}

function TimeDisplaySmall({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: timezone,
          })
        );
      } catch {
        setTime("--:--");
      }
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{time || "--:--"}</span>;
}

function StatusBadge({ timezone }: { timezone: string }) {
  const [isBusiness, setIsBusiness] = useState(false);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const update = () => {
      try {
        const hour = parseInt(
          new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone })
        );
        setIsBusiness(hour >= 9 && hour < 17);
        setIsDay(hour >= 6 && hour < 18);
      } catch {}
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
        isBusiness
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
      )}
    >
      {isDay ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
      {isBusiness ? "Business Hours" : isDay ? "Daytime" : "Nighttime"}
    </span>
  );
}

function WeekendBadge({ timezone }: { timezone: string }) {
  const [isWeekend, setIsWeekend] = useState(false);

  useEffect(() => {
    const update = () => {
      try {
        const day = new Date().toLocaleString("en-US", { weekday: "short", timeZone: timezone });
        setIsWeekend(day === "Sat" || day === "Sun");
      } catch {}
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (!isWeekend) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
      <CalendarDays className="w-3 h-3" />
      Weekend
    </span>
  );
}


