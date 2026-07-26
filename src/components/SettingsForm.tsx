"use client";

import { useState } from "react";
import { Save, Globe, Mail, Shield, Bell, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

export function SettingsForm({ initialSettings }: { initialSettings: Setting[] }) {
  const [settings, setSettings] = useState(() => {
    const map: Record<string, string> = {};
    initialSettings.forEach((s) => {
      try { map[s.key] = JSON.parse(s.value); } catch { map[s.key] = s.value; }
    });
    return map;
  });
  const [saving, setSaving] = useState(false);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success("Settings saved!");
      else toast.error("Failed to save");
    } catch {
      toast.error("Error saving settings");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* General */}
      <Section title="General" icon={<Globe className="w-4 h-4" />}>
        <FormField label="Application Name" value={settings.app_name || ""} onChange={(v) => updateSetting("app_name", v)} />
        <FormField label="Description" value={settings.app_description || ""} onChange={(v) => updateSetting("app_description", v)} type="textarea" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Default Timezone" value={settings.timezone || "UTC"} onChange={(v) => updateSetting("timezone", v)} />
          <FormField label="Language" value={settings.language || "en"} onChange={(v) => updateSetting("language", v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Currency" value={settings.currency || "USD"} onChange={(v) => updateSetting("currency", v)} />
          <FormField label="Date Format" value={settings.date_format || "MM/DD/YYYY"} onChange={(v) => updateSetting("date_format", v)} />
        </div>
        <ToggleField label="Maintenance Mode" checked={settings.maintenance_mode === "true"} onChange={(v) => updateSetting("maintenance_mode", v ? "true" : "false")} />
      </Section>

      {/* Pages */}
      <Section title="Policy Pages" icon={<Shield className="w-4 h-4" />}>
        <FormField label="Terms of Service URL" value={settings.terms_url || ""} onChange={(v) => updateSetting("terms_url", v)} />
        <FormField label="Privacy Policy URL" value={settings.privacy_url || ""} onChange={(v) => updateSetting("privacy_url", v)} />
        <FormField label="Cookie Policy URL" value={settings.cookie_url || ""} onChange={(v) => updateSetting("cookie_url", v)} />
      </Section>

      {/* Integrations */}
      <Section title="Integrations" icon={<Bell className="w-4 h-4" />}>
        <FormField label="Google Analytics ID" value={settings.google_analytics_id || ""} onChange={(v) => updateSetting("google_analytics_id", v)} placeholder="G-XXXXXXXXXX" />
        <FormField label="AdSense Publisher ID" value={settings.adsense_publisher_id || ""} onChange={(v) => updateSetting("adsense_publisher_id", v)} placeholder="pub-XXXXXXXXXXXXXXXX" />
        <FormField label="Mailchimp API Key" value={settings.mailchimp_api_key || ""} onChange={(v) => updateSetting("mailchimp_api_key", v)} type="password" />
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {icon} {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="input-field min-h-[60px]" placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" placeholder={placeholder} />
      )}
    </div>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
