"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const PLACEMENTS = [
  { value: "header_banner", label: "Header Banner (728x90)" },
  { value: "sidebar_300x250", label: "Sidebar 300x250" },
  { value: "sidebar_300x600", label: "Sidebar 300x600" },
  { value: "between_cards", label: "Between City Cards (Native)" },
  { value: "footer_banner", label: "Footer Banner" },
  { value: "mobile_sticky", label: "Mobile Sticky (320x50)" },
  { value: "full_width_timeline", label: "Full Width After Timeline" },
];

const AD_TYPES = [
  { value: "html", label: "Custom HTML" },
  { value: "image", label: "Image Banner" },
  { value: "javascript", label: "JavaScript Tag" },
  { value: "google_adsense", label: "Google AdSense" },
  { value: "affiliate", label: "Affiliate Code" },
  { value: "direct_html", label: "Direct HTML Ad" },
  { value: "custom_image", label: "Custom Image Ad" },
];

export default function NewAdPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "html",
    placement: "header_banner",
    content: "",
    imageUrl: "",
    linkUrl: "",
    priority: "0",
    weight: "1",
    status: "active",
    startDate: "",
    endDate: "",
    targetCountries: "",
    targetDevices: "",
    targetHoursStart: "",
    targetHoursEnd: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          placement: form.placement,
          content: form.type === "image" || form.type === "custom_image" ? null : form.content,
          imageUrl: form.type === "image" || form.type === "custom_image" ? form.imageUrl : null,
          linkUrl: form.linkUrl || null,
          priority: parseInt(form.priority) || 0,
          weight: parseInt(form.weight) || 1,
          status: form.status,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          targetCountries: form.targetCountries || null,
          targetDevices: form.targetDevices || null,
          targetHours: form.targetHoursStart && form.targetHoursEnd
            ? JSON.stringify({ start: form.targetHoursStart, end: form.targetHoursEnd })
            : null,
        }),
      });

      if (res.ok) {
        toast.success("Advertisement created!");
        router.push("/admin/ads");
        router.refresh();
      } else {
        toast.error("Failed to create advertisement");
      }
    } catch {
      toast.error("An error occurred");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/ads" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">New Advertisement</h1>
            <p className="text-sm text-slate-500 mt-1">Create a new ad campaign</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPreview(!preview)} className="btn-secondary flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4" /> {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Preview: {form.name || "Untitled"}</h3>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex items-center justify-center min-h-[120px]">
            {(form.type === "image" || form.type === "custom_image") && form.imageUrl ? (
              <img src={form.imageUrl} alt="Ad preview" className="max-w-full max-h-40 rounded" />
            ) : form.content ? (
              <div dangerouslySetInnerHTML={{ __html: form.content }} />
            ) : (
              <span className="text-slate-400 text-sm">No content to preview</span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Type: <span className="font-mono text-slate-700 dark:text-slate-300">{form.type}</span></div>
            <div>Placement: <span className="font-mono text-slate-700 dark:text-slate-300">{form.placement}</span></div>
            <div>Priority: {form.priority}</div>
            <div>Weight: {form.weight}</div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ad Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="input-field"
                placeholder="My Banner Ad"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ad Type *</label>
                <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className="input-field">
                  {AD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Placement *</label>
                <select value={form.placement} onChange={(e) => handleChange("placement", e.target.value)} className="input-field">
                  {PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="input-field">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                <input type="number" value={form.priority} onChange={(e) => handleChange("priority", e.target.value)} className="input-field" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Weight</label>
                <input type="number" value={form.weight} onChange={(e) => handleChange("weight", e.target.value)} className="input-field" min="1" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Ad Content</h3>

            {(form.type === "image" || form.type === "custom_image") ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Image URL *</label>
                  <input type="url" value={form.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} className="input-field" placeholder="https://example.com/banner.png" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ad Code / HTML *</label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="<div>Your ad code here...</div>"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Click-through URL (optional)</label>
              <input type="url" value={form.linkUrl} onChange={(e) => handleChange("linkUrl", e.target.value)} className="input-field" placeholder="https://example.com/landing" />
            </div>
          </div>

          {/* Targeting */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Targeting (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Country Codes</label>
                <input type="text" value={form.targetCountries} onChange={(e) => handleChange("targetCountries", e.target.value)} className="input-field" placeholder="US,GB,IN (comma separated)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Device Targeting</label>
                <input type="text" value={form.targetDevices} onChange={(e) => handleChange("targetDevices", e.target.value)} className="input-field" placeholder="desktop,mobile,tablet" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
                <input type="datetime-local" value={form.startDate} onChange={(e) => handleChange("startDate", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
                <input type="datetime-local" value={form.endDate} onChange={(e) => handleChange("endDate", e.target.value)} className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Show From (Time)</label>
                <input type="time" value={form.targetHoursStart} onChange={(e) => handleChange("targetHoursStart", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Show Until (Time)</label>
                <input type="time" value={form.targetHoursEnd} onChange={(e) => handleChange("targetHoursEnd", e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3">
            <Link href="/admin/ads" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Create Advertisement"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
