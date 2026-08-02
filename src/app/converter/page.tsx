import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { TimeConverterClient } from "@/components/TimeConverterClient";
import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Converter - Convert Between Timezones | ClockHive",
  description:
    "Convert times between cities instantly. Click and drag to select time ranges and see equivalent times across all timezones.",
};

export default function ConverterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <ArrowLeftRight className="w-7 h-7 inline mr-2 text-primary-500" />
              Time Converter
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Click and drag on hours to convert times across cities instantly
            </p>
          </div>
          <TimeConverterClient />
          <div className="mt-6">
            <AdUnit placement="footer_banner" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
