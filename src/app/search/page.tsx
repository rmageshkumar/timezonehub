import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSearch } from "@/components/HeroSearch";
import { Globe, Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <Search className="w-7 h-7 inline mr-2 text-primary-500" />
              Search Timezones
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Search by city, country, airport code, country code, or timezone abbreviation
            </p>
          </div>
          <HeroSearch />
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Examples: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">SYD</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">IST</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">London</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">IN</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">EST</code></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
