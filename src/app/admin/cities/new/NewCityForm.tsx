"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Country {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export default function NewCityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCountry = searchParams.get("country") || "";

  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState({
    name: "",
    countryId: preselectedCountry,
    timezone: "",
    gmtOffset: "",
    dstOffset: "",
    airportCode: "",
    aliases: "",
    latitude: "",
    longitude: "",
    population: "",
    displayOrder: "0",
  });

  useEffect(() => {
    fetch("/api/admin/countries")
      .then((r) => r.json())
      .then((data) => setCountries(data.countries || []))
      .catch(() => {});
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const TIMEZONE_PRESETS = [
    { label: "UTC-12:00", value: "-12:00" },
    { label: "UTC-10:00 (Hawaii)", value: "-10:00" },
    { label: "UTC-08:00 (Pacific)", value: "-08:00" },
    { label: "UTC-07:00 (Mountain)", value: "-07:00" },
    { label: "UTC-06:00 (Central)", value: "-06:00" },
    { label: "UTC-05:00 (Eastern)", value: "-05:00" },
    { label: "UTC-03:00 (Brazil)", value: "-03:00" },
    { label: "UTC+00:00 (GMT/London)", value: "+00:00" },
    { label: "UTC+01:00 (Central Europe)", value: "+01:00" },
    { label: "UTC+02:00 (Eastern Europe)", value: "+02:00" },
    { label: "UTC+03:00 (Moscow)", value: "+03:00" },
    { label: "UTC+04:00 (Dubai)", value: "+04:00" },
    { label: "UTC+05:30 (India)", value: "+05:30" },
    { label: "UTC+08:00 (China/Singapore)", value: "+08:00" },
    { label: "UTC+09:00 (Japan/Korea)", value: "+09:00" },
    { label: "UTC+10:00 (Sydney)", value: "+10:00" },
    { label: "UTC+12:00 (Auckland)", value: "+12:00" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.countryId || !form.gmtOffset) {
      toast.error("City name, Country, and GMT Offset are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          countryId: form.countryId,
          timezone: form.timezone || null,
          gmtOffset: form.gmtOffset,
          dstOffset: form.dstOffset || null,
          airportCode: form.airportCode || null,
          aliases: form.aliases ? form.aliases.split(",").map((a) => a.trim()).filter(Boolean) : null,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
          population: form.population ? parseInt(form.population) : null,
          displayOrder: parseInt(form.displayOrder) || 0,
        }),
      });

      if (res.ok) {
        toast.success(`City "${form.name}" created!`);
        router.push("/admin/cities");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create city");
      }
    } catch {
      toast.error("An error occurred");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/cities" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add City</h1>
            <p className="text-sm text-slate-500 mt-1">Add a new city with timezone information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City Name *</label>
            <input type="text" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="input-field" placeholder="e.g. Rome" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Country *</label>
            <select required value={form.countryId} onChange={(e) => handleChange("countryId", e.target.value)} className="input-field">
              <option value="">Select country...</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name} ({c.code})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Timezone (IANA)</label>
            <input type="text" value={form.timezone} onChange={(e) => handleChange("timezone", e.target.value)} className="input-field font-mono text-sm" placeholder="e.g. Europe/Rome" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GMT Offset *</label>
            <select required value={form.gmtOffset} onChange={(e) => handleChange("gmtOffset", e.target.value)} className="input-field font-mono">
              <option value="">Select offset...</option>
              {TIMEZONE_PRESETS.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">DST Offset</label>
            <input type="text" value={form.dstOffset} onChange={(e) => handleChange("dstOffset", e.target.value)} className="input-field font-mono text-sm" placeholder="e.g. +02:00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Airport Code</label>
            <input type="text" value={form.airportCode} onChange={(e) => handleChange("airportCode", e.target.value)} className="input-field font-mono text-sm" placeholder="e.g. FCO" maxLength={4} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Display Order</label>
            <input type="number" value={form.displayOrder} onChange={(e) => handleChange("displayOrder", e.target.value)} className="input-field" min="0" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={(e) => handleChange("latitude", e.target.value)} className="input-field" placeholder="e.g. 41.9028" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={(e) => handleChange("longitude", e.target.value)} className="input-field" placeholder="e.g. 12.4964" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Population</label>
            <input type="number" value={form.population} onChange={(e) => handleChange("population", e.target.value)} className="input-field" placeholder="e.g. 2873000" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Aliases (comma separated)</label>
          <input type="text" value={form.aliases} onChange={(e) => handleChange("aliases", e.target.value)} className="input-field" placeholder="e.g. Roma, Eternal City" />
          <p className="text-xs text-slate-400 mt-1">Alternative names users might search for</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link href="/admin/cities" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Creating..." : "Create City"}
          </button>
        </div>
      </form>
    </div>
  );
}
