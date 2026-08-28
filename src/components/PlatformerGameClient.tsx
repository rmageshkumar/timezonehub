"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Trophy } from "lucide-react";

const STORAGE_KEY = "clockhive_platformer_best";

const VIEW_W = 960;
const VIEW_H = 540;
const WORLD_W = 3200;
const GRAVITY = 2200;
const MOVE_SPEED = 430;
const JUMP_POWER = -830;
const PLAYER_W = 38;
const PLAYER_H = 50;

type Phase = "ready" | "playing" | "paused" | "won" | "lost";

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Platform = Rect & {
  tone: "grass" | "brick" | "cloud";
};

type Coin = {
  x: number;
  y: number;
  taken: boolean;
};

type Enemy = Rect & {
  startX: number;
  endX: number;
  dir: -1 | 1;
  speed: number;
};

type Player = Rect & {
  vx: number;
  vy: number;
  grounded: boolean;
  facing: -1 | 1;
};

type Keys = {
  left: boolean;
  right: boolean;
  jump: boolean;
};

type GameData = {
  phase: Phase;
  player: Player;
  cameraX: number;
  score: number;
  coins: number;
  best: number;
  newBest: boolean;
  time: number;
  platforms: Platform[];
  coinsList: Coin[];
  enemies: Enemy[];
  particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }>;
};

const platforms: Platform[] = [
  { x: 0, y: 476, w: 720, h: 64, tone: "grass" },
  { x: 820, y: 476, w: 440, h: 64, tone: "grass" },
  { x: 1370, y: 476, w: 520, h: 64, tone: "grass" },
  { x: 2030, y: 476, w: 480, h: 64, tone: "grass" },
  { x: 2620, y: 476, w: 580, h: 64, tone: "grass" },
  { x: 360, y: 360, w: 180, h: 26, tone: "brick" },
  { x: 720, y: 300, w: 170, h: 26, tone: "brick" },
  { x: 1040, y: 380, w: 160, h: 26, tone: "cloud" },
  { x: 1480, y: 335, w: 190, h: 26, tone: "brick" },
  { x: 1790, y: 270, w: 170, h: 26, tone: "cloud" },
  { x: 2180, y: 370, w: 210, h: 26, tone: "brick" },
  { x: 2480, y: 295, w: 150, h: 26, tone: "cloud" },
  { x: 2780, y: 360, w: 230, h: 26, tone: "brick" },
];

const coinMap: Coin[] = [
  { x: 420, y: 322, taken: false },
  { x: 470, y: 322, taken: false },
  { x: 755, y: 262, taken: false },
  { x: 805, y: 262, taken: false },
  { x: 1090, y: 340, taken: false },
  { x: 1525, y: 296, taken: false },
  { x: 1580, y: 296, taken: false },
  { x: 1845, y: 232, taken: false },
  { x: 2235, y: 332, taken: false },
  { x: 2290, y: 332, taken: false },
  { x: 2525, y: 257, taken: false },
  { x: 2840, y: 322, taken: false },
  { x: 2895, y: 322, taken: false },
  { x: 2950, y: 322, taken: false },
];

const enemyMap: Enemy[] = [
  { x: 555, y: 436, w: 38, h: 40, startX: 500, endX: 660, dir: -1, speed: 95 },
  { x: 1005, y: 436, w: 38, h: 40, startX: 920, endX: 1190, dir: 1, speed: 105 },
  { x: 1670, y: 436, w: 38, h: 40, startX: 1500, endX: 1845, dir: -1, speed: 120 },
  { x: 2290, y: 436, w: 38, h: 40, startX: 2140, endX: 2440, dir: 1, speed: 115 },
  { x: 2870, y: 436, w: 38, h: 40, startX: 2740, endX: 3070, dir: -1, speed: 135 },
];

function makeGame(best = 0): GameData {
  return {
    phase: "ready",
    player: {
      x: 80,
      y: 410,
      w: PLAYER_W,
      h: PLAYER_H,
      vx: 0,
      vy: 0,
      grounded: false,
      facing: 1,
    },
    cameraX: 0,
    score: 0,
    coins: 0,
    best,
    newBest: false,
    time: 0,
    platforms: platforms.map((p) => ({ ...p })),
    coinsList: coinMap.map((c) => ({ ...c })),
    enemies: enemyMap.map((e) => ({ ...e })),
    particles: [],
  };
}

function intersects(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function resolvePlatforms(g: GameData, prevY: number) {
  const p = g.player;
  p.grounded = false;

  for (const platform of g.platforms) {
    if (!intersects(p, platform)) continue;

    const wasAbove = prevY + p.h <= platform.y + 10;
    if (p.vy >= 0 && wasAbove) {
      p.y = platform.y - p.h;
      p.vy = 0;
      p.grounded = true;
    } else if (p.vy < 0 && prevY >= platform.y + platform.h - 8) {
      p.y = platform.y + platform.h;
      p.vy = 80;
    } else if (p.x + p.w / 2 < platform.x + platform.w / 2) {
      p.x = platform.x - p.w;
      p.vx = 0;
    } else {
      p.x = platform.x + platform.w;
      p.vx = 0;
    }
  }
}

function finishRun(g: GameData, phase: "won" | "lost") {
  g.phase = phase;
  if (phase === "won") {
    g.score += Math.max(0, Math.floor(800 - g.time * 18));
  }
  if (g.score > g.best) {
    g.best = g.score;
    g.newBest = true;
    try {
      localStorage.setItem(STORAGE_KEY, String(g.best));
    } catch {
      /* ignore */
    }
  }
}

function updateGame(g: GameData, keys: Keys, dt: number) {
  g.time += dt;

  for (const particle of g.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 900 * dt;
    particle.life -= dt;
  }
  g.particles = g.particles.filter((particle) => particle.life > 0);

  if (g.phase !== "playing") return;

  const p = g.player;
  const prevY = p.y;
  const wantsLeft = keys.left;
  const wantsRight = keys.right;

  p.vx = 0;
  if (wantsLeft) {
    p.vx = -MOVE_SPEED;
    p.facing = -1;
  }
  if (wantsRight) {
    p.vx = MOVE_SPEED;
    p.facing = 1;
  }

  if (keys.jump && p.grounded) {
    p.vy = JUMP_POWER;
    p.grounded = false;
  }

  p.vy += GRAVITY * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.x = clamp(p.x, 0, WORLD_W - p.w);
  resolvePlatforms(g, prevY);

  for (const enemy of g.enemies) {
    enemy.x += enemy.dir * enemy.speed * dt;
    if (enemy.x <= enemy.startX) {
      enemy.x = enemy.startX;
      enemy.dir = 1;
    }
    if (enemy.x >= enemy.endX) {
      enemy.x = enemy.endX;
      enemy.dir = -1;
    }

    if (intersects(p, enemy)) {
      const stomp = p.vy > 180 && p.y + p.h - enemy.y < 24;
      if (stomp) {
        g.score += 150;
        p.vy = JUMP_POWER * 0.55;
        enemy.x = -999;
        for (let i = 0; i < 12; i += 1) {
          g.particles.push({
            x: enemy.x + enemy.w / 2,
            y: enemy.y + enemy.h / 2,
            vx: (Math.random() - 0.5) * 260,
            vy: -Math.random() * 220,
            life: 0.55,
          });
        }
      } else {
        finishRun(g, "lost");
      }
    }
  }
  g.enemies = g.enemies.filter((enemy) => enemy.x > -100);

  for (const coin of g.coinsList) {
    if (!coin.taken && intersects(p, { x: coin.x - 14, y: coin.y - 14, w: 28, h: 28 })) {
      coin.taken = true;
      g.coins += 1;
      g.score += 100;
      for (let i = 0; i < 8; i += 1) {
        g.particles.push({
          x: coin.x,
          y: coin.y,
          vx: (Math.random() - 0.5) * 190,
          vy: -80 - Math.random() * 160,
          life: 0.45,
        });
      }
    }
  }

  if (p.y > VIEW_H + 180) {
    finishRun(g, "lost");
  }

  if (p.x > WORLD_W - 170 && p.y < 476) {
    finishRun(g, "won");
  }

  g.score = Math.max(g.score, Math.floor(p.x / 10) + g.coins * 100);
  g.cameraX = clamp(p.x - VIEW_W * 0.42, 0, WORLD_W - VIEW_W);
}

function drawPlatform(ctx: CanvasRenderingContext2D, platform: Platform) {
  if (platform.tone === "cloud") {
    ctx.fillStyle = "#f8fafc";
    drawRoundedRect(ctx, platform.x, platform.y, platform.w, platform.h, 13);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.stroke();
    return;
  }

  ctx.fillStyle = platform.tone === "grass" ? "#22c55e" : "#b45309";
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
  ctx.fillStyle = platform.tone === "grass" ? "#15803d" : "#7c2d12";
  ctx.fillRect(platform.x, platform.y + Math.min(18, platform.h / 2), platform.w, platform.h);

  if (platform.tone === "brick") {
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    for (let x = platform.x + 24; x < platform.x + platform.w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, platform.y + 2);
      ctx.lineTo(x, platform.y + platform.h - 2);
      ctx.stroke();
    }
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, g: GameData) {
  const p = g.player;
  const runBob = p.grounded && p.vx !== 0 ? Math.sin(g.time * 18) * 3 : 0;
  const x = p.x;
  const y = p.y + runBob;

  ctx.fillStyle = "rgba(15,23,42,0.22)";
  ctx.beginPath();
  ctx.ellipse(x + p.w / 2, p.y + p.h + 8, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1d4ed8";
  drawRoundedRect(ctx, x + 7, y + 21, p.w - 14, 29, 7);
  ctx.fill();
  ctx.fillStyle = "#f97316";
  drawRoundedRect(ctx, x + 2, y + 6, p.w - 4, 28, 10);
  ctx.fill();
  ctx.fillStyle = "#dc2626";
  drawRoundedRect(ctx, x - 3, y, p.w + 8, 13, 7);
  ctx.fill();
  ctx.fillRect(x + (p.facing === 1 ? 19 : -5), y + 8, 24, 5);

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x + (p.facing === 1 ? 26 : 13), y + 18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(x + (p.facing === 1 ? 28 : 11), y + 18, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x + 6, y + 47, 12, 6);
  ctx.fillRect(x + 22, y + 47, 12, 6);
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  ctx.fillStyle = "#7c2d12";
  drawRoundedRect(ctx, enemy.x, enemy.y + 8, enemy.w, enemy.h - 8, 9);
  ctx.fill();
  ctx.fillStyle = "#92400e";
  ctx.beginPath();
  ctx.arc(enemy.x + enemy.w / 2, enemy.y + 11, 18, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.arc(enemy.x + 12, enemy.y + 18, 4, 0, Math.PI * 2);
  ctx.arc(enemy.x + 26, enemy.y + 18, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(enemy.x + 10, enemy.y + 18, 4, 2);
  ctx.fillRect(enemy.x + 24, enemy.y + 18, 4, 2);
}

function drawGame(ctx: CanvasRenderingContext2D, g: GameData) {
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  sky.addColorStop(0, "#60a5fa");
  sky.addColorStop(0.55, "#bfdbfe");
  sky.addColorStop(1, "#f8fafc");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.save();
  ctx.translate(-g.cameraX * 0.28, 0);
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  for (let i = 0; i < 10; i += 1) {
    const x = 120 + i * 360;
    const y = 78 + (i % 3) * 36;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 28, y + 6, 20, 0, Math.PI * 2);
    ctx.arc(x - 30, y + 7, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(-g.cameraX * 0.55, 0);
  ctx.fillStyle = "#86efac";
  for (let x = -120; x < WORLD_W; x += 230) {
    ctx.beginPath();
    ctx.arc(x, 486, 110, Math.PI, 0);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(-g.cameraX, 0);

  for (const platform of g.platforms) drawPlatform(ctx, platform);

  ctx.strokeStyle = "#7c2d12";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(WORLD_W - 92, 476);
  ctx.lineTo(WORLD_W - 92, 268);
  ctx.stroke();
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(WORLD_W - 89, 276);
  ctx.lineTo(WORLD_W - 18, 308);
  ctx.lineTo(WORLD_W - 89, 340);
  ctx.closePath();
  ctx.fill();

  for (const coin of g.coinsList) {
    if (coin.taken) continue;
    const wobble = Math.cos(g.time * 7 + coin.x) * 0.25 + 0.75;
    ctx.save();
    ctx.translate(coin.x, coin.y + Math.sin(g.time * 5 + coin.x) * 4);
    ctx.scale(wobble, 1);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a16207";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  for (const enemy of g.enemies) drawEnemy(ctx, enemy);

  ctx.fillStyle = "#fde047";
  for (const particle of g.particles) {
    ctx.globalAlpha = clamp(particle.life / 0.55, 0, 1);
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawPlayer(ctx, g);
  ctx.restore();
}

export function PlatformerGameClient() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Keys>({ left: false, right: false, jump: false });
  const gameRef = useRef<GameData>(makeGame());
  const lastRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY)) || 0;
      gameRef.current.best = saved;
      setBest(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const startGame = useCallback(() => {
    gameRef.current = makeGame(gameRef.current.best);
    gameRef.current.phase = "playing";
    keysRef.current = { left: false, right: false, jump: false };
    lastRef.current = performance.now();
    setPhase("playing");
    setScore(0);
    setCoins(0);
    setNewBest(false);
  }, []);

  const togglePause = useCallback(() => {
    const g = gameRef.current;
    if (g.phase === "playing") {
      g.phase = "paused";
      setPhase("paused");
    } else if (g.phase === "paused") {
      g.phase = "playing";
      lastRef.current = performance.now();
      setPhase("playing");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.width * (VIEW_H / VIEW_W) * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.width * (VIEW_H / VIEW_W)}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.033);
      lastRef.current = now;
      const g = gameRef.current;
      updateGame(g, keysRef.current, dt);

      const scale = canvas.width / VIEW_W;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drawGame(ctx, g);

      setScore(g.score);
      setCoins(g.coins);
      setPhase(g.phase);
      setBest(g.best);
      setNewBest(g.newBest);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        keysRef.current.left = true;
        event.preventDefault();
      }
      if (event.code === "ArrowRight" || event.code === "KeyD") {
        keysRef.current.right = true;
        event.preventDefault();
      }
      if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
        if (gameRef.current.phase === "ready" || gameRef.current.phase === "won" || gameRef.current.phase === "lost") {
          startGame();
        } else {
          keysRef.current.jump = true;
        }
        event.preventDefault();
      }
      if (event.code === "Escape" || event.code === "KeyP") {
        togglePause();
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") keysRef.current.left = false;
      if (event.code === "ArrowRight" || event.code === "KeyD") keysRef.current.right = false;
      if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") keysRef.current.jump = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [startGame, togglePause]);

  const setTouchKey = (key: keyof Keys, value: boolean) => {
    keysRef.current[key] = value;
  };

  const statusText =
    phase === "won"
      ? "You reached the flag"
      : phase === "lost"
        ? "Try that run again"
        : phase === "paused"
          ? "Paused"
          : "Reach the red flag";

  return (
    <div className="space-y-4">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-sky-100 shadow-xl dark:border-slate-700"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
          <div className="rounded-lg bg-slate-950/55 px-3 py-2 font-mono text-sm font-bold text-white backdrop-blur sm:text-lg">
            {score}
          </div>
          <div className="flex gap-2 text-xs font-semibold text-white sm:text-sm">
            <span className="rounded-lg bg-slate-950/55 px-3 py-2 backdrop-blur">Coins {coins}/{coinMap.length}</span>
            <span className="rounded-lg bg-slate-950/55 px-3 py-2 backdrop-blur">Best {best}</span>
          </div>
        </div>

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/50 p-5 text-center text-white backdrop-blur-[2px]">
            <h2 className="text-2xl font-bold sm:text-4xl">
              {phase === "ready" ? "Platform Dash" : phase === "won" ? "Level Clear" : phase === "lost" ? "Game Over" : "Paused"}
            </h2>
            <p className="max-w-md text-sm text-white/85 sm:text-base">
              {phase === "ready"
                ? "Run, jump, collect coins, stomp enemies, and reach the red flag."
                : statusText}
            </p>
            {newBest && (
              <p className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-1 text-sm font-bold text-amber-950">
                <Trophy className="h-4 w-4" />
                New best score
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={phase === "paused" ? togglePause : startGame}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-bold text-white transition-colors hover:bg-emerald-600"
              >
                <Play className="h-5 w-5" />
                {phase === "paused" ? "Resume" : "Play"}
              </button>
              {phase !== "ready" && (
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/25"
                >
                  <RotateCcw className="h-5 w-5" />
                  Restart
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-white/80">
              <span className="rounded-full bg-white/15 px-3 py-1">A / Left</span>
              <span className="rounded-full bg-white/15 px-3 py-1">D / Right</span>
              <span className="rounded-full bg-white/15 px-3 py-1">Space / Up</span>
              <span className="rounded-full bg-white/15 px-3 py-1">P to pause</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <button
          aria-label="Move left"
          onPointerDown={() => setTouchKey("left", true)}
          onPointerUp={() => setTouchKey("left", false)}
          onPointerCancel={() => setTouchKey("left", false)}
          className="rounded-lg bg-slate-900 px-4 py-4 font-bold text-white active:bg-slate-700"
        >
          Left
        </button>
        <button
          aria-label="Jump"
          onPointerDown={() => setTouchKey("jump", true)}
          onPointerUp={() => setTouchKey("jump", false)}
          onPointerCancel={() => setTouchKey("jump", false)}
          className="rounded-lg bg-emerald-600 px-4 py-4 font-bold text-white active:bg-emerald-500"
        >
          Jump
        </button>
        <button
          aria-label="Move right"
          onPointerDown={() => setTouchKey("right", true)}
          onPointerUp={() => setTouchKey("right", false)}
          onPointerCancel={() => setTouchKey("right", false)}
          className="rounded-lg bg-slate-900 px-4 py-4 font-bold text-white active:bg-slate-700"
        >
          Right
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <span>{statusText}</span>
        <button
          onClick={togglePause}
          disabled={phase === "ready" || phase === "won" || phase === "lost"}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          {phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          {phase === "paused" ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
