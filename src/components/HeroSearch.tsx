"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Globe, Clock, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  countries: Array<{ id: string; name: string; code: string; flag: string; timezoneCount: number }>;
  cities: Array<{
    id: string;
    name: string;
    timezone: string;
    airportCode: string | null;
    gmtOffset: string;
    country: { id: string; name: string; code: string; flag: string };
  }>;
  timezones: Array<{ id: string; name: string; abbr: string | null; offset: string }>;
}

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch {
        setResults(null);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const totalResults = results
    ? results.countries.length + results.cities.length + results.timezones.length
    : 0;

  return (
    <div ref={ref} className="relative max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results && setIsOpen(true)}
          placeholder="Search cities, countries, timezones, airport codes... (e.g. SYD, IST, London)"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-lg shadow-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 max-h-96 overflow-y-auto animate-slide-up">
          {totalResults === 0 && query.length > 0 && (
            <div className="p-6 text-center">
              <p className="text-slate-500">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
            </div>
          )}

          {/* Countries */}
          {results.countries.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                Countries
              </div>
              {results.countries.map((c) => (
                <Link
                  key={c.id}
                  href={`/country/${c.code.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-xl">{c.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.timezoneCount} timezone{c.timezoneCount !== 1 ? "s" : ""}</div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{c.code}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Cities */}
          {results.cities.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                Cities
              </div>
              {results.cities.map((c) => (
                <Link
                  key={c.id}
                  href={`/city/${c.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {c.name}
                      <span className="text-xs text-slate-400 ml-1.5">{c.country.flag}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {c.timezone} · {c.gmtOffset}
                    </div>
                  </div>
                  {c.airportCode && (
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      {c.airportCode}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Timezones */}
          {results.timezones.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                Timezones
              </div>
              {results.timezones.map((tz) => (
                <div
                  key={tz.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Clock className="w-4 h-4 text-accent-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{tz.name}</div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{tz.offset}</span>
                  {tz.abbr && (
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      {tz.abbr}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {totalResults > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 font-medium border-t border-slate-200 dark:border-slate-700"
            >
              View All Results <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
