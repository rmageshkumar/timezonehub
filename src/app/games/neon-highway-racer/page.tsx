import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { NeonHighwayRacerClient } from "@/components/NeonHighwayRacerClient";
import { Car, Fuel, ShieldAlert, Trophy } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Neon Highway Racer - Free Online Car Racing Game | ClockHive",
  description:
    "Play Neon Highway Racer, a free browser car racing game with traffic, police chases, nitro boost, fuel, upgrades, near-miss combos, AI rivals, and mobile controls.",
  keywords: [
    "car racing game",
    "highway racing game",
    "traffic rush game",
    "police chase game",
    "nitro racing game",
    "html5 canvas racing game",
    "free online racing game",
    "clockhive games",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/neon-highway-racer`,
  },
  openGraph: {
    title: "Neon Highway Racer - Free Online Racing Game | ClockHive",
    description:
      "Dodge traffic, outrun police, collect fuel and nitro, and climb the live race leaderboard.",
    url: `${BASE_URL}/games/neon-highway-racer`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neon Highway Racer - Free Online Racing Game | ClockHive",
    description:
      "Dodge traffic, outrun police, collect fuel and nitro, and climb the live race leaderboard.",
  },
};

export default function NeonHighwayRacerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              <Car className="mr-2 inline h-8 w-8 text-cyan-500" />
              Neon Highway Racer
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
              A fast top-down highway racer with traffic, police AI, nitro,
              fuel, near-miss combos, upgrades, and a live rival leaderboard.
            </p>
          </div>

          <NeonHighwayRacerClient />

          <section className="mt-12 grid gap-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:grid-cols-3">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <ShieldAlert className="h-4 w-4 text-cyan-500" />
                Survive the chase
              </h2>
              <p>
                Traffic density and wanted level rise as your distance grows.
                Police cars steer toward your position, while obstacles and lane
                changes force quick reactions.
              </p>
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Fuel className="h-4 w-4 text-cyan-500" />
                Manage resources
              </h2>
              <p>
                Collect coins, fuel, repairs, and nitro pickups. Boosting makes
                risky overtakes easier, but it drains nitro and fuel faster.
              </p>
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Trophy className="h-4 w-4 text-cyan-500" />
                Score big
              </h2>
              <p>
                Thread close passes for near-miss bonuses and combo
                multipliers. After crashes, choose one of three upgrades to keep
                the run alive until the third hit ends it.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
