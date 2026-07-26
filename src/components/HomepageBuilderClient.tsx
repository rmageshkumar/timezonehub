"use client";

import { useState } from "react";
import { GripVertical, ToggleLeft, ToggleRight, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Section {
  id: string;
  section: string;
  enabled: boolean;
  order: number;
  config: string | null;
}

const sectionLabels: Record<string, string> = {
  hero_banner: "Hero Banner",
  search: "Search Bar",
  timeline: "World Timeline",
  meeting_planner: "Meeting Planner",
  featured_countries: "Featured Countries",
  news: "News Section",
  ads: "Advertisement Slots",
};

export function HomepageBuilderClient({ initialSections }: { initialSections: Section[] }) {
  const [sections, setSections] = useState(initialSections);
  const [saving, setSaving] = useState(false);

  const toggleSection = async (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (res.ok) toast.success("Homepage layout saved!");
      else toast.error("Failed to save");
    } catch {
      toast.error("Error saving");
    }
    setSaving(false);
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <p className="text-sm text-slate-500 mb-4">
        Toggle sections on or off. Changes take effect immediately on the homepage.
      </p>
      {sections.map((section) => (
        <div
          key={section.id}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
            <div>
              <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                {sectionLabels[section.section] || section.section}
              </div>
              <div className="text-xs text-slate-500 font-mono">{section.section}</div>
            </div>
          </div>
          <button
            onClick={() => toggleSection(section.id)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              section.enabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                section.enabled ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>
      ))}

      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>
    </div>
  );
}
