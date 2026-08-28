"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Share2, Trophy, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

const GRID_SIZE = 4;
const STORAGE_KEY = "clockhive_merge_best";

type Direction = "up" | "down" | "left" | "right";

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  mergedFrom?: { row: number; col: number }[];
  isNew?: boolean;
}

interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

function getTileColor(value: number): string {
  const colors: Record<number, string> = {
    2: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
    4: "bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200",
    8: "bg-orange-300 dark:bg-orange-700/50 text-orange-900 dark:text-orange-100",
    16: "bg-orange-400 dark:bg-orange-600/60 text-orange-900 dark:text-orange-100",
    32: "bg-red-400 dark:bg-red-600/60 text-red-900 dark:text-red-100",
    64: "bg-red-500 dark:bg-red-500/70 text-red-900 dark:text-red-100",
    128: "bg-yellow-400 dark:bg-yellow-500/70 text-yellow-900 dark:text-yellow-100",
    256: "bg-yellow-500 dark:bg-yellow-500/80 text-yellow-900 dark:text-yellow-100",
    512: "bg-amber-500 dark:bg-amber-400/80 text-amber-900 dark:text-amber-100",
    1024: "bg-amber-600 dark:bg-amber-400/90 text-amber-900 dark:text-amber-100",
    2048: "bg-primary-500 dark:bg-primary-400 text-white",
    4096: "bg-purple-500 dark:bg-purple-400 text-white",
    8192: "bg-pink-500 dark:bg-pink-400 text-white",
  };
  return colors[value] || "bg-slate-700 dark:bg-slate-600 text-white";
}

function getTileFontSize(value: number): string {
  if (value < 100) return "text-3xl sm:text-4xl";
  if (value < 1000) return "text-2xl sm:text-3xl";
  if (value < 10000) return "text-xl sm:text-2xl";
  return "text-lg sm:text-xl";
}

export function MergeGameClient() {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
  });
  const tileIdCounterRef = useRef(0);

  // Load best score on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setGameState((prev) => ({ ...prev, bestScore: parseInt(saved, 10) }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const createTile = useCallback((value: number, row: number, col: number, isNew = false): Tile => {
    tileIdCounterRef.current += 1;
    return {
      id: tileIdCounterRef.current,
      value,
      row,
      col,
      isNew,
      mergedFrom: undefined,
    };
  }, []);

  const addRandomTile = useCallback((currentTiles: Tile[]): Tile[] => {
    const emptyCells: { row: number; col: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!currentTiles.some((t) => t.row === r && t.col === c)) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) return currentTiles;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    return [...currentTiles, createTile(value, randomCell.row, randomCell.col, true)];
  }, [createTile]);

  const initializeGame = useCallback(() => {
    const tiles: Tile[] = [
      createTile(2, 0, 0, true),
      createTile(2, 1, 1, true),
    ];
    setGameState((prev) => ({
      tiles,
      score: 0,
      bestScore: prev.bestScore,
      gameOver: false,
      won: false,
    }));
  }, [createTile]);

  // Initialize game on mount (client-side only)
  useEffect(() => {
    if (gameState.tiles.length === 0) {
      initializeGame();
    }
  }, [gameState.tiles.length, initializeGame]);

  const moveTiles = useCallback((currentTiles: Tile[], currentScore: number, direction: Direction): { tiles: Tile[]; score: number; moved: boolean } => {
    let tiles = [...currentTiles];
    let score = currentScore;
    let moved = false;

    // Clear merge flags
    tiles = tiles.map((t) => ({ ...t, mergedFrom: undefined, isNew: false }));

    const moveInDirection = (tile: Tile): { row: number; col: number } => {
      let { row, col } = tile;
      const deltaRow = direction === "up" ? -1 : direction === "down" ? 1 : 0;
      const deltaCol = direction === "left" ? -1 : direction === "right" ? 1 : 0;

      while (true) {
        const newRow = row + deltaRow;
        const newCol = col + deltaCol;

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
          break;
        }

        const targetTile = tiles.find((t) => t.row === newRow && t.col === newCol);
        if (!targetTile) {
          row = newRow;
          col = newCol;
        } else if (targetTile.value === tile.value && !targetTile.mergedFrom) {
          // Merge
          row = newRow;
          col = newCol;
          break;
        } else {
          break;
        }
      }

      return { row, col };
    };

    // Process tiles in the correct order based on direction
    const processedTiles = [...tiles].sort((a, b) => {
      if (direction === "up") return a.row - b.row;
      if (direction === "down") return b.row - a.row;
      if (direction === "left") return a.col - b.col;
      return b.col - a.col;
    });

    const newTiles: Tile[] = [];
    const mergedPositions = new Set<string>();

    for (const tile of processedTiles) {
      const newPos = moveInDirection(tile);
      const existingTile = newTiles.find((t) => t.row === newPos.row && t.col === newPos.col);
      const posKey = `${newPos.row},${newPos.col}`;

      if (existingTile && existingTile.value === tile.value && !mergedPositions.has(posKey)) {
        // Merge tiles
        const mergedValue = tile.value * 2;
        score += mergedValue;
        mergedPositions.add(posKey);
        tileIdCounterRef.current += 1;
        newTiles.push({
          ...existingTile,
          id: tileIdCounterRef.current,
          value: mergedValue,
          mergedFrom: [{ row: tile.row, col: tile.col }],
          isNew: false,
        });
        moved = true;
      } else if (tile.row !== newPos.row || tile.col !== newPos.col) {
        tileIdCounterRef.current += 1;
        newTiles.push({ ...tile, id: tileIdCounterRef.current, row: newPos.row, col: newPos.col, isNew: false });
        moved = true;
      } else {
        newTiles.push({ ...tile, isNew: false });
      }
    }

    return { tiles: newTiles, score, moved };
  }, []);

  const checkGameOver = useCallback((tiles: Tile[]): boolean => {
    // Check for empty cells
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!tiles.some((t) => t.row === r && t.col === c)) {
          return false;
        }
      }
    }

    // Check for possible merges
    for (const tile of tiles) {
      const neighbors = [
        { row: tile.row - 1, col: tile.col },
        { row: tile.row + 1, col: tile.col },
        { row: tile.row, col: tile.col - 1 },
        { row: tile.row, col: tile.col + 1 },
      ];

      for (const neighbor of neighbors) {
        if (neighbor.row >= 0 && neighbor.row < GRID_SIZE && neighbor.col >= 0 && neighbor.col < GRID_SIZE) {
          const neighborTile = tiles.find((t) => t.row === neighbor.row && t.col === neighbor.col);
          if (neighborTile && neighborTile.value === tile.value) {
            return false;
          }
        }
      }
    }

    return true;
  }, []);

  const move = useCallback((direction: Direction) => {
    setGameState((prev) => {
      if (prev.gameOver || prev.won) return prev;

      const { tiles: newTiles, score: newScore, moved } = moveTiles(prev.tiles, prev.score, direction);

      if (!moved) return prev;

      const tilesWithRandom = addRandomTile(newTiles);
      const gameOver = checkGameOver(tilesWithRandom);
      const won = tilesWithRandom.some((t) => t.value === 2048);

      const bestScore = Math.max(prev.bestScore, newScore);
      if (bestScore > prev.bestScore) {
        try {
          localStorage.setItem(STORAGE_KEY, bestScore.toString());
        } catch {
          /* ignore */
        }
      }

      return {
        tiles: tilesWithRandom,
        score: newScore,
        bestScore,
        gameOver,
        won,
      };
    });
  }, [moveTiles, addRandomTile, checkGameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      move(direction);
    }
  }, [move]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Touch handling
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        move(deltaX > 0 ? "right" : "left");
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        move(deltaY > 0 ? "down" : "up");
      }
    }

    setTouchStart(null);
  }, [touchStart, move]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const continueGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, won: false }));
  }, []);

  const shareResult = async () => {
    const text = `🧩 ClockHive 2048 — I scored ${gameState.score} points! Can you beat me? https://clockhive.cc/games/merge`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "2048 Merge Game | ClockHive", text });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Score copied — share it anywhere!");
    } catch {
      toast.error("Couldn't copy score");
    }
  };

  const getTileAt = (row: number, col: number) => {
    const tile = gameState.tiles.find((t) => t.row === row && t.col === col);
    return tile;
  };

  return (
    <div className="w-full">
      {/* Score board */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 min-w-[100px]">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Score
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {gameState.score}
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 min-w-[100px]">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Best
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {gameState.bestScore}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
          <button
            onClick={shareResult}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game board */}
      <div
        className="relative bg-slate-200 dark:bg-slate-700 rounded-2xl p-3 sm:p-4 touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid background */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            return (
              <div
                key={`cell-${i}`}
                className="aspect-square bg-slate-300 dark:bg-slate-600 rounded-xl"
              />
            );
          })}
        </div>

        {/* Tiles */}
        <div className="absolute inset-0 p-3 sm:p-4 pointer-events-none">
          <div className="grid grid-cols-4 gap-3 sm:gap-4 h-full">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const row = Math.floor(i / GRID_SIZE);
              const col = i % GRID_SIZE;
              const tile = getTileAt(row, col);

              if (!tile) return <div key={`empty-cell-${i}`} className="aspect-square" />;

              return (
                <div
                  key={tile.id}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center font-bold
                    ${getTileColor(tile.value)} ${getTileFontSize(tile.value)}
                    transition-all duration-150 ease-out
                    ${tile.isNew ? "animate-pop-in" : ""}
                    ${tile.mergedFrom ? "animate-merge" : ""}
                    overflow-hidden
                  `}
                >
                  {tile.value}
                </div>
              );
            })}
          </div>
        </div>

        {/* Game over overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Game Over!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Final score: {gameState.score}
              </p>
              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Win overlay */}
        {gameState.won && (
          <div className="absolute inset-0 bg-primary-500/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold text-white mb-2">
                You Win! 🎉
              </h3>
              <p className="text-white/90 mb-4">
                You reached 2048! Score: {gameState.score}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={continueGame}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
        Use arrow keys or swipe to move tiles
      </p>
    </div>
  );
}