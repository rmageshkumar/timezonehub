import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Zap, Puzzle, Brain, Clock, Rocket, Gamepad2, Orbit, Car } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  title: "Free Online Games - Play Brain Training Games | ClockHive",
  description:
    "Play free online brain training games at ClockHive. Test your reaction time, challenge your mind with word puzzles, and master the 2048 number merge game. No download required.",
  keywords: [
    "free online games",
    "brain training games",
    "reaction time test",
    "word puzzle games",
    "2048 game",
    "number merge game",
    "mind games",
    "cognitive games",
    "clockhive",
  ],
  alternates: {
    canonical: `${BASE_URL}/games`,
  },
  openGraph: {
    title: "Free Online Games | ClockHive",
    description:
      "Play free brain training games - reaction time test, word puzzles, and 2048 merge game.",
    url: `${BASE_URL}/games`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Games | ClockHive",
    description:
      "Play free brain training games - reaction time test, word puzzles, and 2048 merge game.",
  },
};

const games = [
  {
    title: "Reaction Time Test",
    description: "Measure your reflexes in milliseconds. Click when the screen turns green and beat your personal best.",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    href: "/games/reaction",
    difficulty: "Easy",
    replay: "⭐⭐⭐⭐⭐",
  },
  {
    title: "2048 Merge Game",
    description: "Slide tiles to combine matching numbers. Can you reach 2048? A classic brain teaser.",
    icon: Puzzle,
    color: "from-primary-500 to-accent-500",
    href: "/games/merge",
    difficulty: "Medium",
    replay: "⭐⭐⭐⭐⭐",
  },
  {
    title: "Daily Word Guess",
    description: "Guess the hidden 5-letter word in 6 tries. A new challenge every day with color-coded hints.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    href: "/games/word",
    difficulty: "Medium",
    replay: "⭐⭐⭐⭐⭐",
  },
  {
    title: "Orbit Rescue",
    description: "Pilot through an asteroid field, collect glowing crystals, and protect your ship's hull.",
    icon: Orbit,
    color: "from-cyan-500 to-indigo-500",
    href: "/games/orbit-rescue",
    difficulty: "Medium",
    replay: "⭐⭐⭐⭐⭐",
  },
  {
    title: "Neon Highway Racer",
    description: "Dodge traffic, outrun police, collect nitro, and build near-miss combos in a neon city chase.",
    icon: Car,
    color: "from-cyan-500 to-fuchsia-500",
    href: "/games/neon-highway-racer",
    difficulty: "Hard",
    replay: "⭐⭐⭐⭐⭐",
  },
  {
    title: "Platform Dash",
    description: "Run, jump, collect coins, stomp enemies, and reach the flag in a colorful platformer level.",
    icon: Gamepad2,
    color: "from-sky-500 to-emerald-500",
    href: "/games/platformer",
    difficulty: "Medium",
    replay: "⭐⭐⭐⭐⭐",
  },
  {
    title: "Sky Hopper",
    description: "A fast jump and run game. Tap to hop over obstacles, grab coins, and chase a new high score.",
    icon: Rocket,
    color: "from-emerald-500 to-teal-500",
    href: "/games/jump",
    difficulty: "Easy",
    replay: "⭐⭐⭐⭐⭐",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              <Clock className="w-8 h-8 inline mr-2 text-primary-500" />
              Free Online Games
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Challenge your mind with our collection of brain training games. Test your reflexes,
              improve your vocabulary, and sharpen your problem-solving skills - all for free!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.href}
                  href={game.href}
                  className="group block"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-200 h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Difficulty: <span className="font-medium text-slate-700 dark:text-slate-300">{game.difficulty}</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {game.replay}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Features section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
              Why Play Our Games?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Instant Play</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">No downloads or signup required</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Brain Training</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Improve cognitive skills and reflexes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                  <Puzzle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Mobile Friendly</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Play on any device, anywhere</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Daily Challenges</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">New word puzzle every day</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
