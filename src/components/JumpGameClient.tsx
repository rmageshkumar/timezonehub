"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  Pause,
  Play,
  Share2,
  Trophy,
  MousePointerClick,
} from "lucide-react";
import toast from "react-hot-toast";

const STORAGE_KEY = "clockhive_jump_best";

// Logical canvas size (aspect preserved on all screens)
const W = 900;
const H = 460;
const GROUND_Y = H - 56;

// Physics
const GRAVITY = 2600;
const JUMP_VEL = -880;
const DOUBLE_JUMP_VEL = -720;
const BASE_SPEED = 320;
const MAX_SPEED = 760;
const ACCEL = 9;

const PLAYER_W = 40;
const PLAYER_H = 46;
const PLAYER_X = 140;

type Obstacle = { x: number; w: number; h: number; type: "spike" | "block" };
type Coin = { x: number; y: number; taken: boolean; t: number };
type Cloud = { x: number; y: number; s: number; v: number };
type Hill = { x: number; s: number; v: number; tone: "far" | "near" };
type Star = { x: number; y: number; r: number; tw: number };
type Spark = { x: number; y: number; vx: number; vy: number; t: number };
type Phase = "ready" | "playing" | "paused" | "gameover";

interface GameData {
  phase: Phase;
  playerY: number;
  playerVy: number;
  onGround: boolean;
  jumpsUsed: number;
  distance: number;
  speed: number;
  score: number;
  coins: number;
  newBest: boolean;
  best: number;
  obstacles: Obstacle[];
  coinSprites: Coin[];
  sparkles: Spark[];
  clouds: Cloud[];
  hills: Hill[];
  stars: Star[];
  spawnDist: number;
  nextSpawn: number;
  runPhase: number;
}

function makeGame(): GameData {
  return {
    phase: "ready",
    playerY: GROUND_Y - PLAYER_H,
    playerVy: 0,
    onGround: true,
    jumpsUsed: 0,
    distance: 0,
    speed: BASE_SPEED,
    score: 0,
    coins: 0,
    newBest: false,
    best: 0,
    obstacles: [],
    coinSprites: [],
    sparkles: [],
    clouds: [],
    hills: [],
    stars: [],
    spawnDist: 0,
    nextSpawn: 280,
    runPhase: 0,
  };
}

function seedWorld(g: GameData) {
  g.clouds = Array.from({ length: 6 }, () => ({
    x: Math.random() * W,
    y: 30 + Math.random() * 130,
    s: 0.6 + Math.random() * 0.8,
    v: 12 + Math.random() * 14,
  }));
  g.hills = [
    ...Array.from({ length: 6 }, (_, i) => ({
      x: i * 200 + Math.random() * 80,
      s: 0.7 + Math.random() * 0.7,
      v: 20,
      tone: "far" as const,
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      x: i * 240 + Math.random() * 60,
      s: 0.9 + Math.random() * 0.8,
      v: 40,
      tone: "near" as const,
    })),
  ];
  g.stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.6,
    r: 1 + Math.random() * 1.5,
    tw: Math.random() * 10,
  }));
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// ---------- Rendering ----------

function drawSky(ctx: CanvasRenderingContext2D, dark: boolean) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  if (dark) {
    grad.addColorStop(0, "#0b1023");
    grad.addColorStop(0.6, "#111c38");
    grad.addColorStop(1, "#16233f");
  } else {
    grad.addColorStop(0, "#38bdf8");
    grad.addColorStop(0.7, "#7dd3fc");
    grad.addColorStop(1, "#bae6fd");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (dark) {
    // moon
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(W - 96, 84, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111c38";
    ctx.beginPath();
    ctx.arc(W - 84, 76, 30, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // sun
    ctx.fillStyle = "rgba(253,224,71,0.9)";
    ctx.beginPath();
    ctx.arc(W - 96, 82, 38, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStars(ctx: CanvasRenderingContext2D, g: GameData) {
  for (const s of g.stars) {
    const a = 0.35 + 0.6 * Math.abs(Math.sin(g.distance * 0.002 + s.tw));
    ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHills(ctx: CanvasRenderingContext2D, g: GameData, dark: boolean) {
  for (const h of g.hills) {
    ctx.fillStyle = dark
      ? h.tone === "far"
        ? "#152238"
        : "#1b2c4d"
      : h.tone === "far"
      ? "#7dd3fc"
      : "#38bdf8";
    ctx.beginPath();
    ctx.arc(h.x, GROUND_Y + 6, 72 * h.s, Math.PI, 0);
    ctx.fill();
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, g: GameData) {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (const c of g.clouds) {
    const s = c.s;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 22 * s, 0, Math.PI * 2);
    ctx.arc(c.x + 24 * s, c.y + 4 * s, 17 * s, 0, Math.PI * 2);
    ctx.arc(c.x - 24 * s, c.y + 4 * s, 17 * s, 0, Math.PI * 2);
    ctx.arc(c.x, c.y + 9 * s, 19 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(ctx: CanvasRenderingContext2D, dark: boolean) {
  ctx.fillStyle = dark ? "#0b2b26" : "#86efac";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = dark ? "#065f46" : "#4ade80";
  ctx.fillRect(0, GROUND_Y, W, 16);
  ctx.fillStyle = dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)";
  ctx.fillRect(0, GROUND_Y, W, 3);
  // grass tufts
  ctx.fillStyle = dark ? "#10b981" : "#22c55e";
  for (let i = 0; i < W; i += 46) {
    const hx = (i + g_phaseOffset()) % W;
    ctx.beginPath();
    ctx.moveTo(hx, GROUND_Y);
    ctx.lineTo(hx + 5, GROUND_Y - 8);
    ctx.lineTo(hx + 10, GROUND_Y);
    ctx.fill();
  }
}

// simple scroll offset for grass tufts so they move with the world
let g_tuftOffset = 0;
function g_phaseOffset() {
  return g_tuftOffset;
}

function drawObstacles(ctx: CanvasRenderingContext2D, g: GameData) {
  for (const o of g.obstacles) {
    const top = GROUND_Y - o.h;
    if (o.type === "block") {
      ctx.fillStyle = "#64748b";
      rr(ctx, o.x, top, o.w, o.h, 5);
      ctx.fill();
      ctx.fillStyle = "#94a3b8";
      rr(ctx, o.x + 3, top + 4, o.w - 6, 7, 3);
      ctx.fill();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(o.x + o.w * 0.4, top + 14);
      ctx.lineTo(o.x + o.w * 0.55, top + o.h - 8);
      ctx.stroke();
    } else {
      // spikes on a base
      const baseH = 10;
      const triH = o.h - baseH;
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(o.x, GROUND_Y - baseH, o.w, baseH);
      const n = 2;
      ctx.fillStyle = "#ef4444";
      for (let i = 0; i < n; i++) {
        const cx = o.x + (i + 0.5) * (o.w / n);
        const half = o.w / n / 2;
        ctx.beginPath();
        ctx.moveTo(cx - half, GROUND_Y - baseH);
        ctx.lineTo(cx, GROUND_Y - baseH - triH);
        ctx.lineTo(cx + half, GROUND_Y - baseH);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

function drawCoins(ctx: CanvasRenderingContext2D, g: GameData) {
  for (const c of g.coinSprites) {
    if (c.taken) continue;
    const scaleX = Math.cos(c.t * 6 + c.x * 0.05);
    const bobY = c.y + Math.sin(c.t * 4) * 5;
    ctx.save();
    ctx.translate(c.x, bobY);
    ctx.scale(Math.max(0.25, Math.abs(scaleX)), 1);
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawSparkles(ctx: CanvasRenderingContext2D, g: GameData) {
  for (const s of g.sparkles) {
    const a = Math.max(0, 1 - s.t / 0.7);
    ctx.fillStyle = `rgba(253,224,71,${a.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, g: GameData, dark: boolean) {
  const x = PLAYER_X;
  const y = g.playerY;
  const running = g.onGround && g.phase === "playing";
  const bob = running ? Math.sin(g.runPhase) * 2.5 : 0;
  const bodyY = y + bob;
  const cx = x + PLAYER_W / 2;

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(cx, GROUND_Y + 5, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // feet (behind body) — alternate while running
  const foot = running ? Math.sin(g.runPhase) : 0;
  ctx.fillStyle = dark ? "#0f172a" : "#1e3a8a";
  rr(ctx, x + 5, GROUND_Y - 7 + (foot > 0 ? -4 : 0), 13, 9, 4);
  ctx.fill();
  rr(ctx, x + PLAYER_W - 18, GROUND_Y - 7 + (foot > 0 ? 0 : -4), 13, 9, 4);
  ctx.fill();

  // body
  const grad = ctx.createLinearGradient(x, bodyY, x, bodyY + PLAYER_H);
  grad.addColorStop(0, "#fb923c");
  grad.addColorStop(1, "#ea580c");
  ctx.fillStyle = grad;
  rr(ctx, x, bodyY, PLAYER_W, PLAYER_H - 2, 13);
  ctx.fill();

  // belly
  ctx.fillStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.28)";
  rr(ctx, x + 7, bodyY + PLAYER_H - 20, PLAYER_W - 14, 14, 7);
  ctx.fill();

  // cap
  ctx.fillStyle = dark ? "#b91c1c" : "#dc2626";
  rr(ctx, x - 3, bodyY - 4, PLAYER_W + 6, 13, 7);
  ctx.fill();
  ctx.fillStyle = dark ? "#991b1b" : "#b91c1c";
  rr(ctx, x - 6, bodyY + 6, PLAYER_W + 12, 5, 3);
  ctx.fill();
  // cap button
  ctx.fillStyle = "#fde68a";
  ctx.beginPath();
  ctx.arc(cx, bodyY + 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // eyes
  const lookUp = g.playerVy < -60;
  const eyeY = bodyY + 14 + (lookUp ? -2 : 0);
  for (const dir of [-1, 1]) {
    const ex = cx + (dir * 13) / 2;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 5.5, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(ex + (lookUp ? 0 : dir * 1.6), eyeY + (lookUp ? -1.6 : 0), 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // mouth
  ctx.strokeStyle = "#7c2d12";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, bodyY + 24, 5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

function draw(ctx: CanvasRenderingContext2D, g: GameData, dark: boolean) {
  drawSky(ctx, dark);
  drawStars(ctx, g);
  drawHills(ctx, g, dark);
  drawClouds(ctx, g);
  drawGround(ctx, dark);
  drawObstacles(ctx, g);
  drawCoins(ctx, g);
  drawSparkles(ctx, g);
  drawPlayer(ctx, g, dark);
}

// ---------- Simulation ----------

function spawnPattern(g: GameData) {
  const r = Math.random();
  if (r < 0.55) {
    // obstacle (+ sometimes coins above)
    const spike = Math.random() < 0.6;
    const h = spike ? 26 + Math.random() * 16 : 36 + Math.random() * 26;
    g.obstacles.push({
      x: W + 30,
      w: spike ? 46 : 30 + Math.random() * 16,
      h,
      type: spike ? "spike" : "block",
    });
    if (Math.random() < 0.5) {
      const y = GROUND_Y - h - 74;
      for (let i = 0; i < 3; i++) {
        g.coinSprites.push({ x: W + 170 + i * 34, y, taken: false, t: 0 });
      }
    }
  } else if (r < 0.85) {
    // coin arc
    const baseY = GROUND_Y - 130 - Math.random() * 60;
    const n = 4;
    for (let i = 0; i < n; i++) {
      const x = W + 40 + i * 42;
      const y = baseY - Math.sin((i / (n - 1)) * Math.PI) * 60;
      g.coinSprites.push({ x, y, taken: false, t: 0 });
    }
  } else {
    // floating coin row
    const y = GROUND_Y - 120;
    for (let i = 0; i < 5; i++) {
      g.coinSprites.push({ x: W + 40 + i * 36, y, taken: false, t: 0 });
    }
  }
}

function update(g: GameData, dt: number) {
  // Always keep the background gently moving (ready/paused too)
  for (const c of g.clouds) {
    c.x -= c.v * dt;
    if (c.x < -160) {
      c.x = W + 160;
      c.y = 40 + Math.random() * 140;
    }
  }
  for (const h of g.hills) {
    h.x -= h.v * dt;
    if (h.x < -200) h.x = W + 200;
  }
  g_tuftOffset = (g_tuftOffset + dt * g.speed * 0.2) % 46;

  if (g.phase !== "playing") return;

  const t = Math.min(dt, 0.033); // clamp so a tab-switch doesn't teleport the player

  g.distance += g.speed * t;
  g.score += (g.speed * t) / 12;
  g.speed = Math.min(MAX_SPEED, BASE_SPEED + (g.distance * ACCEL) / 400);
  g.runPhase += g.speed * t * 0.055;

  // player physics
  g.playerVy += GRAVITY * t;
  g.playerY += g.playerVy * t;
  const floorY = GROUND_Y - PLAYER_H;
  if (g.playerY >= floorY) {
    g.playerY = floorY;
    g.playerVy = 0;
    if (!g.onGround) {
      g.onGround = true;
      g.jumpsUsed = 0;
    }
  }

  // spawning
  g.spawnDist += g.speed * t;
  if (g.spawnDist >= g.nextSpawn) {
    g.spawnDist = 0;
    spawnPattern(g);
    g.nextSpawn = 280 + Math.random() * 260 + g.speed * 0.22;
  }

  // move obstacles
  for (const o of g.obstacles) o.x -= g.speed * t;
  g.obstacles = g.obstacles.filter((o) => o.x + o.w > -20);

  // coins: move, bob, collect
  const pcx = PLAYER_X + PLAYER_W / 2;
  const pcy = g.playerY + PLAYER_H / 2;
  for (const c of g.coinSprites) {
    c.x -= g.speed * t;
    c.t += t;
    if (!c.taken && Math.abs(c.x - pcx) < 30 && Math.abs(c.y - pcy) < 42) {
      c.taken = true;
      g.coins += 1;
      g.score += 50;
      for (let i = 0; i < 7; i++) {
        g.sparkles.push({
          x: c.x,
          y: c.y,
          vx: (Math.random() - 0.5) * 180,
          vy: -Math.random() * 140 - 40,
          t: 0,
        });
      }
    }
  }
  g.coinSprites = g.coinSprites.filter((c) => !c.taken && c.x > -20);

  // sparkles
  for (const s of g.sparkles) {
    s.t += t;
    s.x += s.vx * t;
    s.y += s.vy * t;
    s.vy += 320 * t;
  }
  g.sparkles = g.sparkles.filter((s) => s.t < 0.7);

  // obstacle collisions
  const px = PLAYER_X + 9;
  const py = g.playerY + 8;
  const pw = PLAYER_W - 18;
  const ph = PLAYER_H - 14;
  for (const o of g.obstacles) {
    const shrink = o.type === "spike" ? 0.78 : 0.92;
    const ox = o.x + (o.w * (1 - shrink)) / 2;
    const ow = o.w * shrink;
    const oh = o.h * shrink;
    const oy = GROUND_Y - o.h + o.h * (1 - shrink) * 0.4;
    if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
      gameOver(g);
      return;
    }
  }
}

function gameOver(g: GameData) {
  g.phase = "gameover";
  const final = Math.floor(g.score);
  if (final > g.best) {
    g.best = final;
    g.newBest = true;
    try {
      localStorage.setItem(STORAGE_KEY, String(final));
    } catch {
      /* ignore */
    }
  }
}

// ---------- Component ----------

export function JumpGameClient() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameData>(makeGame());
  const lastRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);

  // Load saved best
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY)) || 0;
      setBest(saved);
      gameRef.current.best = saved;
    } catch {
      /* ignore */
    }
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.phase = "playing";
    g.playerY = GROUND_Y - PLAYER_H;
    g.playerVy = 0;
    g.onGround = true;
    g.jumpsUsed = 0;
    g.distance = 0;
    g.speed = BASE_SPEED;
    g.score = 0;
    g.coins = 0;
    g.obstacles = [];
    g.coinSprites = [];
    g.sparkles = [];
    g.spawnDist = 0;
    g.nextSpawn = 260;
    g.newBest = false;
    setNewBest(false);
    setScore(0);
    setCoins(0);
    setPhase("playing");
    lastRef.current = performance.now();
  }, []);

  const jump = useCallback((g: GameData) => {
    if (g.onGround) {
      g.playerVy = JUMP_VEL;
      g.onGround = false;
      g.jumpsUsed = 1;
    } else if (g.jumpsUsed < 2) {
      g.playerVy = DOUBLE_JUMP_VEL;
      g.jumpsUsed = 2;
    }
  }, []);

  const resumeGame = useCallback(() => {
    const g = gameRef.current;
    g.phase = "playing";
    setPhase("playing");
    lastRef.current = performance.now();
  }, []);

  const pressAction = useCallback(() => {
    const g = gameRef.current;
    if (g.phase === "ready" || g.phase === "gameover") {
      startGame();
    } else if (g.phase === "paused") {
      resumeGame();
    } else if (g.phase === "playing") {
      jump(g);
    }
  }, [startGame, resumeGame, jump]);

  const togglePause = useCallback(() => {
    const g = gameRef.current;
    if (g.phase === "playing") {
      g.phase = "paused";
      setPhase("paused");
    } else if (g.phase === "paused") {
      resumeGame();
    }
  }, [resumeGame]);

  // Main loop + canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = gameRef.current;
    seedWorld(g);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.width * (H / W) * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.width * (H / W)}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(now - lastRef.current, 100);
      lastRef.current = now;
      const game = gameRef.current;
      update(game, dt / 1000);
      const dark = document.documentElement.classList.contains("dark");
      const scale = canvas.width / W;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      draw(ctx, game, dark);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        pressAction();
      } else if (e.code === "KeyP" || e.code === "Escape") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [pressAction, togglePause]);

  // Sync HUD / phase from the simulation loop to React state
  useEffect(() => {
    const id = setInterval(() => {
      const g = gameRef.current;
      setScore(Math.floor(g.score));
      setCoins(g.coins);
      setPhase(g.phase);
      setBest(g.best);
      if (g.phase === "gameover") setNewBest(g.newBest);
    }, 80);
    return () => clearInterval(id);
  }, []);

  const share = useCallback(async () => {
    const text = `🦘 ClockHive Sky Hopper — I scored ${score} points with ${coins} coins! Can you beat me? https://clockhive.cc/games/jump`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Sky Hopper | ClockHive", text });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Result copied — share it anywhere!");
    } catch {
      toast.error("Couldn't copy result");
    }
  }, [score, coins]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl select-none touch-none"
      style={{ aspectRatio: `${W} / ${H}`, WebkitTouchCallout: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none [-webkit-tap-highlight-color:transparent]"
        onPointerDown={(e) => {
          e.preventDefault();
          pressAction();
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* HUD */}
      {phase === "playing" && (
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4 pointer-events-none">
          <div className="rounded-xl bg-black/30 backdrop-blur-sm px-3 py-1.5 text-white font-bold font-mono text-sm sm:text-lg">
            {score}
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="rounded-xl bg-black/30 backdrop-blur-sm px-3 py-1.5 text-white text-sm sm:text-base">
              🪙 {coins}
            </span>
            <span className="rounded-xl bg-black/30 backdrop-blur-sm px-3 py-1.5 text-white text-sm sm:text-base">
              🏆 {best}
            </span>
            <button
              onClick={togglePause}
              aria-label="Pause game"
              className="rounded-xl bg-black/30 backdrop-blur-sm p-2 text-white hover:bg-black/40 transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Ready overlay */}
      {phase === "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/40 backdrop-blur-[2px] p-6 text-center">
          <div className="text-5xl">🦘</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
            Sky Hopper
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-sm">
            Hop over obstacles and grab coins. Speed up as you go!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/85">
            <span className="rounded-full bg-white/15 px-3 py-1">Space / ↑ to jump</span>
            <span className="rounded-full bg-white/15 px-3 py-1">Tap to jump</span>
            <span className="rounded-full bg-white/15 px-3 py-1">P to pause</span>
          </div>
          <button
            onClick={startGame}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Start
          </button>
          {best > 0 && (
            <p className="flex items-center gap-1 text-amber-200 text-sm">
              <Trophy className="w-4 h-4" /> Personal best: {best}
            </p>
          )}
        </div>
      )}

      {/* Paused overlay */}
      {phase === "paused" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/50 backdrop-blur-[2px] p-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Paused</h2>
          <button
            onClick={resumeGame}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Resume
          </button>
          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      )}

      {/* Game over overlay */}
      {phase === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/60 backdrop-blur-[2px] p-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Game Over!</h2>
          {newBest && (
            <p className="rounded-full bg-amber-400/90 text-amber-950 px-4 py-1 text-sm font-bold animate-pulse">
              🎉 New personal best!
            </p>
          )}
          <div className="flex items-center gap-6 mt-1">
            <div>
              <div className="text-xs uppercase tracking-wide text-white/70">Score</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-white">{score}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-white/70">Coins</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-300">🪙 {coins}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-white/70">Best</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-white">{best}</div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Play again
            </button>
            <button
              onClick={share}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
          <p className="text-white/70 text-xs flex items-center gap-1 mt-1">
            <MousePointerClick className="w-3 h-3" /> Press Space or tap to play again
          </p>
        </div>
      )}
    </div>
  );
}
