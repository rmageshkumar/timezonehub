"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Clock, CalendarDays, Globe, Ban, Sunrise } from "lucide-react";
import { getHoliday } from "@/lib/holidays";
import { getDSTInfo } from "@/lib/dst";

export function CityStatusBadges({ timezone, gmtOffset, countryCode }: { timezone: string; gmtOffset: string; countryCode?: string }) {
  const [isDay, setIsDay] = useState(true);
  const [isBiz, setIsBiz] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [holiday, setHoliday] = useState<{ name: string; type: string } | null>(null);
  const [dstStatus, setDstStatus] = useState("");
  const [dstImminent, setDstImminent] = useState(false);
  const [dstLabel, setDstLabel] = useState<string | null>(null);
  const [daysUntilDST, setDaysUntilDST] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      try {
        const h = parseInt(
          new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone })
        );
        const day = new Date().toLocaleString("en-US", { weekday: "short", timeZone: timezone });
        setIsDay(h >= 6 && h < 18);
        setIsBiz(h >= 9 && h < 17);
        setIsWeekend(day === "Sat" || day === "Sun");
      } catch {}
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [timezone]);

  // Check holiday
  useEffect(() => {
    if (!countryCode) return;
    const h = getHoliday(countryCode);
    setHoliday(h ? { name: h.name, type: h.type } : null);
  }, [countryCode]);

  // Check DST
  useEffect(() => {
    const info = getDSTInfo(timezone);
    setDstStatus(info.status);
    setDstImminent(info.transitionIsImminent);
    setDstLabel(info.transitionLabel);
    setDaysUntilDST(info.daysUntilTransition);
  }, [timezone]);

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {/* Holiday badge — shown first if active */}
      {holiday && (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
          holiday.type === "national" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
        }`}>
          <Ban className="w-3.5 h-3.5" />
          {holiday.name}
          {holiday.type === "national" && " — Business Closed"}
        </span>
      )}
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
        isDay
          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700"
          : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700"
      }`}>
        {isDay ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        {isDay ? "Daytime" : "Nighttime"}
      </span>

      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
        isBiz
          ? "bg-green-100 dark:bg-green-900/30 text-green-700"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600"
      }`}>
        <Clock className="w-3.5 h-3.5" />
        {isBiz ? "Business Hours" : "Outside Business Hours"}
      </span>

      {isWeekend && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700">
          <CalendarDays className="w-3.5 h-3.5" />
          Weekend
        </span>
      )}

      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
        <Globe className="w-3.5 h-3.5" />
        GMT{gmtOffset}
      </span>

      {/* DST Badge */}
      {dstStatus !== "No DST observed" && (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
          dstImminent
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 animate-pulse"
            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
        }`}>
          <Sunrise className="w-3.5 h-3.5" />
          {dstImminent ? (
            <span>
              ⚠️ {dstLabel}{" "}
              {daysUntilDST !== null && (
                <strong>in {daysUntilDST} day{daysUntilDST !== 1 ? "s" : ""}</strong>
              )}
            </span>
          ) : (
            dstStatus
          )}
        </span>
      )}
    </div>
  );
}
