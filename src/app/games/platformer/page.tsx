import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PlatformerGameClient } from "@/components/PlatformerGameClient";
import { Flag, Gamepad2, Trophy } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Platform Dash - Free Online Platformer Game | ClockHive",
  description:
    "Play Platform Dash, a free browser platformer game. Run, jump, collect coins, stomp enemies, and reach the flag on desktop or mobile.",
  keywords: [
    "platformer game",
    "mario style game",
    "free online platformer",
    "browser platform game",
    "jump and run game",
    "arcade game",
    "clockhive games",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/platformer`,
  },
  openGraph: {
    title: "Platform Dash - Free Online Platformer | ClockHive",
    description:
      "Run, jump, collect coins, stomp enemies, and reach the flag in this free browser platformer.",
    url: `${BASE_URL}/games/platformer`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Dash - Free Online Platformer | ClockHive",
    description:
      "Run, jump, collect coins, stomp enemies, and reach the flag in this free browser platformer.",
  },
};

export default function PlatformerGamePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              <Gamepad2 className="mr-2 inline h-8 w-8 text-emerald-500" />
              Platform Dash
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              A colorful jump-and-run platformer. Move through the level, grab coins,
              stomp enemies, and reach the red flag.
            </p>
          </div>

          <PlatformerGameClient />

          <section className="mt-12 grid gap-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:grid-cols-2">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Flag className="h-4 w-4 text-emerald-500" />
                How to play
              </h2>
              <p>
                Use A/D or the arrow keys to move, then press Space, W, or Up to
                jump. Collect coins for points, land on enemies to defeat them, and
                reach the flag at the end of the level.
              </p>
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Trophy className="h-4 w-4 text-emerald-500" />
                Score tips
              </h2>
              <p>
                Explore the high platforms for extra coins, keep moving to finish
                faster, and stomp enemies from above for bonus points. Your best score
                is saved in this browser.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
