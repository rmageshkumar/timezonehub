import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCitiesPage({ searchParams }: { searchParams: { country?: string; q?: string } }) {
  const where: any = {};
  if (searchParams.country) where.countryId = searchParams.country;
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q } },
      { timezone: { contains: searchParams.q } },
      { airportCode: { contains: searchParams.q.toUpperCase() } },
    ];
  }

  const cities = await prisma.city.findMany({
    where,
    include: { country: true },
    orderBy: { name: "asc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">City Management</h1>
          <p className="text-sm text-slate-500 mt-1">{cities.length} cities</p>
        </div>
        <Link href="/admin/cities/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add City
        </Link>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">City</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Country</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Timezone</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">GMT</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Airport</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Active</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-medium text-sm">{city.name}</td>
                <td className="p-4 text-sm">
                  <span className="mr-1.5">{city.country.flag}</span>
                  {city.country.name}
                </td>
                <td className="p-4 text-sm font-mono text-slate-500 text-xs">{city.timezone}</td>
                <td className="p-4 text-sm text-slate-500">{city.gmtOffset}</td>
                <td className="p-4">
                  {city.airportCode && (
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{city.airportCode}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${city.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {city.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
