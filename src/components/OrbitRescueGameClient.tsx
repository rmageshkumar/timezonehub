"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Trophy, Maximize2, Minimize2 } from "lucide-react";

const STORAGE_KEY = "clockhive_orbit_rescue_best";
const W = 920;
const H = 520;
const SHIP_R = 18;
const MAX_HEALTH = 3;

type Phase = "ready" | "playing" | "paused" | "lost";
type Keys = { up: boolean; down: boolean; left: boolean; right: boolean };
type Ship = { x: number; y: number; vx: number; vy: number };
type Asteroid = { x: number; y: number; r: number; vx: number; spin: number };
type Crystal = { x: number; y: number; r: number; vx: number; pulse: number };
type Star = { x: number; y: number; r: number; speed: number; alpha: number };
type Burst = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type GameData = {
  phase: Phase;
  ship: Ship;
  asteroids: Asteroid[];
  crystals: Crystal[];
  stars: Star[];
  bursts: Burst[];
  score: number;
  best: number;
  health: number;
  rescued: number;
  time: number;
  spawnTimer: number;
  crystalTimer: number;
  invulnerable: number;
  newBest: boolean;
};

function makeStars() {
  return Array.from({ length: 90 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 0.8 + Math.random() * 1.8,
    speed: 20 + Math.random() * 90,
    alpha: 0.3 + Math.random() * 0.7,
  }));
}

function makeGame(best = 0): GameData {
  return {
    phase: "ready",
    ship: { x: 120, y: H / 2, vx: 0, vy: 0 },
    asteroids: [],
    crystals: [],
    stars: makeStars(),
    bursts: [],
    score: 0,
    best,
    health: MAX_HEALTH,
    rescued: 0,
    time: 0,
    spawnTimer: 0.45,
    crystalTimer: 1.2,
    invulnerable: 0,
    newBest: false,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function finishRun(g: GameData) {
  g.phase = "lost";
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

function addBurst(g: GameData, x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i += 1) {
    g.bursts.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 300,
      vy: (Math.random() - 0.5) * 300,
      life: 0.45 + Math.random() * 0.35,
      color,
    });
  }
}

function spawnAsteroid(g: GameData) {
  const r = 18 + Math.random() * 28;
  g.asteroids.push({
    x: W + r + 20,
    y: 50 + Math.random() * (H - 100),
    r,
    vx: -(210 + Math.random() * 170 + g.time * 7),
    spin: Math.random() * Math.PI * 2,
  });
}

function spawnCrystal(g: GameData) {
  g.crystals.push({
    x: W + 34,
    y: 58 + Math.random() * (H - 116),
    r: 15,
    vx: -(180 + Math.random() * 120 + g.time * 4),
    pulse: Math.random() * 8,
  });
}

function updateGame(g: GameData, keys: Keys, dt: number) {
  g.time += dt;

  for (const star of g.stars) {
    star.x -= star.speed * dt;
    if (star.x < -8) {
      star.x = W + 8;
      star.y = Math.random() * H;
    }
  }

  for (const burst of g.bursts) {
    burst.x += burst.vx * dt;
    burst.y += burst.vy * dt;
    burst.vx *= 0.985;
    burst.vy *= 0.985;
    burst.life -= dt;
  }
  g.bursts = g.bursts.filter((burst) => burst.life > 0);

  if (g.phase !== "playing") return;

  const ship = g.ship;
  const accel = 980;
  if (keys.left) ship.vx -= accel * dt;
  if (keys.right) ship.vx += accel * dt;
  if (keys.up) ship.vy -= accel * dt;
  if (keys.down) ship.vy += accel * dt;

  ship.vx *= 0.9;
  ship.vy *= 0.9;
  ship.x = clamp(ship.x + ship.vx * dt, SHIP_R + 6, W - SHIP_R - 6);
  ship.y = clamp(ship.y + ship.vy * dt, SHIP_R + 6, H - SHIP_R - 6);

  g.score += Math.floor(dt * 18);
  g.spawnTimer -= dt;
  g.crystalTimer -= dt;
  g.invulnerable = Math.max(0, g.invulnerable - dt);

  if (g.spawnTimer <= 0) {
    spawnAsteroid(g);
    g.spawnTimer = Math.max(0.28, 0.88 - g.time * 0.015) + Math.random() * 0.45;
  }
  if (g.crystalTimer <= 0) {
    spawnCrystal(g);
    g.crystalTimer = 1.2 + Math.random() * 1.4;
  }

  for (const asteroid of g.asteroids) {
    asteroid.x += asteroid.vx * dt;
    asteroid.spin += dt * 2.4;
  }
  g.asteroids = g.asteroids.filter((asteroid) => asteroid.x + asteroid.r > -40);

  for (const crystal of g.crystals) {
    crystal.x += crystal.vx * dt;
    crystal.pulse += dt;
  }
  g.crystals = g.crystals.filter((crystal) => crystal.x + crystal.r > -40);

  for (const crystal of g.crystals) {
    if (dist(ship.x, ship.y, crystal.x, crystal.y) < SHIP_R + crystal.r) {
      const burstX = crystal.x;
      const burstY = crystal.y;
      crystal.x = -999;
      g.rescued += 1;
      g.score += 120;
      addBurst(g, burstX, burstY, "#67e8f9", 12);
    }
  }

  if (g.invulnerable <= 0) {
    for (const asteroid of g.asteroids) {
      if (dist(ship.x, ship.y, asteroid.x, asteroid.y) < SHIP_R + asteroid.r * 0.78) {
        asteroid.x = -999;
        g.health -= 1;
        g.invulnerable = 1.2;
        addBurst(g, ship.x, ship.y, "#fb7185", 18);
        if (g.health <= 0) finishRun(g);
        break;
      }
    }
  }
}

function drawShip(ctx: CanvasRenderingContext2D, g: GameData) {
  const { ship } = g;
  const blink = g.invulnerable > 0 && Math.floor(g.time * 14) % 2 === 0;
  if (blink) return;

  ctx.save();
  ctx.translate(ship.x, ship.y);
  const tilt = clamp(ship.vy / 500, -0.45, 0.45);
  ctx.rotate(tilt);

  ctx.fillStyle = "rgba(14,165,233,0.35)";
  ctx.beginPath();
  ctx.moveTo(-22, 0);
  ctx.lineTo(-45, -12);
  ctx.lineTo(-40, 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(26, 0);
  ctx.lineTo(-20, -23);
  ctx.lineTo(-11, 0);
  ctx.lineTo(-20, 23);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(2, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(-20, -9);
  ctx.lineTo(-42 - Math.random() * 8, 0);
  ctx.lineTo(-20, 9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawAsteroid(ctx: CanvasRenderingContext2D, asteroid: Asteroid) {
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);
  ctx.rotate(asteroid.spin);
  ctx.fillStyle = "#78716c";
  ctx.beginPath();
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const radius = asteroid.r * (0.74 + (i % 3) * 0.13);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.beginPath();
  ctx.arc(-asteroid.r * 0.18, -asteroid.r * 0.2, asteroid.r * 0.22, 0, Math.PI * 2);
  ctx.arc(asteroid.r * 0.26, asteroid.r * 0.18, asteroid.r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCrystal(ctx: CanvasRenderingContext2D, crystal: Crystal) {
  const glow = 0.6 + Math.sin(crystal.pulse * 5) * 0.25;
  ctx.save();
  ctx.translate(crystal.x, crystal.y);
  ctx.fillStyle = `rgba(103,232,249,${glow})`;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(15, 0);
  ctx.lineTo(0, 18);
  ctx.lineTo(-15, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#cffafe";
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(7, 0);
  ctx.lineTo(0, 12);
  ctx.lineTo(-7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGame(ctx: CanvasRenderingContext2D, g: GameData) {
  const sky = ctx.createLinearGradient(0, 0, W, H);
  sky.addColorStop(0, "#020617");
  sky.addColorStop(0.55, "#172554");
  sky.addColorStop(1, "#312e81");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  for (const star of g.stars) {
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(34,211,238,0.1)";
  ctx.beginPath();
  ctx.arc(W - 90, 90, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(125,211,252,0.28)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(W - 90, 90, 96, 22, -0.35, 0, Math.PI * 2);
  ctx.stroke();

  for (const crystal of g.crystals) drawCrystal(ctx, crystal);
  for (const asteroid of g.asteroids) drawAsteroid(ctx, asteroid);

  for (const burst of g.bursts) {
    ctx.globalAlpha = clamp(burst.life / 0.7, 0, 1);
    ctx.fillStyle = burst.color;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawShip(ctx, g);
}

export function OrbitRescueGameClient() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameData>(makeGame());
  const keysRef = useRef<Keys>({ up: false, down: false, left: false, right: false });
  const lastRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [rescued, setRescued] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
        setIsFullscreen(false);
      } else if (el.requestFullscreen) {
        void el
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => setIsFullscreen(false));
      }
    } catch {
      /* Fullscreen API unavailable */
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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
    keysRef.current = { up: false, down: false, left: false, right: false };
    lastRef.current = performance.now();
    setPhase("playing");
    setScore(0);
    setHealth(MAX_HEALTH);
    setRescued(0);
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
      canvas.height = Math.max(1, Math.floor(rect.width * (H / W) * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.width * (H / W)}px`;
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

      const scale = canvas.width / W;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drawGame(ctx, g);

      setPhase(g.phase);
      setScore(g.score);
      setHealth(g.health);
      setRescued(g.rescued);
      setBest(g.best);
      setNewBest(g.newBest);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp" || event.code === "KeyW") keysRef.current.up = true;
      if (event.code === "ArrowDown" || event.code === "KeyS") keysRef.current.down = true;
      if (event.code === "ArrowLeft" || event.code === "KeyA") keysRef.current.left = true;
      if (event.code === "ArrowRight" || event.code === "KeyD") keysRef.current.right = true;
      if (event.code === "Space" && gameRef.current.phase !== "playing" && gameRef.current.phase !== "paused") startGame();
      if (event.code === "Escape" || event.code === "KeyP") togglePause();
      if (
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "KeyW" ||
        event.code === "KeyA" ||
        event.code === "KeyS" ||
        event.code === "KeyD" ||
        event.code === "Space"
      ) {
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp" || event.code === "KeyW") keysRef.current.up = false;
      if (event.code === "ArrowDown" || event.code === "KeyS") keysRef.current.down = false;
      if (event.code === "ArrowLeft" || event.code === "KeyA") keysRef.current.left = false;
      if (event.code === "ArrowRight" || event.code === "KeyD") keysRef.current.right = false;
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
    phase === "lost"
      ? "Hull integrity failed"
      : phase === "paused"
        ? "Paused"
        : "Rescue crystals and dodge asteroids";

  return (
    <div className="space-y-4">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-xl dark:border-slate-700"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
          <div className="rounded-lg bg-slate-950/60 px-3 py-2 font-mono text-sm font-bold text-white backdrop-blur sm:text-lg">
            {score}
          </div>
          <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold text-white sm:text-sm">
            <span className="rounded-lg bg-slate-950/60 px-3 py-2 backdrop-blur">Crystals {rescued}</span>
            <span className="rounded-lg bg-slate-950/60 px-3 py-2 backdrop-blur">Hull {"♥".repeat(health)}</span>
            <span className="rounded-lg bg-slate-950/60 px-3 py-2 backdrop-blur">Best {best}</span>
          </div>
        </div>

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto bg-slate-950/60 px-3 py-2 text-center text-white backdrop-blur-[2px] sm:gap-3 sm:p-5">
            <h2 className="text-2xl font-bold sm:text-4xl">
              {phase === "ready" ? "Orbit Rescue" : phase === "lost" ? "Mission Failed" : "Paused"}
            </h2>
            <p className="max-w-md text-sm text-white/85 sm:text-base">
              {phase === "ready"
                ? "Pilot through the asteroid field, collect blue time crystals, and keep your hull intact."
                : statusText}
            </p>
            {newBest && (
              <p className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-1 text-sm font-bold text-cyan-950">
                <Trophy className="h-4 w-4" />
                New best score
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={phase === "paused" ? togglePause : startGame}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 font-bold text-white transition-colors hover:bg-cyan-600"
              >
                <Play className="h-5 w-5" />
                {phase === "paused" ? "Resume" : "Launch"}
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
              <span className="rounded-full bg-white/15 px-3 py-1">WASD</span>
              <span className="rounded-full bg-white/15 px-3 py-1">Arrow keys</span>
              <span className="rounded-full bg-white/15 px-3 py-1">P to pause</span>
            </div>
          </div>
        )}

        {/* Fullscreen / expand toggle — bigger play area on phones */}
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className="absolute right-2 bottom-2 z-30 rounded-xl bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button
          aria-label="Move up"
          onPointerDown={() => setTouchKey("up", true)}
          onPointerUp={() => setTouchKey("up", false)}
          onPointerLeave={() => setTouchKey("up", false)}
          onPointerCancel={() => setTouchKey("up", false)}
          className="rounded-lg bg-cyan-600 px-4 py-3 font-bold text-white active:bg-cyan-500"
        >
          Up
        </button>
        <div />
        <button
          aria-label="Move left"
          onPointerDown={() => setTouchKey("left", true)}
          onPointerUp={() => setTouchKey("left", false)}
          onPointerLeave={() => setTouchKey("left", false)}
          onPointerCancel={() => setTouchKey("left", false)}
          className="rounded-lg bg-slate-900 px-4 py-3 font-bold text-white active:bg-slate-700"
        >
          Left
        </button>
        <button
          aria-label="Move down"
          onPointerDown={() => setTouchKey("down", true)}
          onPointerUp={() => setTouchKey("down", false)}
          onPointerLeave={() => setTouchKey("down", false)}
          onPointerCancel={() => setTouchKey("down", false)}
          className="rounded-lg bg-slate-900 px-4 py-3 font-bold text-white active:bg-slate-700"
        >
          Down
        </button>
        <button
          aria-label="Move right"
          onPointerDown={() => setTouchKey("right", true)}
          onPointerUp={() => setTouchKey("right", false)}
          onPointerLeave={() => setTouchKey("right", false)}
          onPointerCancel={() => setTouchKey("right", false)}
          className="rounded-lg bg-slate-900 px-4 py-3 font-bold text-white active:bg-slate-700"
        >
          Right
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <span>{statusText}</span>
        <button
          onClick={togglePause}
          disabled={phase === "ready" || phase === "lost"}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          {phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          {phase === "paused" ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
