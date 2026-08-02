import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrumPokerClient } from "@/components/ScrumPokerClient";
import { Play } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scrum Poker - Agile Planning Made Easy | ClockHive",
  description: "Free online Scrum Poker / Planning Poker tool. Create rooms, invite your team, and estimate stories with Fibonacci cards.",
};

export default function ScrumPokerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              <Play className="w-7 h-7 inline mr-2 text-primary-500" />
              Scrum Poker
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Agile estimation made simple. Create a room, invite your team, vote on stories.
            </p>
          </div>
          <ScrumPokerClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
