"use client";

import { useState } from "react";
import { Palette, Type, Upload, Save } from "lucide-react";
import toast from "react-hot-toast";

interface ThemeConfig {
  id: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  footerText: string | null;
  customCss: string | null;
}

export function ThemeEditor({ initialTheme }: { initialTheme: ThemeConfig | null }) {
  const [theme, setTheme] = useState<ThemeConfig>(
    initialTheme || {
      id: "default",
      primaryColor: "#3b82f6",
      accentColor: "#d946ef",
      fontFamily: "Inter",
      borderRadius: "0.5rem",
      logoUrl: null,
      faviconUrl: null,
      footerText: null,
      customCss: null,
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        toast.success("Theme updated successfully!");
      } else {
        toast.error("Failed to update theme");
      }
    } catch {
      toast.error("An error occurred");
    }
    setSaving(false);
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      {/* Primary & Accent Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Palette className="w-4 h-4 text-primary-500" /> Primary Color
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="input-field font-mono flex-1"
            />
          </div>
          <div className="mt-2 h-10 rounded-lg" style={{ backgroundColor: theme.primaryColor }} />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Palette className="w-4 h-4 text-accent-500" /> Accent Color
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
              className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer"
            />
            <input
              type="text"
              value={theme.accentColor}
              onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
              className="input-field font-mono flex-1"
            />
          </div>
          <div className="mt-2 h-10 rounded-lg" style={{ backgroundColor: theme.accentColor }} />
        </div>
      </div>

      {/* Font & Border Radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Type className="w-4 h-4" /> Font Family
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
            className="input-field"
          >
            <option value="Inter">Inter</option>
            <option value="system-ui">System UI</option>
            <option value="Georgia">Georgia</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Border Radius
          </label>
          <select
            value={theme.borderRadius}
            onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
            className="input-field"
          >
            <option value="0rem">None</option>
            <option value="0.25rem">Small</option>
            <option value="0.5rem">Medium</option>
            <option value="0.75rem">Large</option>
            <option value="1rem">Extra Large</option>
          </select>
        </div>
      </div>

      {/* Logo & Favicon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Upload className="w-4 h-4" /> Logo URL
          </label>
          <input
            type="text"
            value={theme.logoUrl || ""}
            onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
            className="input-field"
            placeholder="https://example.com/logo.png"
          />
          {theme.logoUrl && (
            <img src={theme.logoUrl} alt="Logo preview" className="mt-2 h-8 object-contain" />
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Upload className="w-4 h-4" /> Favicon URL
          </label>
          <input
            type="text"
            value={theme.faviconUrl || ""}
            onChange={(e) => setTheme({ ...theme, faviconUrl: e.target.value })}
            className="input-field"
            placeholder="https://example.com/favicon.ico"
          />
        </div>
      </div>

      {/* Footer Text */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
          Footer Text
        </label>
        <textarea
          value={theme.footerText || ""}
          onChange={(e) => setTheme({ ...theme, footerText: e.target.value })}
          className="input-field min-h-[80px]"
          placeholder="© 2024 ClockHive. All rights reserved."
        />
      </div>

      {/* Custom CSS */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
          Custom CSS
        </label>
        <textarea
          value={theme.customCss || ""}
          onChange={(e) => setTheme({ ...theme, customCss: e.target.value })}
          className="input-field min-h-[120px] font-mono text-sm"
          placeholder="/* Custom CSS rules */"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
