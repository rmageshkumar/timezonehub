"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const CONTINENTS = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

const FLAG_EMOJIS: Record<string, string> = {
  "🇺🇸": "US", "🇬🇧": "GB", "🇮🇳": "IN", "🇦🇺": "AU", "🇯🇵": "JP",
  "🇩🇪": "DE", "🇫🇷": "FR", "🇨🇦": "CA", "🇨🇳": "CN", "🇧🇷": "BR",
  "🇸🇬": "SG", "🇦🇪": "AE", "🇷🇺": "RU", "🇰🇷": "KR", "🇲🇽": "MX",
  "🇮🇹": "IT", "🇪🇸": "ES", "🇳🇱": "NL", "🇨🇭": "CH", "🇸🇪": "SE",
  "🇳🇴": "NO", "🇩🇰": "DK", "🇫🇮": "FI", "🇵🇹": "PT", "🇵🇱": "PL",
  "🇹🇷": "TR", "🇿🇦": "ZA", "🇪🇬": "EG", "🇳🇬": "NG", "🇰🇪": "KE",
  "🇹🇭": "TH", "🇻🇳": "VN", "🇮🇩": "ID", "🇲🇾": "MY", "🇵🇭": "PH",
  "🇳🇿": "NZ", "🇦🇷": "AR", "🇨🇱": "CL", "🇨🇴": "CO", "🇵🇪": "PE",
  "🇸🇦": "SA", "🇶🇦": "QA", "🇮🇱": "IL", "🇺🇦": "UA", "🇮🇪": "IE",
  "🇦🇹": "AT", "🇧🇪": "BE", "🇬🇷": "GR", "🇨🇿": "CZ", "🇭🇺": "HU",
  "🇷🇴": "RO", "🇧🇬": "BG", "🇭🇷": "HR", "🇵🇰": "PK", "🇧🇩": "BD",
};

export default function NewCountryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    flag: "🌍",
    capital: "",
    continent: "",
    population: "",
    timezoneCount: "1",
    displayOrder: "0",
    dstRules: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-detect flag from emoji selection
      if (field === "flag" && value.length >= 2) {
        // Try to find code from flag
        const code = FLAG_EMOJIS[value];
        if (code && !prev.code) updated.code = code;
      }
      // Auto-capitalize code
      if (field === "code") updated.code = value.toUpperCase();
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Name and Code are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          flag: form.flag,
          capital: form.capital || null,
          continent: form.continent || null,
          population: form.population ? parseInt(form.population) : null,
          timezoneCount: parseInt(form.timezoneCount) || 1,
          displayOrder: parseInt(form.displayOrder) || 0,
          dstRules: form.dstRules || null,
        }),
      });

      if (res.ok) {
        toast.success(`Country "${form.name}" created!`);
        router.push("/admin/countries");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create country");
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
          <Link href="/admin/countries" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add Country</h1>
            <p className="text-sm text-slate-500 mt-1">Add a new country with its timezone information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Country Name *</label>
            <input type="text" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="input-field" placeholder="e.g. Italy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Country Code * (ISO 2-letter)</label>
            <input type="text" required value={form.code} onChange={(e) => handleChange("code", e.target.value)} className="input-field font-mono" placeholder="e.g. IT" maxLength={2} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Flag Emoji</label>
          <div className="flex gap-2 items-center">
            <input type="text" value={form.flag} onChange={(e) => handleChange("flag", e.target.value)} className="input-field w-20 text-center text-2xl" maxLength={4} />
            <span className="text-xs text-slate-400">Paste an emoji flag or use 🇮🇹 🇫🇷 🇩🇪 etc.</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(FLAG_EMOJIS).map(([emoji, code]) => (
              <button key={code} type="button" onClick={() => handleChange("flag", emoji)}
                className={`text-xl p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${form.flag === emoji ? "bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-500" : ""}`}>
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Capital City</label>
            <input type="text" value={form.capital} onChange={(e) => handleChange("capital", e.target.value)} className="input-field" placeholder="e.g. Rome" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Continent</label>
            <select value={form.continent} onChange={(e) => handleChange("continent", e.target.value)} className="input-field">
              <option value="">Select continent...</option>
              {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Population</label>
            <input type="number" value={form.population} onChange={(e) => handleChange("population", e.target.value)} className="input-field" placeholder="e.g. 59000000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"># of Timezones</label>
            <input type="number" value={form.timezoneCount} onChange={(e) => handleChange("timezoneCount", e.target.value)} className="input-field" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Display Order</label>
            <input type="number" value={form.displayOrder} onChange={(e) => handleChange("displayOrder", e.target.value)} className="input-field" min="0" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">DST Rules (JSON, optional)</label>
          <textarea rows={3} value={form.dstRules} onChange={(e) => handleChange("dstRules", e.target.value)} className="input-field font-mono text-sm" placeholder='{"start":"last Sunday of March","end":"last Sunday of October"}' />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link href="/admin/countries" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Creating..." : "Create Country"}
          </button>
        </div>
      </form>
    </div>
  );
}
