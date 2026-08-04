"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, X, Search, Sun, Moon, Clock, GripVertical, Share2, Check } from "lucide-react";
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

export function CompareClient({ initialCities = [] }: Props) {
  const [mounted, setMounted] = useState(false);
  const [cities, setCities] = useState<SelectedCity[]>(initialCities);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const initialCitiesApplied = useRef(false);

  // Load saved cities after mount, unless we already have initialCities from URL
  useEffect(() => {
    if (initialCities.length > 0 && !initialCitiesApplied.current) {
      initialCitiesApplied.current = true;
      setMounted(true);
      return;
    }
    if (initialCitiesApplied.current) return;
    initialCitiesApplied.current = true;
    try {
      const saved = localStorage.getItem("compare_cities");
      if (saved) setCities(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem("compare_cities", JSON.stringify(cities)); } catch {}
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
    if (cities.find(c => c.id === city.id)) return;
    setCities([...cities, {
      id: city.id, name: city.name, timezone: city.timezone,
      countryFlag: city.country?.flag || "🌍",
      countryName: city.country?.name || "",
      gmtOffset: city.gmtOffset,
    }]);
    setSearchQuery(""); setSearchResults([]); setShowSearch(false);
  };

  const removeCity = (id: string) => setCities(cities.filter(c => c.id !== id));

  // Generate shareable URL from current cities
  const getShareUrl = useCallback(() => {
    if (cities.length === 0) return "";
    const slugs = cities.map(c => c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    return `${window.location.origin}/compare/${slugs.join("/")}`;
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

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };
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

  return (
    <div className="space-y-6">
      {/* City Selector */}
      <div className="relative z-10 glass rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 items-center">
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
              <button onClick={() => removeCity(city.id)} className="hover:text-red-500 ml-0.5"><X className="w-3.5 h-3.5" /></button>
            </span>
          ))}
          <button onClick={() => setShowSearch(true)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 text-sm hover:border-primary-500 hover:text-primary-500">
            <Plus className="w-3.5 h-3.5" /> Add City
          </button>

          {/* Copy Link Button */}
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

        {/* Search Dropdown — positioned relative to the entire selector card */}
        {showSearch && (
          <>
            {/* Backdrop to catch outside clicks */}
            <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 z-50 glass rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city..." className="input-field pl-9 text-sm" autoFocus />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border-t border-slate-200 dark:border-slate-700">
                  {searchResults.map((city) => (
                    <button key={city.id} onClick={() => addCity(city)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm">
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
              <button onClick={() => setShowSearch(false)}
                className="w-full text-center text-xs text-slate-500 py-2 border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Comparison Cards */}
      {cities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <div key={city.id} className="glass rounded-2xl p-6 text-center card-hover">
              <div className="text-3xl mb-2">{city.countryFlag}</div>
              <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">{city.name}</div>
              <div className="text-xs text-slate-500 mb-3">{city.countryName} · {city.gmtOffset}</div>
              <div className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
                <LiveTime timezone={city.timezone} />
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <DayNightBadgeSmall timezone={city.timezone} />
                <BizBadgeSmall timezone={city.timezone} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DayNightBadgeSmall({ timezone }: { timezone: string }) {
  const [isDay, setIsDay] = useState(true);
  useEffect(() => {
    const update = () => {
      try {
        const h = parseInt(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone }));
        setIsDay(h >= 6 && h < 18);
      } catch {}
    };
    update(); const i = setInterval(update, 60000); return () => clearInterval(i);
  }, [timezone]);
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isDay ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700"}`}>
      {isDay ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
      {isDay ? "Day" : "Night"}
    </span>
  );
}

function BizBadgeSmall({ timezone }: { timezone: string }) {
  const [isBiz, setIsBiz] = useState(false);
  useEffect(() => {
    const update = () => {
      try {
        const h = parseInt(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone }));
        setIsBiz(h >= 9 && h < 17);
      } catch {}
    };
    update(); const i = setInterval(update, 60000); return () => clearInterval(i);
  }, [timezone]);
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isBiz ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}>
      <Clock className="w-3 h-3" />
      {isBiz ? "Business" : "Off"}
    </span>
  );
}
