"use client";

import { useState, useEffect } from "react";
import { Plus, X, Search, Sparkles, Clock, Calendar, Sun, Zap, ChevronRight, GripVertical, Ban, Sunrise, Save } from "lucide-react";
import toast from "react-hot-toast";
import { getHoliday } from "@/lib/holidays";
import { getDSTInfo } from "@/lib/dst";
import { AddToCalendar } from "@/components/AddToCalendar";

interface SelectedCity {
  id: string;
  name: string;
  timezone: string;
  countryFlag: string;
  countryName: string;
  gmtOffset: string;
  countryCode?: string;
}

interface TimeSlot {
  utcHour: number;
  dayOffset: number;
  dayName: string;
  dateStr: string;
  score: number;
  times: { city: SelectedCity; localHour: number; isBiz: boolean; isLunch: boolean; isWeekend: boolean }[];
}

export function AISchedulerClient() {
  const [mounted, setMounted] = useState(false);
  const [cities, setCities] = useState<SelectedCity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [results, setResults] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slotReasons, setSlotReasons] = useState<Record<number, string[]>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scheduler_cities");
      if (saved) setCities(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem("scheduler_cities", JSON.stringify(cities)); } catch {}
  }, [cities, mounted]);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.cities || []);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addCity = (city: any) => {
    if (cities.find((c) => c.id === city.id)) return;
    setCities([...cities, {
      id: city.id, name: city.name, timezone: city.timezone,
      countryFlag: city.country?.flag || "🌍",
      countryName: city.country?.name || "",
      gmtOffset: city.gmtOffset,
      countryCode: city.country?.code || undefined,
    }]);
    setSearchQuery(""); setSearchResults([]); setShowSearch(false);
  };

  const removeCity = (id: string) => { setCities(cities.filter((c) => c.id !== id)); setResults([]); setSelectedSlot(null); };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...cities];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    setCities(reordered);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const getOffsetHours = (offset: string): number => {
    const match = offset.match(/([+-])(\d{2}):(\d{2})/);
    if (match) return (match[1] === "+" ? 1 : -1) * parseInt(match[2]);
    return 0;
  };

  const utcToLocal = (utcHour: number, gmtOffset: string): number => {
    const offset = getOffsetHours(gmtOffset);
    return ((utcHour + offset) % 24 + 24) % 24;
  };

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const findBestTimes = () => {
    if (cities.length < 2) {
      toast.error("Add at least 2 cities to find meeting times");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      const currentUtcHour = now.getUTCHours();
      const currentDay = now.getUTCDay();

      const slots: (TimeSlot & { reasons: string[] })[] = [];

      // Scan next 7 days, every 30 minutes for finer granularity
      for (let halfHour = 0; halfHour < 336; halfHour++) {
        const utcHour = (currentUtcHour + halfHour * 0.5) % 24;
        const dayOffset = Math.floor((currentUtcHour + halfHour * 0.5) / 24);
        const dayOfWeek = (currentDay + dayOffset) % 7;
        const dayName = DAYS[dayOfWeek];

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const slotDate = new Date(now);
        slotDate.setUTCHours(slotDate.getUTCHours() + halfHour * 0.5);
        const dateStr = slotDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const times = cities.map((city) => {
          const localHour = utcToLocal(utcHour, city.gmtOffset);
          const isBiz = localHour >= 9 && localHour < 17;
          const isLunch = localHour >= 12 && localHour < 13;
          const cityDayOfWeek = (dayOfWeek + (localHour < 0 ? -1 : 0) + 7) % 7;
          const isWeekendLocal = cityDayOfWeek === 0 || cityDayOfWeek === 6;
          const isVeryEarly = localHour < 6;
          const isEarly = localHour >= 6 && localHour < 7;
          const isLate = localHour >= 18 && localHour < 22;
          const isVeryLate = localHour >= 22;
          return { city, localHour, isBiz, isLunch, isWeekend: isWeekendLocal, isVeryEarly, isEarly, isLate, isVeryLate };
        });

        const reasons: string[] = [];
        let score = 0;

        // === HARD ELIMINATION RULES ===
        const veryEarlyCount = times.filter(t => t.isVeryEarly).length;
        const veryLateCount = times.filter(t => t.isVeryLate).length;

        // NEVER suggest a slot where ANY city is before 6 AM or after 10 PM
        if (veryEarlyCount > 0 || veryLateCount > 0) continue;

        // NEVER suggest a slot where ANY city is in lunch break (12-1 PM)
        const lunchCount = times.filter(t => t.isLunch).length;
        if (lunchCount > 0) continue;

        // NEVER suggest a slot where ANY city is on weekend
        const weekendCount = times.filter(t => t.isWeekend).length;
        if (weekendCount > 0) continue;

        // === HOLIDAY CHECK ===
        const holidayCities: string[] = [];
        for (const t of times) {
          if (t.city.countryCode) {
            const slotDate = new Date(now);
            slotDate.setUTCHours(slotDate.getUTCHours() + halfHour * 0.5);
            const holiday = getHoliday(t.city.countryCode, slotDate);
            if (holiday && holiday.type === "national") {
              holidayCities.push(t.city.countryFlag + " " + t.city.name + " (" + holiday.name + ")");
            }
          }
        }
        // Penalize holidays heavily in scoring
        const holidayCount = holidayCities.length;

        // === SCORING ===
        const bizCount = times.filter(t => t.isBiz).length;
        const earlyCount = times.filter(t => t.isEarly).length;
        const lateCount = times.filter(t => t.isLate).length;
        const awakeCount = times.filter(t => t.localHour >= 7 && t.localHour < 20).length;

        // BASE: All cities must be awake (7 AM - 8 PM range)
        if (awakeCount < cities.length) continue;

        // SCORE COMPONENTS
        // Core: business hours
        score += bizCount * 25;

        // Badge: show business hours status
        if (bizCount === cities.length) {
          reasons.push("✅ All " + cities.length + " cities in business hours");
          score += 50;
        } else if (bizCount >= 2) {
          const bizNames = times.filter(t => t.isBiz).map(t => t.city.name).join(", ");
          reasons.push("🏢 Business hours in: " + bizNames);
        }

        // Badge: show early/late cities
        if (earlyCount > 0) {
          const earlyNames = times.filter(t => t.isEarly).map(t => t.city.name).join(", ");
          reasons.push("🌅 Early morning for: " + earlyNames + " (6-7 AM)");
          score -= earlyCount * 30;
        }
        if (lateCount > 0) {
          const lateNames = times.filter(t => t.isLate).map(t => t.city.name).join(", ");
          reasons.push("🌆 After hours for: " + lateNames + " (6-10 PM)");
          score -= lateCount * 30;
        }

        // Bonus: morning sweet spot (9-11 AM in most cities)
        const morningBiz = times.filter(t => t.isBiz && t.localHour >= 9 && t.localHour <= 11).length;
        if (morningBiz >= Math.ceil(cities.length / 2)) {
          reasons.push("☀️ Morning sweet spot (" + morningBiz + "/" + cities.length + " cities)");
          score += 15;
        }

        // Bonus: weekday
        if (!isWeekend) {
          reasons.push("📅 Weekday");
          score += 10;
        }

        // Holiday penalty
        if (holidayCount > 0) {
          reasons.push("🏛️ National holiday: " + holidayCities.join(", "));
          score -= holidayCount * 35; // Heavy penalty
        }

        // DST transition warning
        const dstCities: string[] = [];
        for (const t of times) {
          const dstInfo = getDSTInfo(t.city.timezone);
          if (dstInfo.transitionIsImminent) {
            dstCities.push(t.city.countryFlag + " " + t.city.name + " (" + dstInfo.transitionLabel + " in " + dstInfo.daysUntilTransition + "d)");
          }
        }
        if (dstCities.length > 0) {
          reasons.push("⏰ DST change soon: " + dstCities.join("; "));
          score -= 5;
        }

        // Bonus: closer to "today" is better
        if (dayOffset === 0) { score += 5; reasons.push("🕐 Today"); }
        else if (dayOffset === 1) { score += 3; reasons.push("🕐 Tomorrow"); }

        if (score > 0) {
          slots.push({
            utcHour, dayOffset, dayName,
            dateStr: dateStr + (dayOffset === 0 ? " (Today)" : dayOffset === 1 ? " (Tomorrow)" : ""),
            score, times, reasons,
          });
        }
      }

      // Sort by score descending, take top 6
      const best = slots.sort((a, b) => b.score - a.score).slice(0, 6);

      // Store results without reasons in the main state, reasons in separate map
      const cleanResults = best.map(({ reasons: _r, ...rest }) => rest as TimeSlot);
      const reasonsMap: Record<number, string[]> = {};
      best.forEach((s, i) => { reasonsMap[i] = s.reasons; });

      setResults(cleanResults);
      setSlotReasons(reasonsMap);
      setSelectedSlot(cleanResults[0] || null);
      setLoading(false);

      if (best.length === 0) {
        toast.error("No suitable times found. All overlapping slots have at least one city before 6 AM, after 10 PM, at lunch, or on a weekend. Try cities with closer timezones.");
      }
    }, 300);
  };

  const formatHour = (h: number): string => {
    const period = h >= 12 ? "PM" : "AM";
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const mins = Math.round((h % 1) * 60);
    if (mins > 0) return `${display}:${mins.toString().padStart(2, "0")} ${period}`;
    return `${display}:00 ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* City Selector */}
      <div className="relative z-10 glass rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {cities.map((city, index) => (
            <span key={city.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 text-sm font-medium cursor-grab active:cursor-grabbing select-none ${dragIndex === index ? "opacity-50 shadow-lg" : ""}`}>
              <GripVertical className="w-3.5 h-3.5 text-primary-400" />
              {city.countryFlag} {city.name}
              <button onClick={() => removeCity(city.id)} className="hover:text-red-500 ml-0.5"><X className="w-3.5 h-3.5" /></button>
            </span>
          ))}
          <button onClick={() => setShowSearch(true)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 text-sm hover:border-primary-500 hover:text-primary-500">
            <Plus className="w-3.5 h-3.5" /> Add City
          </button>
        </div>

        {showSearch && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 z-50 glass rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search city..." className="input-field pl-9 text-sm" autoFocus />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border-t border-slate-200 dark:border-slate-700">
                  {searchResults.map((city: any) => (
                    <button key={city.id} onClick={() => addCity(city)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm">
                      <span>{city.country?.flag || "🌍"}</span><span className="text-slate-700 dark:text-slate-300">{city.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">{city.gmtOffset}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.length === 0 && searchQuery.length >= 2 && <div className="p-4 text-center text-sm text-slate-500">No cities found</div>}
              <button onClick={() => setShowSearch(false)} className="w-full text-center text-xs text-slate-500 py-2 border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            </div>
          </>
        )}

        {/* Find Button */}
        {cities.length >= 2 && (
          <button onClick={findBestTimes} disabled={loading}
            className="btn-primary flex items-center gap-2 mx-auto">
            <Sparkles className="w-4 h-4" />
            {loading ? "Analyzing..." : "Find Best Meeting Time"}
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && selectedSlot && (
        <div className="space-y-6 animate-fade-in">
          {/* Best Recommendation */}
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:from-primary-950/30 dark:to-accent-950/30 border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Best Meeting Time</h3>
              <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full font-medium">AI Recommended</span>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => {
                    const meeting = {
                      id: Date.now().toString(36),
                      title: `Meeting: ${cities.map(c => c.name).join(", ")}`,
                      date: `${selectedSlot.dayName}, ${selectedSlot.dateStr}`,
                      time: cities.map(c => {
                        const lh = utcToLocal(selectedSlot.utcHour, c.gmtOffset);
                        return `${c.name}: ${formatHour(lh)}`;
                      }).join(" | "),
                      cities: cities.map(c => c.name).join(", "),
                      notes: cities.map(c => {
                        const lh = utcToLocal(selectedSlot.utcHour, c.gmtOffset);
                        return `${c.name}: ${formatHour(lh)} (${c.gmtOffset})`;
                      }).join("\n"),
                    };
                    try {
                      const saved = JSON.parse(localStorage.getItem("tz_saved_meetings") || "[]");
                      saved.unshift(meeting);
                      localStorage.setItem("tz_saved_meetings", JSON.stringify(saved));
                      toast.success("Meeting saved to schedule!");
                    } catch { toast.error("Failed to save"); }
                  }}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <AddToCalendar
                  event={{
                    title: `Meeting: ${cities.map(c => c.name).join(", ")}`,
                    startDate: (() => { const d = new Date(); d.setUTCHours(selectedSlot.utcHour + selectedSlot.dayOffset * 24, 0, 0, 0); return d; })(),
                    endDate: (() => { const d = new Date(); d.setUTCHours(selectedSlot.utcHour + selectedSlot.dayOffset * 24 + 1, 0, 0, 0); return d; })(),
                    description: cities.map(c => {
                      const lh = utcToLocal(selectedSlot.utcHour, c.gmtOffset);
                      return `${c.name}: ${formatHour(lh)} (${c.gmtOffset})`;
                    }).join("\n"),
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedSlot.dayName}, {selectedSlot.dateStr}
              </span>
            </div>

            {/* Time columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedSlot.times.map((t) => (
                <div key={t.city.id}
                  className={`rounded-xl p-4 text-center transition-all ${
                    t.isBiz ? "bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700" :
                    "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
                  }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl">{t.city.countryFlag}</span>
                    <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{t.city.name}</span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
                    {formatHour(t.localHour)}
                  </div>
                  <div className="flex justify-center gap-1.5 mt-1.5">
                    {t.isBiz ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">Business Hours ✓</span>
                    ) : t.isLunch ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">Lunch Break</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700">Outside Hours</span>
                    )}
                    {t.isWeekend && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">Weekend</span>
                    )}
                    {t.city.countryCode && getHoliday(t.city.countryCode)?.type === "national" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white font-medium">{getHoliday(t.city.countryCode)!.name} 🏛️</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Score badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Match Score: {selectedSlot.score}/{(cities.length * 10) + 33}
              <span className="text-slate-300">·</span>
              {selectedSlot.times.filter(t => t.isBiz).length}/{cities.length} cities in business hours
            </div>

            {/* Reasoning */}
            {slotReasons[0] && slotReasons[0].length > 0 && (
              <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800">
                <div className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1.5">🤖 Why this time?</div>
                <div className="space-y-0.5">
                  {slotReasons[0].map((reason, i) => (
                    <div key={i} className="text-xs text-slate-600 dark:text-slate-400">{reason}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Options */}
          {results.length > 1 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Other Good Options</h3>
              <div className="space-y-2">
                {results.slice(1).map((slot, i) => (
                  <button key={i} onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      selectedSlot === slot ? "bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{slot.dayName}, {slot.dateStr}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          {selectedSlot.times[0] ? formatHour(slot.times[0].localHour) : ""} ({slot.times[0]?.city.name})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary-500">{slot.score} pts</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {mounted && cities.length < 2 && results.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">AI Meeting Scheduler</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Add 2 or more cities, then click "Find Best Meeting Time". 
            The AI will analyze business hours, lunch breaks, and weekends to find the perfect overlapping slot.
          </p>
        </div>
      )}
    </div>
  );
}
