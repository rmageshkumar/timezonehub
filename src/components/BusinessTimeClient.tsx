"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  X,
  Search,
  Clock,
  Sun,
  Moon,
  Share2,
  Check,
  Briefcase,
} from "lucide-react";
import { LiveTime } from "@/components/LiveTime";

interface SelectedCity {
  id: string;
  name: string;
  timezone: string;
  countryFlag: string;
  countryName: string;
  gmtOffset: string;
}

interface Props {
  initialCities?: SelectedCity[];
}

const BUSINESS_START = 9; // 9:00 AM
const BUSINESS_END = 17; // 5:00 PM
const HOURS = Array.from({ length: 24 }, (_, i) => i);

/** Get the local hour (0-23) for a given UTC date in a timezone */
function getLocalHour(utcDate: Date, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).formatToParts(utcDate);
    return parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10) % 24;
  } catch {
    return 0;
  }
}

/** Format a UTC hour as "9:00 AM" style label */
function formatHourLabel(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${suffix}`;
}

/** Format the local time in a timezone at a specific UTC hour of the current day */
function formatLocalAtUtcHour(utcHour: number, timeZone: string): string {
  try {
    const d = new Date();
    d.setUTCHours(utcHour, 0, 0, 0);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
  } catch {
    return "--";
  }
}

export function BusinessTimeClient({ initialCities = [] }: Props) {
  const [mounted, setMounted] = useState(false);
  const [cities, setCities] = useState<SelectedCity[]>(initialCities);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const [hoverHour, setHoverHour] = useState<number | null>(null);
  const initialApplied = useRef(false);

  // Tick every 30s so the timeline + current-time marker stay live
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // Load saved cities (or use URL-provided initialCities)
  useEffect(() => {
    if (initialCities.length > 0 && !initialApplied.current) {
      initialApplied.current = true;
      setMounted(true);
      return;
    }
    if (initialApplied.current) return;
    initialApplied.current = true;
    try {
      const saved = localStorage.getItem("biztime_cities");
      if (saved) setCities(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("biztime_cities", JSON.stringify(cities));
    } catch {}
  }, [cities, mounted]);

  // Sync the browser URL with the selected cities so it's shareable
  // (e.g. /business-time/sydney/canberra/chennai) and updates live on
  // add/remove. Uses replaceState to avoid a server round-trip/flicker.
  useEffect(() => {
    if (!mounted) return;
    const slugs = cities
      .map((c) =>
        c.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      )
      .filter(Boolean);
    const path =
      slugs.length > 0
        ? `/business-time/${slugs.join("/")}`
        : "/business-time";
    window.history.replaceState(null, "", path);
  }, [cities, mounted]);

  // City search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        );
        const data = await res.json();
        setSearchResults(data.cities || []);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addCity = (city: any) => {
    if (cities.find((c) => c.id === city.id)) return;
    setCities([
      ...cities,
      {
        id: city.id,
        name: city.name,
        timezone: city.timezone,
        countryFlag: city.country?.flag || "🌍",
        countryName: city.country?.name || "",
        gmtOffset: city.gmtOffset,
      },
    ]);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeCity = (id: string) =>
    setCities(cities.filter((c) => c.id !== id));

  const getShareUrl = useCallback(() => {
    if (cities.length === 0) return "";
    const slugs = cities
      .map((c) =>
        c.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      )
      .join("/");
    return `${window.location.origin}/business-time/${slugs}`;
  }, [cities]);

  const handleCopyLink = async () => {
    const url = getShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Build per-city business-hours map over the current UTC day (24 slots).
  // Every row shares the SAME UTC axis, so the same moment is vertically
  // aligned across all cities (e.g. London 8:00 AM == Chennai 12:30 PM).
  const cityRows = cities.map((city) => {
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const slots = HOURS.map((h) => {
      const d = new Date(startOfDay.getTime() + h * 3600000);
      const localHour = getLocalHour(d, city.timezone);
      return localHour >= BUSINESS_START && localHour < BUSINESS_END;
    });
    // Current local hour
    const currentLocalHour = getLocalHour(now, city.timezone);
    return { city, slots, currentLocalHour };
  });

  // Overlap: UTC hours where EVERY city is in business hours
  const overlapHours = HOURS.filter((h) =>
    cityRows.every(({ slots }) => slots[h]),
  );

  // Current hour on the shared UTC axis — the red "Now" line sits here for ALL rows
  const nowUtcHour = now.getUTCHours();

  // Render a single city timeline row (shared UTC axis)
  const renderTimelineRow = (row: (typeof cityRows)[number]) => {
    const { city, slots, currentLocalHour } = row;
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-40 flex-shrink-0">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {city.countryFlag} {city.name}
          </div>
          <div className="text-xs text-slate-500">
            {city.countryName} · {city.gmtOffset}
          </div>
        </div>
        {/* 24-hour timeline on a SHARED UTC axis — same moment = same column across cities */}
        <div className="flex-1">
          <div className="flex gap-[2px] h-8">
            {slots.map((isBiz, idx) => {
              const isNow = mounted && idx === nowUtcHour;
              const isHovered = hoverHour === idx;
              return (
                <div
                  key={idx}
                  title={
                    isNow
                      ? `Now — ${formatLocalAtUtcHour(idx, city.timezone)} local`
                      : `${formatHourLabel(idx)} UTC — ${
                          isBiz ? "Business hours" : "Off hours"
                        }`
                  }
                  onMouseEnter={() => setHoverHour(idx)}
                  onMouseLeave={() => setHoverHour(null)}
                  className={`flex-1 rounded-sm relative transition-all cursor-pointer ${
                    isBiz
                      ? "bg-green-500/80 dark:bg-green-500/70"
                      : "bg-slate-200 dark:bg-slate-700"
                  } ${isNow ? "ring-2 ring-red-500 z-10" : ""} ${
                    isHovered
                      ? "ring-2 ring-blue-500 z-20 brightness-110 dark:brightness-125"
                      : ""
                  }`}
                >
                  {isNow && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded px-1.5 py-px text-[9px] font-bold text-white bg-red-500 shadow-sm pointer-events-none">
                      Now · {formatLocalAtUtcHour(idx, city.timezone)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {/* Hour labels */}
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>12 AM</span>
          </div>
        </div>
        {/* Current time + business status */}
        <div className="w-28 flex-shrink-0 text-right">
          <div className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
            <LiveTime timezone={city.timezone} />
          </div>
          <div
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
              currentLocalHour >= BUSINESS_START && currentLocalHour < BUSINESS_END
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {currentLocalHour >= BUSINESS_START && currentLocalHour < BUSINESS_END ? (
              <Briefcase className="w-3 h-3" />
            ) : (
              <Moon className="w-3 h-3" />
            )}
            {currentLocalHour >= BUSINESS_START && currentLocalHour < BUSINESS_END
              ? "Open"
              : "Closed"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* City Selector */}
      <div className="relative z-10 glass rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 items-center">
          {cities.map((city) => (
            <span
              key={city.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 text-sm font-medium select-none"
            >
              {city.countryFlag} {city.name}
              <button
                onClick={() => removeCity(city.id)}
                className="hover:text-red-500 ml-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setShowSearch(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 text-sm hover:border-primary-500 hover:text-primary-500"
          >
            <Plus className="w-3.5 h-3.5" /> Add City
          </button>

          {cities.length > 0 && (
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-500 transition-colors ml-auto"
              title="Copy shareable link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {showSearch && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowSearch(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 z-50 glass rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city..."
                    className="input-field pl-9 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border-t border-slate-200 dark:border-slate-700">
                  {searchResults.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => addCity(city)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm"
                    >
                      <span>{city.country?.flag || "🌍"}</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {city.name}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {city.gmtOffset}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  No cities found
                </div>
              )}
              <button
                onClick={() => setShowSearch(false)}
                className="w-full text-center text-xs text-slate-500 py-2 border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {cities.length > 0 ? (
        <>
          {/* Overlap Summary */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Common Business Hours
              </h2>
              <span className="text-xs text-slate-500 ml-1">
                (9 AM – 5 PM local)
              </span>
            </div>

            {overlapHours.length > 0 ? (
              <>
                <div className="flex gap-[2px] h-10 mb-4">
                  {HOURS.map((h) => {
                    const isOverlap = overlapHours.includes(h);
                    const isHovered = hoverHour === h;
                    return (
                      <div
                        key={h}
                        onMouseEnter={() => setHoverHour(h)}
                        onMouseLeave={() => setHoverHour(null)}
                        title={`${formatHourLabel(h)} UTC${
                          isOverlap ? " — overlap" : ""
                        }`}
                        className={`flex-1 rounded-sm cursor-pointer transition-all ${
                          isOverlap
                            ? "bg-primary-500 dark:bg-primary-400"
                            : "bg-slate-100 dark:bg-slate-800"
                        } ${isHovered ? "ring-2 ring-blue-500 z-10 brightness-110" : ""}`}
                      />
                    );
                  })}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatHourLabel(overlapHours[0])} –{" "}
                    {formatHourLabel(
                      overlapHours[overlapHours.length - 1] + 1,
                    )}
                  </span>{" "}
                  UTC —{" "}
                  {overlapHours.length > 0
                    ? `all ${cities.length} cities overlap for ${overlapHours.length} hour${
                        overlapHours.length > 1 ? "s" : ""
                      }`
                    : ""}
                </p>
                {/* Local equivalents */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cityRows.map(({ city }) => {
                    // Local hour at the first and last+1 overlap UTC hours
                    const d0 = new Date(now);
                    d0.setUTCHours(overlapHours[0], 0, 0, 0);
                    const d1 = new Date(now);
                    d1.setUTCHours(
                      overlapHours[overlapHours.length - 1] + 1,
                      0,
                      0,
                      0,
                    );
                    return (
                      <div
                        key={city.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-sm"
                      >
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {city.countryFlag} {city.name}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 mt-1">
                          {formatHourLabel(getLocalHour(d0, city.timezone))} –{" "}
                          {formatHourLabel(getLocalHour(d1, city.timezone))}{" "}
                          local
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Moon className="w-4 h-4" />
                No overlapping business hours right now. Try adding cities in
                similar time zones.
              </div>
            )}
          </div>

          {/* Per-city timelines */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Business Hours Timeline
              </h2>
              <span className="text-xs text-slate-500 ml-1">
                (aligned to the same moment in UTC · green = business hours · red = now)
              </span>
            </div>

            {/* Hover info bar — always rendered with reserved height so it never shifts the layout */}
            <div className="mb-4 min-h-[52px] rounded-xl border border-blue-200/50 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-950/20 px-4 py-2 flex items-center">
              {hoverHour !== null ? (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm w-full">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    🕒 {formatHourLabel(hoverHour)} UTC
                  </span>
                  {cityRows.map(({ city }) => (
                    <span
                      key={city.id}
                      className="text-slate-600 dark:text-slate-400"
                    >
                      {city.countryFlag}{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {city.name}
                      </span>
                      :{" "}
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {formatLocalAtUtcHour(hoverHour, city.timezone)}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Hover any hour — the same moment is aligned across all cities
                </div>
              )}
            </div>

            <p className="mb-2 text-xs text-slate-400">
              Same moment = same column. Hover any hour to see what time it is
              in every city at that instant.
            </p>

            <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-700 mb-1">
              <div className="w-40 flex-shrink-0 text-xs text-slate-400">
                City
              </div>
              <div className="flex-1 text-xs text-slate-400">
                Hours (UTC — aligned)
              </div>
              <div className="w-28 flex-shrink-0 text-right text-xs text-slate-400">
                Local Time
              </div>
            </div>
            {cityRows.map((row) => (
              <div key={row.city.id}>{renderTimelineRow(row)}</div>
            ))}
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-500/80 inline-block" />
                Business hours
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700 inline-block" />
                Off hours
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm ring-2 ring-red-500 inline-block" />
                Now (local time)
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Compare business hours across cities
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Add two or more cities to see a visual 24-hour timeline and find the
            common window where everyone is at work.
          </p>
        </div>
      )}
    </div>
  );
}
