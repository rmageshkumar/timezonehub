import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { CompareClient } from "@/components/CompareClient";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <BarChart3 className="w-7 h-7 inline mr-2 text-primary-500" />
              Compare Timezones
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Compare times across cities side by side
            </p>
          </div>
          <CompareClient />
          <div className="mt-6">
            <AdUnit placement="footer_banner" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
