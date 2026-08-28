import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MergeGameClient } from "@/components/MergeGameClient";
import { Puzzle, Brain, Trophy } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "2048 Merge Game - Play Free Number Puzzle Online",
  description:
    "Free 2048-style number merge puzzle game. Slide tiles to combine matching numbers and reach 2048. Challenge yourself with this addictive brain teaser — no download needed.",
  keywords: [
    "2048 game",
    "number merge game",
    "slide puzzle",
    "2048 online",
    "number puzzle",
    "brain training game",
    "merge tiles",
    "2048 free",
    "clockhive",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/merge`,
  },
  openGraph: {
    title: "2048 Merge Game | ClockHive",
    description:
      "Slide tiles to combine matching numbers and reach 2048. Can you master this addictive puzzle?",
    url: `${BASE_URL}/games/merge`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2048 Merge Game | ClockHive",
    description:
      "Slide tiles to combine matching numbers and reach 2048. Can you master this addictive puzzle?",
  },
};

export default function MergeGamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              <Puzzle className="w-8 h-8 inline mr-2 text-primary-500" />
              2048 Merge Game
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Slide tiles to combine matching numbers. Can you reach 2048? Use arrow keys or swipe to play.
            </p>
          </div>

          <MergeGameClient />

          {/* SEO content */}
          <section className="mt-12 space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                How to play 2048
              </h2>
              <p>
                Use <strong className="text-slate-800 dark:text-slate-200">arrow keys</strong> or{" "}
                <strong className="text-slate-800 dark:text-slate-200">swipe</strong> to move all tiles in one direction.
                When two tiles with the same number collide, they merge into one with double the value.
                Your goal is to create a tile with the number <strong className="text-slate-800 dark:text-slate-200">2048</strong>.
                The game ends when the board is full and no moves are possible.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary-500" /> Tips & strategies
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Keep your highest number tile in a corner — this gives you more space to work.</li>
                <li>Build along one edge to maintain organization and prevent blocking.</li>
                <li>Plan ahead — think about how each move affects the whole board.</li>
                <li>Don't chase 2048 too early — focus on maintaining a clean board structure.</li>
                <li>Practice regularly to improve your pattern recognition and speed.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary-500" /> Frequently asked questions
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Is 2048 good for your brain?
                  </h3>
                  <p>
                    Yes! 2048 helps improve spatial reasoning, pattern recognition, and strategic thinking.
                    It's a great way to keep your mind sharp while having fun.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Can I play on mobile?
                  </h3>
                  <p>
                    Absolutely — the game supports touch gestures, so you can swipe to move tiles on any
                    smartphone or tablet. It's fully responsive and optimized for all screen sizes.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    What's the highest possible score?
                  </h3>
                  <p>
                    Theoretically, you can reach beyond 2048 — skilled players regularly achieve 4096, 8192,
                    and even higher. The game continues until no moves are possible, so keep pushing your limits!
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