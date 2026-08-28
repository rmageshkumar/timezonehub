import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WordGameClient } from "@/components/WordGameClient";
import { Brain, Target, Trophy } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Daily Word Guess - Free Word Puzzle Game",
  description:
    "Free daily word puzzle game. Guess the hidden 5-letter word in 6 tries. A new challenge every day with color-coded hints. Test your vocabulary and word skills!",
  keywords: [
    "word guess game",
    "daily word puzzle",
    "wordle style game",
    "5 letter word game",
    "word puzzle",
    "vocabulary game",
    "daily challenge",
    "guess the word",
    "clockhive",
  ],
  alternates: {
    canonical: `${BASE_URL}/games/word`,
  },
  openGraph: {
    title: "Daily Word Guess | ClockHive",
    description:
      "Guess the hidden 5-letter word in 6 tries. A new challenge every day with color-coded hints.",
    url: `${BASE_URL}/games/word`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Word Guess | ClockHive",
    description:
      "Guess the hidden 5-letter word in 6 tries. A new challenge every day with color-coded hints.",
  },
};

export default function WordGamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              <Brain className="w-8 h-8 inline mr-2 text-accent-500" />
              Daily Word Guess
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Guess the hidden 5-letter word in 6 tries. A new challenge every day at midnight.
              Green = correct letter, Yellow = wrong position, Gray = not in word.
            </p>
          </div>

          <WordGameClient />

          {/* SEO content */}
          <section className="mt-12 space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                How to play
              </h2>
              <p>
                Type a <strong className="text-slate-800 dark:text-slate-200">5-letter word</strong> and press Enter to submit your guess.
                After each guess, the tiles will change color to show how close you were:
                <strong className="text-slate-800 dark:text-slate-200">Green</strong> means the letter is correct,
                <strong className="text-slate-800 dark:text-slate-200">Yellow</strong> means it's in the word but wrong position,
                and <strong className="text-slate-800 dark:text-slate-200">Gray</strong> means it's not in the word at all.
                You have <strong className="text-slate-800 dark:text-slate-200">6 attempts</strong> to guess the word.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-500" /> Tips for winning
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Start with words that have common vowels and consonants (like "raise", "slate", or "crane").</li>
                <li>Use your first few guesses to eliminate letters and narrow down possibilities.</li>
                <li>Pay attention to letter positions — a yellow letter might be correct elsewhere.</li>
                <li>Avoid repeating letters in early guesses to test more unique letters.</li>
                <li>Think about common word patterns and letter combinations in English.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent-500" /> Frequently asked questions
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    When does the new word appear?
                  </h3>
                  <p>
                    A new word appears every day at midnight UTC. Everyone gets the same word each day,
                    so you can compare your results with friends.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    What words are used?
                  </h3>
                  <p>
                    We use common 5-letter words from the English dictionary. The words are selected to be
                    familiar to most players while still providing a fun challenge.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    Can I play on mobile?
                  </h3>
                  <p>
                    Yes! The game is fully responsive and works great on phones and tablets. You can use
                    the on-screen keyboard or your device's keyboard to type your guesses.
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