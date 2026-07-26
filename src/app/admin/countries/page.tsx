import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCountriesPage() {
  const countries = await prisma.country.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { cities: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Country Management</h1>
          <p className="text-sm text-slate-500 mt-1">{countries.length} countries</p>
        </div>
        <Link href="/admin/countries/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Country
        </Link>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Flag</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Timezones</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Cities</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Active</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 text-2xl">{c.flag}</td>
                <td className="p-4 font-medium text-sm">{c.name}</td>
                <td className="p-4"><span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{c.code}</span></td>
                <td className="p-4 text-sm text-slate-500">{c.timezoneCount}</td>
                <td className="p-4 text-sm text-slate-500">{c._count.cities}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/admin/cities?country=${c.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 inline-flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5" /> Cities
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
