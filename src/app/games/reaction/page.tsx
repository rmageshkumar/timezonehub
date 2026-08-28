import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReactionGameClient } from "@/components/ReactionGameClient";
import { Zap, Timer, Gauge } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Reaction Time Test - Measure Your Reflexes Online",
  description:
    "Free online reaction time test. Click when the screen turns green and measure your reflexes in milliseconds. Compare with the human average, beat your personal best, and try the 10s & 30s Rush challenges.",
  keywords: [
    "reaction time test",
    "reflex test",
    "reaction speed test",
    "test your reaction",
    "human benchmark reaction time",
    "click reaction test",
    "reaction timer",
    "reflexes online",
    "clockhive",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/reaction`,
  },
  openGraph: {
    title: "Reaction Time Test | ClockHive",
    description:
      "Measure your reflexes in milliseconds. Click when it turns green and beat your personal best.",
    url: `${BASE_URL}/games/reaction`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reaction Time Test | ClockHive",
    description:
      "Measure your reflexes in milliseconds. Click when it turns green and beat your personal best.",
  },
};

export default function ReactionGamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              <Zap className="w-8 h-8 inline mr-2 text-amber-500" />
              Reaction Time Test
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Wait for the screen to turn green, then click as fast as you can.
              How quick are your reflexes — in milliseconds?
            </p>
          </div>

          <ReactionGameClient />

          {/* SEO content */}
          <section className="mt-12 space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                What is a good reaction time?
              </h2>
              <p>
                The average human reaction time to a visual stimulus is around{" "}
                <strong className="text-slate-800 dark:text-slate-200">250–300 milliseconds</strong>.
                Top athletes often react in 150–200ms. A typical online reaction test
                measures the time between a signal (the green flash) and your click —
                the lower the score, the faster your reflexes.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                How to get a faster reaction time
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Keep your eyes on the box and your finger or mouse ready — don't predict, react.</li>
                <li>Stay relaxed. Tension slows your reflexes.</li>
                <li>Get enough sleep; tiredness noticeably slows response time.</li>
                <li>Practice the 10s and 30s Rush modes to build hand-eye speed.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary-500" /> Game modes
              </h2>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">5 Trials</strong> measures your
                average over five attempts — the most reliable score.{" "}
                <strong className="text-slate-800 dark:text-slate-200">10s Rush</strong> and{" "}
                <strong className="text-slate-800 dark:text-slate-200">30s Rush</strong> challenge you
                to click as many times as possible before time runs out. Your personal bests are
                saved automatically in your browser, no account needed.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary-500" /> Frequently asked questions
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Is the reaction time test accurate?
                  </h3>
                  <p>
                    The timer uses your browser's high-resolution performance clock, accurate to
                    sub-millisecond. For fair results, use a consistent device and avoid background
                    distractions.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Does it work on mobile?
                  </h3>
                  <p>
                    Yes — the game is fully touch-friendly and works great on phones and tablets.
                    Just tap the box when it turns green.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Do I need an account or a backend?
                  </h3>
                  <p>
                    No. Everything runs entirely in your browser. Your personal records are stored
                    locally, and you can share your score with a single tap.
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
