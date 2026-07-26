import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const ads = await prisma.advertisement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const placements = [
    "header_banner", "sidebar_300x250", "sidebar_300x600",
    "between_cards", "footer_banner", "mobile_sticky", "full_width_timeline"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Advertisements</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all ad placements and campaigns</p>
        </div>
        <Link href="/admin/ads/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Advertisement
        </Link>
      </div>

      {/* Placement Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {placements.map((p) => {
          const active = ads.filter(a => a.placement === p && a.status === "active").length;
          return (
            <div key={p} className="glass rounded-xl p-3 text-center">
              <div className="text-xs text-slate-500 mb-1 capitalize">{p.replace(/_/g, " ")}</div>
              <div className={`text-lg font-bold ${active > 0 ? "text-green-500" : "text-slate-400"}`}>
                {active}
              </div>
              <div className="text-xs text-slate-400">active</div>
            </div>
          );
        })}
      </div>

      {/* Ads Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Placement</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Impressions</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Clicks</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{ad.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {ad.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-slate-500 capitalize">{ad.placement.replace(/_/g, " ")}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      ad.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                      ad.status === "paused" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}>
                      {ad.status === "active" ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                      {ad.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{ad.impressions.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{ad.clicks.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link href={`/admin/ads/${ad.id}/edit`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
