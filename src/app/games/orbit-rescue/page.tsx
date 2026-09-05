import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { OrbitRescueGameClient } from "@/components/OrbitRescueGameClient";
import { Gem, Rocket, Shield } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Orbit Rescue - Free Space Dodger Game | ClockHive",
  description:
    "Play Orbit Rescue, a free online space dodger game. Pilot your ship, collect crystals, dodge asteroids, and chase a new high score.",
  keywords: [
    "space game",
    "asteroid dodger",
    "free online arcade game",
    "browser space game",
    "spaceship game",
    "clockhive games",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/orbit-rescue`,
  },
  openGraph: {
    title: "Orbit Rescue - Free Space Dodger Game | ClockHive",
    description:
      "Pilot through an asteroid field, collect crystals, and keep your hull intact.",
    url: `${BASE_URL}/games/orbit-rescue`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit Rescue - Free Space Dodger Game | ClockHive",
    description:
      "Pilot through an asteroid field, collect crystals, and keep your hull intact.",
  },
};

export default function OrbitRescuePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden pt-5 pb-10 sm:pt-14 sm:pb-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 text-center sm:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              <Rocket className="mr-2 inline h-8 w-8 text-cyan-500" />
              Orbit Rescue
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Fly through a clock-storm asteroid field, collect glowing time
              crystals, and keep your ship alive as the danger ramps up.
            </p>
          </div>

          <div className="-mx-4 sm:mx-0">
            <OrbitRescueGameClient />
          </div>

          <section className="mt-12 grid gap-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:grid-cols-2">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Shield className="h-4 w-4 text-cyan-500" />
                How to play
              </h2>
              <p>
                Use WASD or the arrow keys to move your ship. Dodge asteroids,
                collect blue crystals, and survive for as long as possible. On
                mobile, use the directional controls below the game.
              </p>
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Gem className="h-4 w-4 text-cyan-500" />
                Score tips
              </h2>
              <p>
                Crystals are worth big points, but crossing the screen for one at
                the wrong time can cost hull damage. Keep a clear lane first, then
                sweep upward or downward when the asteroid pattern opens.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
