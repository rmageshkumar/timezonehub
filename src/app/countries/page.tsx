import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountryCard } from "@/components/CountryCard";
import { Globe, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    where: { isActive: true },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
        take: 10,
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              <Globe className="w-8 h-8 inline mr-2 text-primary-500" />
              All Countries
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Browse {countries.length} countries and their time zones
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
