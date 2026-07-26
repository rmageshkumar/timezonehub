"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Save, User, Lock, Globe, Bell, Shield } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  // Profile form
  const [name, setName] = useState(session?.user?.name || "");
  const [profileImage, setProfileImage] = useState((session?.user as any)?.image || "");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences
  const [defaultTimezone, setDefaultTimezone] = useState(
    typeof window !== "undefined" ? localStorage.getItem("user_timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone : ""
  );
  const [dateFormat, setDateFormat] = useState(
    typeof window !== "undefined" ? localStorage.getItem("user_dateformat") || "12h" : "12h"
  );

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: profileImage || null }),
      });
      if (res.ok) {
        await update();
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch { toast.error("An error occurred"); }
    setSaving(false);
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.success("Password changed!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to change password");
      }
    } catch { toast.error("An error occurred"); }
    setSaving(false);
  };

  const handlePreferencesSave = () => {
    localStorage.setItem("user_timezone", defaultTimezone);
    localStorage.setItem("user_dateformat", dateFormat);
    toast.success("Preferences saved!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your account</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 glass rounded-xl mb-6">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                  {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{session.user?.name || "User"}</h3>
                  <p className="text-sm text-slate-500">{session.user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Profile Image URL</label>
                <input type="url" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} className="input-field" placeholder="https://example.com/avatar.jpg" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleProfileSave} disabled={saving} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" />
              </div>
              <div className="flex justify-end">
                <button onClick={handlePasswordSave} disabled={saving} className="btn-primary flex items-center gap-2">
                  <Lock className="w-4 h-4" />{saving ? "Saving..." : "Change Password"}
                </button>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Default Timezone</label>
                <select value={defaultTimezone} onChange={(e) => setDefaultTimezone(e.target.value)} className="input-field">
                  {Intl.supportedValuesOf?.("timeZone")?.map((tz: string) => (
                    <option key={tz} value={tz}>{tz}</option>
                  )) || <option value={defaultTimezone}>{defaultTimezone}</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Time Format</label>
                <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="input-field">
                  <option value="12h">12-hour (2:30 PM)</option>
                  <option value="24h">24-hour (14:30)</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button onClick={handlePreferencesSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
