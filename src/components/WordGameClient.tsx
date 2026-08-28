"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Share2, Trophy, X } from "lucide-react";
import toast from "react-hot-toast";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const STORAGE_KEY = "clockhive_word_stats";

// Common 5-letter words for the daily challenge
const WORD_LIST = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE",
  "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
  "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AUDIT", "AVOID", "AWARD", "AWARE",
  "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEGUN", "BEING",
  "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME", "BLIND", "BLOCK", "BLOOD", "BOARD",
  "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF", "BRING",
  "BROAD", "BROKE", "BROWN", "BUILD", "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH",
  "CAUSE", "CHAIN", "CHAIR", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD",
  "CHINA", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLOCK", "CLOSE",
  "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER", "CRAFT", "CRASH", "CREAM", "CRIME",
  "CROSS", "CROWD", "CROWN", "CURVE", "CYCLE", "DAILY", "DANCE", "DATED", "DEALT", "DEATH",
  "DEBUT", "DELAY", "DEPTH", "DOING", "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRAWN", "DREAM",
  "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT",
  "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY",
  "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY",
  "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE",
  "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FRUIT",
  "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAND",
  "GRANT", "GRASS", "GREAT", "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST",
  "GUIDE", "HAPPY", "HARRY", "HEART", "HEAVY", "HENCE", "HENRY", "HORSE", "HOTEL", "HOUSE",
  "HUMAN", "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE", "JAPAN", "JIMMY", "JOINT",
  "JONES", "JUDGE", "KNOWN", "LABEL", "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN",
  "LEASE", "LEAST", "LEAVE", "LEGAL", "LEVEL", "LEWIS", "LIGHT", "LIMIT", "LINKS", "LIVES",
  "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY", "LUNCH", "LYING", "MAGIC", "MAJOR", "MAKER",
  "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR", "MEANT", "MEDIA", "METAL", "MIGHT", "MINOR",
  "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH",
  "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT", "NOISE", "NORTH", "NOTED", "NOVEL",
  "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER", "OUGHT", "PAINT", "PANEL",
  "PAPER", "PARTY", "PEACE", "PETER", "PHASE", "PHONE", "PHOTO", "PIECE", "PILOT", "PITCH",
  "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND", "POWER", "PRESS", "PRICE",
  "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE", "QUEEN", "QUICK",
  "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO", "REACH", "READY", "REFER",
  "RIGHT", "RIVAL", "RIVER", "ROBIN", "ROGER", "ROMAN", "ROUGH", "ROUND", "ROUTE", "ROYAL",
  "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHALL", "SHAPE",
  "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHIRT", "SHOCK", "SHOOT", "SHORT",
  "SHOWN", "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL",
  "SMART", "SMILE", "SMITH", "SMOKE", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE",
  "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE", "SPORT", "STAFF", "STAGE",
  "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL", "STICK", "STILL", "STOCK", "STONE",
  "STOOD", "STORE", "STORM", "STORY", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR",
  "SUITE", "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH", "TEETH", "TERRY",
  "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK", "THING", "THINK",
  "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT", "TIMES", "TIRED", "TITLE", "TODAY",
  "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE", "TRAIN", "TREAT", "TREND",
  "TRIAL", "TRIED", "TRUCK", "TRULY", "TRUST", "TRUTH", "TWICE", "UNDER", "UNDUE", "UNION",
  "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE", "USUAL", "VALID", "VALUE", "VIDEO",
  "VIRUS", "VISIT", "VITAL", "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH",
  "WHILE", "WHITE", "WHOLE", "WHOSE", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE", "WORST",
  "WORTH", "WOULD", "WOUND", "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH",
];

type LetterState = "correct" | "present" | "absent" | "empty";

interface Letter {
  char: string;
  state: LetterState;
}

interface GameStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
}

interface GameState {
  guesses: Letter[][];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  targetWord: string;
  date: string;
}

function getDailyWord(): string {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % WORD_LIST.length;
  return WORD_LIST[index];
}

function getDateKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getLetterStates(guess: string, target: string): LetterState[] {
  const states: LetterState[] = [];
  const targetChars: (string | null)[] = target.split("");
  const guessChars: (string | null)[] = guess.split("");

  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      states[i] = "correct";
      targetChars[i] = null; // Mark as used
      guessChars[i] = null;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] !== null) {
      const targetIndex = targetChars.indexOf(guessChars[i]);
      if (targetIndex !== -1) {
        states[i] = "present";
        targetChars[targetIndex] = null; // Mark as used
      } else {
        states[i] = "absent";
      }
    }
  }

  return states;
}

export function WordGameClient() {
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: "",
    gameOver: false,
    won: false,
    targetWord: getDailyWord(),
    date: getDateKey(),
  });
  const [stats, setStats] = useState<GameStats>({
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0],
  });
  const [showStats, setShowStats] = useState(false);

  // Load stats on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Check if it's a new day
  useEffect(() => {
    const currentDate = getDateKey();
    if (gameState.date !== currentDate) {
      // New day, reset game
      const newTargetWord = getDailyWord();
      setGameState({
        guesses: [],
        currentGuess: "",
        gameOver: false,
        won: false,
        targetWord: newTargetWord,
        date: currentDate,
      });
    }
  }, [gameState.date]);

  const updateStats = useCallback((won: boolean, attempts: number) => {
    setStats((prev) => {
      const next = { ...prev };
      next.played += 1;
      if (won) {
        next.wins += 1;
        next.currentStreak += 1;
        next.maxStreak = Math.max(next.maxStreak, next.currentStreak);
        next.distribution[attempts - 1] += 1;
      } else {
        next.currentStreak = 0;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== WORD_LENGTH) return;
    if (!WORD_LIST.includes(gameState.currentGuess.toUpperCase())) {
      toast.error("Not in word list");
      return;
    }

    const guess = gameState.currentGuess.toUpperCase();
    const letterStates = getLetterStates(guess, gameState.targetWord);
    const letters: Letter[] = guess.split("").map((char, i) => ({
      char,
      state: letterStates[i],
    }));

    const newGuesses = [...gameState.guesses, letters];
    const won = guess === gameState.targetWord;
    const gameOver = won || newGuesses.length >= MAX_ATTEMPTS;

    if (gameOver) {
      updateStats(won, newGuesses.length);
    }

    setGameState({
      ...gameState,
      guesses: newGuesses,
      currentGuess: "",
      gameOver,
      won,
    });
  }, [gameState, updateStats]);

  const handleKey = useCallback((key: string) => {
    if (gameState.gameOver) return;

    if (key === "Enter") {
      submitGuess();
    } else if (key === "Backspace") {
      setGameState((prev) => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }));
    } else if (/^[a-zA-Z]$/.test(key) && gameState.currentGuess.length < WORD_LENGTH) {
      setGameState((prev) => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toUpperCase(),
      }));
    }
  }, [gameState.gameOver, gameState.currentGuess.length, submitGuess]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    handleKey(e.key);
  }, [handleKey]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = useCallback(() => {
    setGameState({
      guesses: [],
      currentGuess: "",
      gameOver: false,
      won: false,
      targetWord: getDailyWord(),
      date: getDateKey(),
    });
  }, []);

  const shareResult = async () => {
    const emojis = gameState.guesses.map((row) => {
      return row
        .map((letter) => {
          if (letter.state === "correct") return "🟩";
          if (letter.state === "present") return "🟨";
          return "⬜";
        })
        .join("");
    });

    const text = `🧠 ClockHive Word Guess — ${gameState.won ? gameState.guesses.length : "X"}/6\n\n${emojis.join("\n")}\n\nhttps://clockhive.cc/games/word`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Daily Word Guess | ClockHive", text });
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

  const getKeyboardKeyState = (key: string): LetterState => {
    for (const guess of gameState.guesses) {
      for (const letter of guess) {
        if (letter.char === key) {
          if (letter.state === "correct") return "correct";
          if (letter.state === "present") return "present";
        }
      }
    }
    for (const guess of gameState.guesses) {
      for (const letter of guess) {
        if (letter.char === key && letter.state === "absent") {
          return "absent";
        }
      }
    }
    return "empty";
  };

  const getKeyStyle = (state: LetterState): string => {
    switch (state) {
      case "correct":
        return "bg-emerald-600 text-white border-emerald-700";
      case "present":
        return "bg-amber-500 text-white border-amber-600";
      case "absent":
        return "bg-slate-700 text-slate-400 border-slate-600";
      default:
        return "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600";
    }
  };

  const getTileStyle = (state: LetterState): string => {
    switch (state) {
      case "correct":
        return "bg-emerald-600 border-emerald-700 text-white";
      case "present":
        return "bg-amber-500 border-amber-600 text-white";
      case "absent":
        return "bg-slate-700 border-slate-600 text-slate-400";
      default:
        return "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100";
    }
  };

  return (
    <div className="w-full">
      {/* Header with stats button */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {gameState.gameOver ? (gameState.won ? "🎉 You won!" : "Game Over") : "Guess the word"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Stats
          </button>
          {gameState.gameOver && (
            <>
              <button
                onClick={shareResult}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Statistics</h3>
              <button
                onClick={() => setShowStats(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.played}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Win %</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.currentStreak}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.maxStreak}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Max</div>
              </div>
            </div>
            <div className="space-y-1">
              {stats.distribution.map((count, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 text-xs text-slate-500 dark:text-slate-400">{i + 1}</div>
                  <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded">
                    <div
                      className="h-full bg-emerald-500 rounded"
                      style={{ width: `${stats.played > 0 ? (count / stats.played) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="w-6 text-xs text-slate-500 dark:text-slate-400 text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game board */}
      <div className="grid grid-rows-6 gap-2 mb-6">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const guess = gameState.guesses[rowIndex];
          const isCurrentRow = rowIndex === gameState.guesses.length && !gameState.gameOver;
          const letters = isCurrentRow
            ? gameState.currentGuess.split("").map((char) => ({ char, state: "empty" as LetterState }))
            : guess || Array(WORD_LENGTH).fill(null).map(() => ({ char: "", state: "empty" as LetterState }));

          return (
            <div key={rowIndex} className="grid grid-cols-5 gap-2">
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const letter = letters[colIndex];
                const state = letter?.state || "empty";
                const char = letter?.char || "";

                return (
                  <div
                    key={colIndex}
                    className={`
                      aspect-square border-2 rounded flex items-center justify-center text-xl sm:text-2xl font-bold uppercase
                      transition-all duration-150
                      ${getTileStyle(state)}
                      ${isCurrentRow && char ? "border-slate-400 dark:border-slate-500" : ""}
                      ${isCurrentRow && !char ? "border-slate-300 dark:border-slate-600" : ""}
                    `}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* On-screen keyboard */}
      <div className="space-y-2">
        {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                disabled={gameState.gameOver}
                className={`
                  h-12 sm:h-14 rounded text-sm font-bold transition-colors
                  ${getKeyStyle(getKeyboardKeyState(key))}
                  ${gameState.gameOver ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
                  flex-1 max-w-[3rem]
                `}
              >
                {key}
              </button>
            ))}
            {rowIndex === 2 && (
              <>
                <button
                  onClick={() => handleKey("Enter")}
                  disabled={gameState.gameOver}
                  className="h-12 sm:h-14 rounded text-sm font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 transition-colors hover:opacity-80"
                >
                  ENTER
                </button>
                <button
                  onClick={() => handleKey("Backspace")}
                  disabled={gameState.gameOver}
                  className="h-12 sm:h-14 rounded text-sm font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 transition-colors hover:opacity-80"
                >
                  ⌫
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
        Type or tap letters to guess • Press Enter to submit
      </p>
    </div>
  );
}