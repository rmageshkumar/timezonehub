"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, Search, Sun, Moon, Clock, GripVertical } from "lucide-react";

interface SelectedCity {
  id: string;
  name: string;
  timezone: string;
  countryFlag: string;
  countryName: string;
  gmtOffset: string;
}

export function TimeConverterClient() {
  const [mounted, setMounted] = useState(false);
  const [cities, setCities] = useState<SelectedCity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    startHour: number;
    endHour: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Load saved cities after mount (prevents hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("converter_cities");
      if (saved) setCities(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem("converter_cities", JSON.stringify(cities)); } catch {}
  }, [cities, mounted]);

  // Search
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

  const removeCity = (id: string) => setCities(cities.filter((c) => c.id !== id));

  // Drag and drop reorder
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

  const getOffsetHours = (offset: string): number => {
    const match = offset.match(/([+-])(\d{2}):(\d{2})/);
    if (match) {
      return (match[1] === "+" ? 1 : -1) * parseInt(match[2]);
    }
    return 0;
  };

  // Convert a UTC hour to a city's local hour
  const utcToLocal = (utcHour: number, cityOffset: string): number => {
    const offset = getOffsetHours(cityOffset);
    return ((utcHour + offset) % 24 + 24) % 24;
  };

  // Convert a city's local hour back to UTC for the reference city
  const localToUtc = (localHour: number, cityOffset: string): number => {
    const offset = getOffsetHours(cityOffset);
    return ((localHour - offset) % 24 + 24) % 24;
  };

  const handleMouseDown = (hour: number) => {
    setIsDragging(true);
    setDragStart(hour);
    setSelectedRange({ startHour: hour, endHour: hour });
  };

  const handleMouseEnter = (hour: number) => {
    setHoveredHour(hour);
    if (isDragging && dragStart !== null) {
      setSelectedRange({
        startHour: Math.min(dragStart, hour),
        endHour: Math.max(dragStart, hour),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Clear range on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRange(null);
        setIsDragging(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // For the reference city (first city), show times in all other cities
  const referenceCity = cities[0];
  const otherCities = cities.slice(1);

  // Format the converted time display
  const formatConvertedTime = (utcHour: number, city: SelectedCity): string => {
    const localHour = utcToLocal(utcHour, city.gmtOffset);
    const period = localHour >= 12 ? "PM" : "AM";
    const displayHour = localHour === 0 ? 12 : localHour > 12 ? localHour - 12 : localHour;
    return `${displayHour}:00 ${period}`;
  };

  const formatHourDisplay = (hour: number): string => {
    const period = hour >= 12 ? "PM" : "AM";
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display}:00 ${period}`;
  };

  return (
    <div
      className="space-y-6"
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setHoveredHour(null);
        handleMouseUp();
      }}
    >
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-shadow ${
                dragIndex === index ? "opacity-50 shadow-lg" : ""
              }`}
            >
              <GripVertical className="w-3.5 h-3.5 text-primary-400 cursor-grab" />
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
        </div>

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
                  {searchResults.map((city: any) => (
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
      {cities.length >= 2 && (
        <div className="glass rounded-2xl p-6 overflow-x-auto">
          {/* Instructions */}
          <div className="mb-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-950 text-sm text-primary-700 dark:text-primary-300">
            <strong>How to use:</strong> Hover over hours to preview converted times. Click and drag to select a time range.
            Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-xs font-mono">Esc</kbd> to clear selection.
          </div>

          <div className="min-w-[900px]">
            {/* Header: UTC Hours */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
              <div className="w-36 flex-shrink-0" />
              {hours.map((h) => {
                const isInRange =
                  selectedRange &&
                  h >= selectedRange.startHour &&
                  h <= selectedRange.endHour;
                const isHovered = hoveredHour === h;
                return (
                  <div
                    key={h}
                    className={`flex-1 text-center text-xs font-mono py-1 rounded transition-colors select-none ${
                      isInRange
                        ? "bg-primary-500 text-white font-bold"
                        : isHovered
                        ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                        : "text-slate-500"
                    }`}
                  >
                    {h.toString().padStart(2, "0")}:00
                  </div>
                );
              })}
            </div>

            {/* City Rows */}
            {cities.map((city, cityIndex) => (
              <div
                key={city.id}
                draggable
                onDragStart={() => handleDragStart(cityIndex)}
                onDragOver={(e) => handleDragOver(e, cityIndex)}
                onDragEnd={handleDragEnd}
                className={`flex items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 group transition-opacity ${
                  dragIndex === cityIndex ? "opacity-50" : ""
                }`}
              >
                {/* City Label */}
                <div className="w-36 flex-shrink-0 flex items-center gap-2 pr-2 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                  <span className="text-lg">{city.countryFlag}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {city.gmtOffset}
                    </div>
                  </div>
                </div>

                {/* Hour Cells */}
                {hours.map((utcHour) => {
                  const localHour = utcToLocal(utcHour, city.gmtOffset);
                  const isBiz = localHour >= 9 && localHour < 17;
                  const isDay = localHour >= 6 && localHour < 18;

                  const isInRange =
                    selectedRange &&
                    utcHour >= selectedRange.startHour &&
                    utcHour <= selectedRange.endHour;
                  const isHovered = hoveredHour === utcHour;

                  return (
                    <div
                      key={utcHour}
                      className={`flex-1 h-10 rounded mx-0.5 flex items-center justify-center text-xs font-mono transition-all duration-150 select-none ${
                        isInRange
                          ? "bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/30 scale-105 z-10 relative"
                          : isHovered
                          ? isBiz
                            ? "bg-green-200 dark:bg-green-900/60 text-green-800 dark:text-green-300 ring-2 ring-primary-400"
                            : isDay
                            ? "bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 ring-2 ring-primary-400"
                            : "bg-indigo-200 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 ring-2 ring-primary-400"
                          : isBiz
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : isDay
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                          : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-300"
                      } ${
                        cityIndex === 0
                          ? "cursor-pointer hover:brightness-95"
                          : "cursor-default"
                      }`}
                      onMouseDown={() => cityIndex === 0 && handleMouseDown(utcHour)}
                      onMouseEnter={() => handleMouseEnter(utcHour)}
                      title={`${city.name}: ${formatHourDisplay(localHour)} ${
                        isBiz ? "(Business)" : isDay ? "(Day)" : "(Night)"
                      }`}
                    >
                      {localHour.toString().padStart(2, "0")}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />{" "}
                Business (9-5)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700" />{" "}
                Daytime
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-300 dark:border-indigo-700" />{" "}
                Night
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-primary-500" /> Selected Range
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Converted Times Summary */}
      {selectedRange && cities.length >= 2 && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            <Clock className="w-5 h-5 inline mr-2 text-primary-500" />
            Time Conversion
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => {
              const startLocal = utcToLocal(selectedRange.startHour, city.gmtOffset);
              const endLocal = utcToLocal(selectedRange.endHour, city.gmtOffset);
              return (
                <div
                  key={city.id}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">{city.countryFlag}</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {city.name}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-primary-600 dark:text-primary-400">
                    {formatHourDisplay(startLocal)} – {formatHourDisplay(endLocal)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{city.gmtOffset}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Placeholder when no cities */}
      {mounted && cities.length < 2 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Add cities to convert times
          </h3>
          <p className="text-sm text-slate-400">
            Add at least 2 cities, then click and drag on the first city&apos;s row
            to select a time range and see converted times across all cities.
          </p>
        </div>
      )}
    </div>
  );
}
