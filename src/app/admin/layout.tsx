"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Globe, MapPin, Megaphone, FileText,
  MessageSquare, Settings, LogOut, Menu, X, ChevronDown, BarChart3,
  Palette, Search, Shield, Clock, Bell, Key, Mail, BookOpen, Home,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarGroups = [
  {
    label: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/countries", label: "Countries", icon: Globe },
      { href: "/admin/cities", label: "Cities", icon: MapPin },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/ads", label: "Advertisements", icon: Megaphone },
      { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
      { href: "/admin/contact", label: "Contact Messages", icon: Mail },
      { href: "/admin/newsletter", label: "Newsletter", icon: Bell },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/homepage", label: "Homepage Builder", icon: Home },
      { href: "/admin/theme", label: "Theme", icon: Palette },
      { href: "/admin/seo", label: "SEO Manager", icon: Search },
      { href: "/admin/api-keys", label: "API Keys", icon: Key },
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/roles", label: "Roles", icon: Shield },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: Clock },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm gradient-text">ClockHive Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-primary-500 transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> View Site
            </Link>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <span className="font-bold gradient-text">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100%-3.5rem)]">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
