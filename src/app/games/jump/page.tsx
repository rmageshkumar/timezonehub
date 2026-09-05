import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JumpGameClient } from "@/components/JumpGameClient";
import { Rocket, Zap, Trophy } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Sky Hopper - Free Jump & Run Game Online | ClockHive",
  description:
    "Play Sky Hopper, a free online jump and run game. Hop over obstacles, grab coins, and set a new high score. Simple, fun, and mobile friendly — no download needed.",
  keywords: [
    "jump game",
    "run game",
    "jump and run",
    "online jumping game",
    "mario style game",
    "platformer online free",
    "arcade jump game",
    "reaction game",
    "clockhive",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/jump`,
  },
  openGraph: {
    title: "Sky Hopper - Jump & Run Game | ClockHive",
    description:
      "Hop over obstacles, grab coins, and beat your high score in this free online jump and run game.",
    url: `${BASE_URL}/games/jump`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Hopper - Jump & Run Game | ClockHive",
    description:
      "Hop over obstacles, grab coins, and beat your high score in this free online jump and run game.",
  },
};

export default function JumpGamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden pt-5 pb-10 sm:pt-14 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              <Rocket className="w-8 h-8 inline mr-2 text-emerald-500" />
              Sky Hopper
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              A fast, simple jump and run game. Tap to hop over obstacles, grab
              coins, and see how far you can go!
            </p>
          </div>

          <div className="-mx-4 sm:mx-0">
            <JumpGameClient />
          </div>

          {/* SEO content */}
          <section className="mt-12 space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                How to play Sky Hopper
              </h2>
              <p>
                Sky Hopper is an endless jump and run game. Your character runs
                automatically — press <strong className="text-slate-800 dark:text-slate-200">Space</strong>,{" "}
                <strong className="text-slate-800 dark:text-slate-200">↑</strong>, or{" "}
                <strong className="text-slate-800 dark:text-slate-200">tap the screen</strong> to
                jump over spikes and stone blocks. Double-tap to double jump. Collect golden
                coins for bonus points, and survive as long as you can — the game gets faster
                the further you run.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Tips for a high score
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Time your jumps — wait until the obstacle is close before hopping.</li>
                <li>Use double jump to clear tall blocks and reach coin arcs.</li>
                <li>Chase the coins: each one is worth 50 bonus points.</li>
                <li>Stay calm as the speed ramps up — rhythm beats panic.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" /> Frequently asked questions
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Does Sky Hopper work on mobile?
                  </h3>
                  <p>
                    Yes — tap anywhere on the game to jump. It is fully touch-friendly and
                    works great on phones and tablets.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Do I need an account?
                  </h3>
                  <p>
                    No. Your personal best is saved automatically in your browser, and you can
                    share your score with one tap.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Is it free to play?
                  </h3>
                  <p>
                    Yes — Sky Hopper is completely free, with no downloads and no signup.
                    It runs entirely in your browser.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
