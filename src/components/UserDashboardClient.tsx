"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  User, Heart, Clock, Search, MapPin, LogOut, Settings,
  Star, Globe, Calendar, Trash2, BarChart3, ArrowRight,
} from "lucide-react";
import { LiveTime } from "@/components/LiveTime";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface DashboardProps {
  user: any;
  favorites: any[];
  recentSearches: any[];
  savedComparisons: any[];
  loginHistory: any[];
}

export function UserDashboardClient({
  user,
  favorites,
  recentSearches,
  savedComparisons,
  loginHistory,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("favorites");

  const tabs = [
    { id: "favorites", label: "Favorites", icon: Heart, count: favorites.length },
    { id: "recent", label: "Recent Searches", icon: Search, count: recentSearches.length },
    { id: "comparisons", label: "Saved Comparisons", icon: BarChart3, count: savedComparisons.length },
    { id: "activity", label: "Activity", icon: Clock, count: loginHistory.length },
  ];

  const removeFavorite = async (id: string) => {
    try {
      await fetch(`/api/user/favorites?id=${id}`, { method: "DELETE" });
      toast.success("Removed from favorites");
      // Reload to refresh data
      window.location.reload();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {user.name || "User"}
            </h1>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs bg-primary-50 dark:bg-primary-950 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                {user.role === "premium" ? "⭐ Premium" : "Free Plan"}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                Joined {user.createdAt ? formatDate(user.createdAt) : "recently"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/settings" className="btn-secondary text-sm flex items-center gap-1.5">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary text-sm flex items-center gap-1.5 text-red-500">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Heart, label: "Favorites", value: favorites.length, color: "text-red-500 bg-red-50 dark:bg-red-950" },
          { icon: Search, label: "Recent Searches", value: recentSearches.length, color: "text-blue-500 bg-blue-50 dark:bg-blue-950" },
          { icon: BarChart3, label: "Comparisons", value: savedComparisons.length, color: "text-purple-500 bg-purple-50 dark:bg-purple-950" },
          { icon: Globe, label: "Countries Explored", value: Array.from(new Set(favorites.map((f) => f.city?.country?.code))).length, color: "text-green-500 bg-green-50 dark:bg-green-950" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="text-xs bg-slate-100 dark:bg-slate-600 px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Favorites */}
        {activeTab === "favorites" && (
          favorites.length === 0 ? (
            <EmptyState icon={Heart} title="No favorites yet" description="Star cities from their page to save them here" action={{ href: "/countries", label: "Browse Countries" }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favorites.map((fav) => (
                <div key={fav.id} className="glass rounded-xl p-4 flex items-center justify-between card-hover">
                  <Link href={`/city/${fav.city.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{fav.city.country.flag}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{fav.city.name}</div>
                      <div className="text-xs text-slate-500">{fav.city.country.name} · {fav.city.gmtOffset}</div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    <LiveTime timezone={fav.city.timezone} />
                    <button onClick={() => removeFavorite(fav.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Recent Searches */}
        {activeTab === "recent" && (
          recentSearches.length === 0 ? (
            <EmptyState icon={Search} title="No recent searches" description="Search for cities or countries to see them here" action={{ href: "/search", label: "Search" }} />
          ) : (
            <div className="space-y-2">
              {recentSearches.map((s) => (
                <Link key={s.id} href={s.cityId ? `/city/${s.cityId}` : `/search?q=${encodeURIComponent(s.query)}`}
                  className="glass rounded-xl p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{s.query}</span>
                  <span className="text-xs text-slate-400 ml-auto">{formatDate(s.createdAt)}</span>
                </Link>
              ))}
            </div>
          )
        )}

        {/* Saved Comparisons */}
        {activeTab === "comparisons" && (
          savedComparisons.length === 0 ? (
            <EmptyState icon={BarChart3} title="No saved comparisons" description="Compare cities and save the comparison to access it later" action={{ href: "/compare", label: "Compare Cities" }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedComparisons.map((comp) => {
                const cityIds = JSON.parse(comp.cities || "[]");
                return (
                  <Link key={comp.id} href={`/compare`}
                    className="glass rounded-xl p-4 card-hover">
                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-2">{comp.name}</div>
                    <div className="text-xs text-slate-500">{cityIds.length} cities</div>
                    <div className="text-xs text-slate-400 mt-1">Last updated {formatDate(comp.updatedAt)}</div>
                  </Link>
                );
              })}
            </div>
          )
        )}

        {/* Activity */}
        {activeTab === "activity" && (
          <div className="space-y-2">
            {loginHistory.map((log) => (
              <div key={log.id} className="glass rounded-xl p-3 flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">Login</span>
                {log.device && <span className="text-xs text-slate-400">{log.device} · {log.browser}</span>}
                <span className="text-xs text-slate-400 ml-auto">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }: {
  icon: any; title: string; description: string; action?: { href: string; label: string };
}) {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <Icon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      {action && (
        <Link href={action.href} className="btn-primary inline-flex items-center gap-2 text-sm">
          {action.label} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
