"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cityUrl } from "@/lib/utils";
import Link from "next/link";

interface CityTime {
  id: string;
  name: string;
  timezone: string;
  countryName: string;
  countryFlag: string;
}

export function Timeline({ cities }: { cities: CityTime[] }) {
  const [times, setTimes] = useState<Record<string, { time: string; isDay: boolean }>>({});

  useEffect(() => {
    const updateAll = () => {
      const now = new Date();
      const newTimes: Record<string, { time: string; isDay: boolean }> = {};
      cities.forEach((city) => {
        try {
          const hour = parseInt(
            now.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: city.timezone })
          );
          newTimes[city.id] = {
            time: now.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: city.timezone,
            }),
            isDay: hour >= 6 && hour < 18,
          };
        } catch {
          newTimes[city.id] = { time: "--:--", isDay: true };
        }
      });
      setTimes(newTimes);
    };

    updateAll();
    const interval = setInterval(updateAll, 15000);
    return () => clearInterval(interval);
  }, [cities]);

  if (cities.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4 overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {cities.map((city) => {
          const info = times[city.id];
          const isDay = info?.isDay ?? true;
          return (
            <Link
              key={city.id}
              href={cityUrl(city.name)}
              className={`flex-shrink-0 w-40 p-3 rounded-xl transition-all hover:scale-105 cursor-pointer ${
                isDay
                  ? "bg-gradient-to-b from-amber-50 to-blue-50 dark:from-amber-950/30 dark:to-blue-950/30 border border-amber-200/50 dark:border-amber-700/30"
                  : "bg-gradient-to-b from-indigo-50 to-slate-50 dark:from-indigo-950/30 dark:to-slate-950/30 border border-indigo-200/50 dark:border-indigo-700/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {city.name}
                </span>
                {isDay ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                {info?.time || "--:--"}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <span>{city.countryFlag}</span>
                <span className="truncate">{city.countryName}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
