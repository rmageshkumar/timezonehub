"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, Clock, Sun, Moon, Search, GripVertical } from "lucide-react";

interface SelectedCity {
  id: string;
  name: string;
  timezone: string;
  countryFlag: string;
  gmtOffset: string;
}

export function MeetingPlannerClient() {
  const [mounted, setMounted] = useState(false);
  const [cities, setCities] = useState<SelectedCity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Load saved cities after mount (prevents hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meeting_cities");
      if (saved) setCities(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem("meeting_cities", JSON.stringify(cities)); } catch {}
  }, [cities, mounted]);
  const [hours, setHours] = useState<number[]>([]);

  // Generate 24-hour timeline
  useEffect(() => {
    setHours(Array.from({ length: 24 }, (_, i) => i));
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.cities || []);
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const addCity = (city: any) => {
    if (cities.find(c => c.id === city.id)) return;
    setCities([...cities, {
      id: city.id,
      name: city.name,
      timezone: city.timezone,
      countryFlag: city.country?.flag || "🌍",
      gmtOffset: city.gmtOffset,
    }]);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeCity = (id: string) => {
    setCities(cities.filter(c => c.id !== id));
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => { setDragIndex(index); };
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

  // Get hour status for each city based on its GMT offset
  const getHourStatus = (gmtOffset: string, hour: number) => {
    try {
      const offsetHours = getOffsetHours(gmtOffset);
      const cityHour = ((hour + offsetHours) % 24 + 24) % 24;
      const isBiz = cityHour >= 9 && cityHour < 17;
      const isDay = cityHour >= 6 && cityHour < 18;
      return { isBiz, isDay };
    } catch {
      return { isBiz: false, isDay: true };
    }
  };

  const getOffsetHours = (offset: string): number => {
    const match = offset.match(/([+-])(\d{2}):(\d{2})/);
    if (match) {
      const sign = match[1] === "+" ? 1 : -1;
      return sign * parseInt(match[2]);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* City Selector */}
      <div className="relative z-10 glass rounded-2xl p-6">
        <div className="flex flex-wrap gap-2">
          {cities.map((city, index) => (
            <span
              key={city.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-shadow ${
                dragIndex === index ? "opacity-50 shadow-lg" : ""
              }`}
            >
              <GripVertical className="w-3.5 h-3.5 text-primary-400 cursor-grab" />
              {city.countryFlag} {city.name}
              <button onClick={() => removeCity(city.id)} className="hover:text-red-500 ml-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setShowSearch(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 text-sm hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add City
          </button>
        </div>

        {/* Search Dropdown — positioned relative to the entire selector card */}
        {showSearch && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
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
                      <span className="text-slate-700 dark:text-slate-300">{city.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">{city.gmtOffset}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="p-4 text-center text-sm text-slate-500">No cities found</div>
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

      {/* Time Grid */}
      {cities.length > 0 && (
        <div className="glass rounded-2xl p-6 overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header: UTC Hours */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
              <div className="w-32 flex-shrink-0" />
              {hours.map((h) => (
                <div key={h} className="flex-1 text-center text-xs font-mono text-slate-500">
                  {h.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* City Rows */}
            {cities.map((city) => (
              <div key={city.id} className="flex items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="w-32 flex-shrink-0 flex items-center gap-2">
                  <span>{city.countryFlag}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {city.name}
                  </span>
                </div>
                {hours.map((h) => {
                  const { isBiz, isDay } = getHourStatus(city.gmtOffset, h);
                  return (
                    <div
                      key={h}
                      className={`flex-1 h-8 rounded mx-0.5 flex items-center justify-center text-xs transition-colors ${
                        isBiz
                          ? "bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                          : isDay
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700"
                          : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                      }`}
                      title={`${city.name}: ${h}:00 ${isBiz ? "(Business Hours)" : isDay ? "(Daytime)" : "(Nighttime)"}`}
                    >
                      {isBiz ? "✓" : ""}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900/50" /> Business Hours (9-5)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30" /> Daytime
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/30" /> Nighttime
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
