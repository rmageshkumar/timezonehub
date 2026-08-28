"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  Share2,
  Trophy,
  Zap,
  Timer,
  Gauge,
  Target,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";

type Mode = "trials" | "rush10" | "rush30";
type Phase =
  | "idle"
  | "waiting"
  | "ready"
  | "tooSoon"
  | "countdown"
  | "running"
  | "done";

const TRIALS_TOTAL = 5;
const STORAGE_KEY = "clockhive_reaction_best";

interface BestScores {
  bestSingle: number | null;
  bestAverage: number | null;
  rush10: number | null;
  rush30: number | null;
}

const EMPTY_BEST: BestScores = {
  bestSingle: null,
  bestAverage: null,
  rush10: null,
  rush30: null,
};

function rating(ms: number) {
  if (ms < 200) return { label: "Lightning reflexes ⚡", emoji: "⚡" };
  if (ms < 260) return { label: "Excellent! 🔥", emoji: "🔥" };
  if (ms < 320) return { label: "Above average 👍", emoji: "👍" };
  if (ms < 400) return { label: "Average 🙂", emoji: "🙂" };
  return { label: "Needs practice 🐢", emoji: "🐢" };
}

const phaseStyles: Record<Phase, string> = {
  idle: "bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500",
  waiting: "bg-gradient-to-br from-rose-600 to-red-500",
  ready: "bg-gradient-to-br from-emerald-600 to-green-500",
  tooSoon: "bg-gradient-to-br from-amber-500 to-orange-500",
  countdown: "bg-slate-800 dark:bg-slate-700",
  running: "bg-gradient-to-br from-emerald-600 to-green-500",
  done: "bg-gradient-to-br from-primary-600 to-accent-500",
};

export function ReactionGameClient() {
  const [mode, setMode] = useState<Mode>("trials");
  const [phase, setPhase] = useState<Phase>("idle");
  const [trials, setTrials] = useState<number[]>([]);
  const [tooSoonCount, setTooSoonCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [rushTimeLeft, setRushTimeLeft] = useState(10);
  const [rushTimes, setRushTimes] = useState<number[]>([]);
  const [best, setBest] = useState<BestScores>(EMPTY_BEST);

  const goTimeRef = useRef(0);
  const lastTapRef = useRef(0);
  const startTimeRef = useRef(0);
  const rushTimesRef = useRef<number[]>([]);
  const finishedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Load personal records on mount, clean up timers on unmount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBest({ ...EMPTY_BEST, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    return () => clearTimers();
  }, [clearTimers]);

  const beginTrial = useCallback(() => {
    setPhase("waiting");
    const delay = 1500 + Math.random() * 2500; // 1.5s – 4s
    timeoutRef.current = setTimeout(() => {
      goTimeRef.current = performance.now();
      setPhase("ready");
    }, delay);
  }, []);

  const updateBest = useCallback((single: number, average: number) => {
    setBest((prev) => {
      const next = { ...prev };
      if (next.bestSingle === null || single < next.bestSingle)
        next.bestSingle = Math.round(single);
      if (next.bestAverage === null || average < next.bestAverage)
        next.bestAverage = Math.round(average);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const startTrials = useCallback(() => {
    clearTimers();
    setTrials([]);
    setTooSoonCount(0);
    setMode("trials");
    beginTrial();
  }, [beginTrial, clearTimers]);

  const endRush = useCallback(
    (seconds: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const times = rushTimesRef.current;
      const count = times.length;
      const key = seconds === 10 ? "rush10" : "rush30";
      setRushTimeLeft(0);
      setPhase("done");
      setBest((prev) => {
        const next = { ...prev };
        if (next[key] === null || count > next[key]) next[key] = count;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const beginRush = useCallback(
    (seconds: number) => {
      finishedRef.current = false;
      startTimeRef.current = performance.now();
      lastTapRef.current = startTimeRef.current;
      rushTimesRef.current = [];
      setRushTimes([]);
      setRushTimeLeft(seconds);
      setPhase("running");
      intervalRef.current = setInterval(() => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        const left = Math.max(0, seconds - elapsed);
        setRushTimeLeft(left);
        if (left <= 0) endRush(seconds);
      }, 50);
    },
    [endRush]
  );

  const startRush = useCallback(
    (seconds: number) => {
      clearTimers();
      setMode(seconds === 10 ? "rush10" : "rush30");
      setCountdown(3);
      setPhase("countdown");
      let c = 3;
      intervalRef.current = setInterval(() => {
        c -= 1;
        if (c <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          beginRush(seconds);
        } else {
          setCountdown(c);
        }
      }, 700);
    },
    [beginRush, clearTimers]
  );

  const resetAll = useCallback(() => {
    clearTimers();
    finishedRef.current = false;
    setTrials([]);
    setTooSoonCount(0);
    setRushTimes([]);
    rushTimesRef.current = [];
    setPhase("idle");
  }, [clearTimers]);

  const selectMode = useCallback(
    (m: Mode) => {
      clearTimers();
      setMode(m);
      setTrials([]);
      setTooSoonCount(0);
      setRushTimes([]);
      rushTimesRef.current = [];
      setPhase("idle");
    },
    [clearTimers]
  );

  const handleTap = useCallback(() => {
    if (phase === "idle") {
      if (mode === "trials") startTrials();
      else startRush(mode === "rush10" ? 10 : 30);
      return;
    }
    if (phase === "waiting") {
      // False start — clicked before green
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setTooSoonCount((c) => c + 1);
      setPhase("tooSoon");
      timeoutRef.current = setTimeout(() => beginTrial(), 900);
      return;
    }
    if (phase === "tooSoon") {
      // Tap again to restart this trial immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      beginTrial();
      return;
    }
    if (phase === "ready") {
      const rt = performance.now() - goTimeRef.current;
      const next = [...trials, rt];
      setTrials(next);
      if (next.length >= TRIALS_TOTAL) {
        setPhase("done");
        const avg = next.reduce((a, b) => a + b, 0) / next.length;
        const single = Math.min(...next);
        updateBest(single, avg);
      } else {
        timeoutRef.current = setTimeout(() => beginTrial(), 400);
      }
      return;
    }
    if (phase === "running") {
      const now = performance.now();
      const delta = now - lastTapRef.current;
      lastTapRef.current = now;
      rushTimesRef.current = [...rushTimesRef.current, delta];
      setRushTimes(rushTimesRef.current);
      return;
    }
    // "countdown" and "done" phases do nothing on tap
  }, [phase, trials, mode, beginTrial, startTrials, startRush, updateBest]);

  // Keyboard support (Space / Enter)
  const handleTapRef = useRef(handleTap);
  useEffect(() => {
    handleTapRef.current = handleTap;
  }, [handleTap]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleTapRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const buildShareText = () => {
    const url = "https://clockhive.cc/games/reaction";
    if (mode === "trials" && trials.length > 0) {
      const avg = Math.round(
        trials.reduce((a, b) => a + b, 0) / trials.length
      );
      const single = Math.round(Math.min(...trials));
      return `🛎️ ClockHive Reaction Test — I averaged ${avg}ms (best ${single}ms) over ${TRIALS_TOTAL} tries! How fast are you? ${url}`;
    }
    const seconds = mode === "rush10" ? 10 : 30;
    const times = rushTimes;
    const avg = times.length
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;
    const single = times.length ? Math.round(Math.min(...times)) : 0;
    return `⚡ ClockHive Reaction Rush — ${times.length} taps in ${seconds}s (avg ${avg}ms, best ${single}ms)! Can you beat me? ${url}`;
  };

  const shareResult = async () => {
    const text = buildShareText();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Reaction Time Test | ClockHive", text });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Result copied — share it anywhere!");
    } catch {
      toast.error("Couldn't copy result");
    }
  };

  // Derived stats
  const trialsAvg = trials.length
    ? trials.reduce((a, b) => a + b, 0) / trials.length
    : 0;
  const rushAvg = rushTimes.length
    ? rushTimes.reduce((a, b) => a + b, 0) / rushTimes.length
    : 0;
  const rushBest = rushTimes.length ? Math.min(...rushTimes) : 0;

  const modeTabs: { id: Mode; label: string; icon: React.ReactNode }[] = [
    { id: "trials", label: "5 Trials", icon: <Target className="w-4 h-4" /> },
    { id: "rush10", label: "10s Rush", icon: <Zap className="w-4 h-4" /> },
    { id: "rush30", label: "30s Rush", icon: <Flame className="w-4 h-4" /> },
  ];

  const hasRecords =
    best.bestAverage !== null ||
    best.rush10 !== null ||
    best.rush30 !== null;

  return (
    <div className="w-full">
      {/* Mode selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
          {modeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectMode(tab.id)}
              className={[
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                mode === tab.id
                  ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
              ].join(" ")}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal records */}
      {hasRecords && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            Best avg:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {best.bestAverage !== null ? `${best.bestAverage}ms` : "—"}
            </span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            10s:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {best.rush10 !== null ? `${best.rush10} taps` : "—"}
            </span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-500" />
            30s:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {best.rush30 !== null ? `${best.rush30} taps` : "—"}
            </span>
          </span>
        </div>
      )}

      {/* Tap panel */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Reaction test tap area"
        onPointerDown={handleTap}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: "manipulation" }}
        className={[
          "relative w-full h-[340px] sm:h-[400px] rounded-3xl shadow-xl cursor-pointer select-none",
          "flex flex-col items-center justify-center gap-3 text-white transition-colors duration-150",
          "border-4 border-white/20 dark:border-white/10",
          phaseStyles[phase],
        ].join(" ")}
      >
        {phase === "idle" && (
          <>
            <Gauge className="w-12 h-12 sm:w-16 sm:h-16 opacity-90" />
            <div className="text-2xl sm:text-4xl font-bold px-6 text-center">
              Ready to test your reflexes?
            </div>
            <div className="text-sm sm:text-base opacity-90 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Tap to start — wait for green, then click fast!
            </div>
            <div className="mt-1 text-xs opacity-70 bg-black/20 dark:bg-black/30 px-3 py-1 rounded-full">
              {mode === "trials"
                ? `${TRIALS_TOTAL} trials · avg reaction`
                : `${mode === "rush10" ? "10" : "30"} seconds · max taps`}
            </div>
          </>
        )}

        {phase === "waiting" && (
          <>
            <div className="text-3xl sm:text-5xl font-bold animate-pulse px-6 text-center">
              Wait for green…
            </div>
            {mode === "trials" && (
              <div className="text-xs sm:text-sm opacity-90 bg-black/20 dark:bg-black/30 px-3 py-1 rounded-full">
                Trial {Math.min(trials.length + 1, TRIALS_TOTAL)}/{TRIALS_TOTAL}
              </div>
            )}
          </>
        )}

        {phase === "ready" && (
          <div className="text-4xl sm:text-6xl font-extrabold tracking-tight animate-pulse px-6 text-center">
            CLICK! ⚡
          </div>
        )}

        {phase === "tooSoon" && (
          <>
            <div className="text-3xl sm:text-5xl font-bold px-6 text-center">
              Too soon! ⚠️
            </div>
            <div className="text-sm sm:text-base opacity-90">
              Wait for green — tap to try again
            </div>
          </>
        )}

        {phase === "countdown" && (
          <div className="text-6xl sm:text-8xl font-extrabold">
            {countdown}
          </div>
        )}

        {phase === "running" && (
          <>
            <div className="text-4xl sm:text-6xl font-extrabold animate-pulse px-6 text-center">
              TAP! TAP! TAP!
            </div>
            <div className="flex items-center gap-4 text-sm sm:text-base">
              <span className="flex items-center gap-1.5 bg-black/20 dark:bg-black/30 px-3 py-1 rounded-full">
                <Timer className="w-4 h-4" />
                {rushTimeLeft.toFixed(1)}s
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 dark:bg-black/30 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4" />
                {rushTimes.length} taps
              </span>
            </div>
          </>
        )}

        {phase === "done" && (
          <>
            <div className="text-3xl sm:text-5xl font-bold px-6 text-center">
              {mode === "trials"
                ? `Average: ${Math.round(trialsAvg)}ms ${rating(trialsAvg).emoji}`
                : `${rushTimes.length} taps in ${mode === "rush10" ? "10" : "30"}s!`}
            </div>
            <div className="text-sm sm:text-base opacity-90">
              Check your full results below
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
        Tap the box or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Space</kbd> to react
      </p>

      {/* Results */}
      {phase === "done" && mode === "trials" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ResultCard
            label="Average"
            value={`${Math.round(trialsAvg)}ms`}
            sub={rating(trialsAvg).label}
          />
          <ResultCard
            label="Best"
            value={`${Math.round(Math.min(...trials))}ms`}
            sub="Fastest single"
          />
          <ResultCard
            label="Personal best"
            value={
              best.bestAverage !== null && best.bestAverage <= Math.round(trialsAvg)
                ? `${best.bestAverage}ms`
                : `${Math.round(trialsAvg)}ms`
            }
            sub={
              best.bestAverage !== null && best.bestAverage <= Math.round(trialsAvg)
                ? "Best average ever"
                : "New personal record! 🎉"
            }
            highlight={
              best.bestAverage === null || best.bestAverage > Math.round(trialsAvg)
            }
          />
          <div className="sm:col-span-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {trials.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  #{i + 1} · {Math.round(t)}ms
                </span>
              ))}
            </div>
            {tooSoonCount > 0 && (
              <p className="text-center text-xs text-slate-400 mt-3">
                ⚠️ {tooSoonCount} false start{tooSoonCount > 1 ? "s" : ""} (tap before green)
              </p>
            )}
          </div>
        </div>
      )}

      {phase === "done" && mode !== "trials" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ResultCard
            label="Taps"
            value={`${rushTimes.length}`}
            sub={`in ${mode === "rush10" ? "10" : "30"} seconds`}
          />
          <ResultCard
            label="Avg reaction"
            value={`${Math.round(rushAvg)}ms`}
            sub={rushTimes.length ? rating(rushAvg).label : "—"}
          />
          <ResultCard
            label="Best reaction"
            value={`${Math.round(rushBest)}ms`}
            sub="Fastest tap"
          />
        </div>
      )}

      {/* Actions */}
      {phase === "done" && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={mode === "trials" ? startTrials : () => startRush(mode === "rush10" ? 10 : 30)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow"
          >
            <RotateCcw className="w-4 h-4" />
            Play again
          </button>
          <button
            onClick={shareResult}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share score
          </button>
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Back to start
          </button>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-5 text-center border",
        highlight
          ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200 dark:border-amber-800"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
      ].join(" ")}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div
        className={[
          "text-3xl font-bold mt-1 font-mono",
          highlight
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-900 dark:text-slate-100",
        ].join(" ")}
      >
        {value}
      </div>
      <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">{sub}</div>
    </div>
  );
}
