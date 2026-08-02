import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdUnit } from "@/components/AdUnit";
import { AISchedulerClient } from "@/components/AISchedulerClient";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Meeting Scheduler - Find Best Times Across Timezones | ClockHive",
  description: "AI-powered meeting scheduler. Add cities and let AI find the perfect overlapping time, analyzing business hours, lunch breaks, and weekends.",
};

export default function AISchedulerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <Sparkles className="w-7 h-7 inline mr-2 text-primary-500" />
              AI Meeting Scheduler
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Add cities and let AI find the best overlapping meeting time automatically
            </p>
          </div>
          <AISchedulerClient />
          <div className="mt-6">
            <AdUnit placement="footer_banner" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
