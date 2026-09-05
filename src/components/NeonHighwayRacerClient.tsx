"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DashButton } from "@/components/DashButton";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";

const W = 900;
const H = 620;
const ROAD_X = 180;
const ROAD_W = 540;
const LANES = 4;
const PLAYER_W = 48;
const PLAYER_H = 84;
const STORAGE_KEY = "clockhive_neon_highway_best";

// Synthwave / outrun palette
const NEON_CYAN = "#22d3ee";
const NEON_PINK = "#ff2d95";
const NEON_AMBER = "#fbbf24";
const NEON_RED = "#ff4d6d";
const NEON_VIOLET = "#7c3aed";

type Phase = "ready" | "countdown" | "playing" | "paused" | "crashing" | "upgrade" | "gameover";
type Keys = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  nitro: boolean;
};
type VehicleKind = "car" | "bus" | "truck" | "bike" | "police" | "rival";
type PickupKind = "coin" | "nitro" | "fuel" | "repair";
type ObstacleKind = "barrel" | "cone" | "oil";
type Rect = { x: number; y: number; w: number; h: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};
type Popup = {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
  size: number;
};
type Shockwave = {
  x: number;
  y: number;
  r: number;
  vr: number;
  life: number;
  maxLife: number;
  color: string;
};
type Vehicle = Rect & {
  kind: VehicleKind;
  lane: number;
  vy: number;
  vx: number;
  color: string;
  nearMissed: boolean;
  changeTimer: number;
  personality?: "aggressive" | "defensive" | "fast" | "steady" | "wild";
  distance?: number;
};
type Pickup = { x: number; y: number; r: number; kind: PickupKind; vy: number; pulse: number };
type Obstacle = Rect & { kind: ObstacleKind; vy: number };
type Player = Rect & {
  vx: number;
  vy: number;
  speed: number;
  health: number;
  fuel: number;
  nitro: number;
  invulnerable: number;
};
type Upgrade = { label: string; detail: string; apply: (g: GameData) => void };
type GameData = {
  phase: Phase;
  player: Player;
  traffic: Vehicle[];
  police: Vehicle[];
  rivals: Vehicle[];
  pickups: Pickup[];
  obstacles: Obstacle[];
  particles: Particle[];
  popups: Popup[];
  shockwaves: Shockwave[];
  scenery: number;
  flashA: number;
  flashColor: string;
  crashTimer: number;
  crashTo: Phase | null;
  goFired: boolean;
  comboTime: number;
  lastLevel: number;
  lastWanted: number;
  score: number;
  best: number;
  distance: number;
  coins: number;
  level: number;
  combo: number;
  multiplier: number;
  wanted: number;
  crashes: number;
  countdown: number;
  time: number;
  roadScroll: number;
  spawnTimer: number;
  pickupTimer: number;
  obstacleTimer: number;
  policeTimer: number;
  shake: number;
  muted: boolean;
  newBest: boolean;
  upgrades: Upgrade[];
  stats: {
    maxSpeed: number;
    acceleration: number;
    handling: number;
    brakes: number;
    nitroPower: number;
  };
};
type Snapshot = {
  phase: Phase;
  score: number;
  best: number;
  distance: number;
  health: number;
  fuel: number;
  nitro: number;
  level: number;
  combo: number;
  multiplier: number;
  wanted: number;
  coins: number;
  crashes: number;
  countdown: number;
  newBest: boolean;
  upgrades: Upgrade[];
  leaderboard: { name: string; distance: number; color: string }[];
  muted: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function shadeColor(color: string, percent: number) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + 
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

function laneCenter(lane: number) {
  return ROAD_X + (lane + 0.5) * (ROAD_W / LANES);
}

function rectsOverlap(a: Rect, b: Rect) {
  return (
    Math.abs(a.x - b.x) * 2 < a.w + b.w &&
    Math.abs(a.y - b.y) * 2 < a.h + b.h
  );
}

function createAudio() {
  let ctx: AudioContext | null = null;
  const tone = (frequency: number, duration: number, type: OscillatorType, volume: number) => {
    try {
      ctx = ctx || new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      /* Sound is optional. */
    }
  };

  const arpeggio = (freq: number) => {
    tone(freq, 0.09, "square", 0.028);
    setTimeout(() => tone(freq * 1.5, 0.09, "square", 0.02), 60);
    setTimeout(() => tone(freq * 2, 0.14, "square", 0.018), 120);
  };

  return {
    start: () => tone(440, 0.08, "square", 0.035),
    go: () => tone(660, 0.18, "square", 0.05),
    coin: () => tone(880, 0.08, "triangle", 0.04),
    power: () => tone(620, 0.1, "sawtooth", 0.035),
    hit: () => tone(130, 0.22, "sawtooth", 0.06),
    wreck: () => tone(72, 0.42, "sawtooth", 0.09),
    miss: () => tone(1040, 0.05, "sine", 0.025),
    level: () => arpeggio(523),
    combo: () => arpeggio(392),
    warn: () => tone(300, 0.14, "square", 0.032),
  };
}

function makeVehicle(lane: number, y: number, kind?: VehicleKind): Vehicle {
  const options: VehicleKind[] = ["car", "bus", "truck", "bike"];
  const chosen = kind || options[Math.floor(Math.random() * options.length)];
  const sizes = {
    car: { w: 48, h: 82 },
    bus: { w: 58, h: 120 },
    truck: { w: 62, h: 112 },
    bike: { w: 30, h: 62 },
    police: { w: 52, h: 88 },
    rival: { w: 48, h: 82 },
  };
  const colors = {
    car: ["#f97316", "#22c55e", "#f43f5e", "#eab308"],
    bus: ["#facc15", "#38bdf8"],
    truck: ["#94a3b8", "#fb7185"],
    bike: ["#a78bfa", "#2dd4bf"],
    police: ["#e2e8f0"],
    rival: ["#60a5fa", "#c084fc", "#34d399", "#f472b6"],
  };
  const palette = colors[chosen];
  return {
    x: laneCenter(lane),
    y,
    w: sizes[chosen].w,
    h: sizes[chosen].h,
    kind: chosen,
    lane,
    vy: 120 + Math.random() * 120 + (chosen === "bike" ? 90 : 0) - (chosen === "bus" ? 35 : 0),
    vx: 0,
    color: palette[Math.floor(Math.random() * palette.length)],
    nearMissed: false,
    changeTimer: 1 + Math.random() * 4,
  };
}

function makeRivals() {
  const names = ["Vega", "Rook", "Blitz", "Echo", "Nova", "Shade", "Flux"];
  const personalities: Vehicle["personality"][] = ["fast", "aggressive", "defensive", "wild", "steady", "fast", "aggressive"];
  return names.map((name, i) => ({
    ...makeVehicle(i % LANES, H - 210 - i * 46, "rival"),
    personality: personalities[i],
    distance: 0,
    color: ["#38bdf8", "#fb7185", "#facc15", "#a78bfa", "#34d399", "#f472b6", "#f97316"][i],
    name,
  })) as Array<Vehicle & { name: string }>;
}

function makeUpgradePool(): Upgrade[] {
  const pool: Upgrade[] = [
    {
      label: "Turbocharger",
      detail: "Higher top speed",
      apply: (g) => {
        g.stats.maxSpeed += 80;
      },
    },
    {
      label: "Launch Tune",
      detail: "Better acceleration",
      apply: (g) => {
        g.stats.acceleration += 90;
      },
    },
    {
      label: "Wide Tires",
      detail: "Sharper handling",
      apply: (g) => {
        g.stats.handling += 60;
      },
    },
    {
      label: "Race Brakes",
      detail: "Stronger braking",
      apply: (g) => {
        g.stats.brakes += 80;
      },
    },
    {
      label: "Nitro Cells",
      detail: "Boost lasts longer",
      apply: (g) => {
        g.stats.nitroPower += 0.22;
        g.player.nitro = clamp(g.player.nitro + 25, 0, 100);
      },
    },
  ];
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}

function makeGame(best = 0, muted = false): GameData {
  return {
    phase: "ready",
    player: {
      x: laneCenter(1),
      y: H - 118,
      w: PLAYER_W,
      h: PLAYER_H,
      vx: 0,
      vy: 0,
      speed: 340,
      health: 3,
      fuel: 100,
      nitro: 65,
      invulnerable: 0,
    },
    traffic: [],
    police: [],
    rivals: makeRivals(),
    pickups: [],
    obstacles: [],
    particles: [],
    popups: [],
    shockwaves: [],
    scenery: 0,
    flashA: 0,
    flashColor: "#ffffff",
    crashTimer: 0,
    crashTo: null,
    goFired: false,
    comboTime: 0,
    lastLevel: 1,
    lastWanted: 1,
    score: 0,
    best,
    distance: 0,
    coins: 0,
    level: 1,
    combo: 0,
    multiplier: 1,
    wanted: 1,
    crashes: 0,
    countdown: 3,
    time: 0,
    roadScroll: 0,
    spawnTimer: 0.4,
    pickupTimer: 1.4,
    obstacleTimer: 2.3,
    policeTimer: 7,
    shake: 0,
    muted,
    newBest: false,
    upgrades: [],
    stats: {
      maxSpeed: 720,
      acceleration: 430,
      handling: 720,
      brakes: 520,
      nitroPower: 1,
    },
  };
}

function addParticles(g: GameData, x: number, y: number, color: string, count: number, speed = 220) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const force = Math.random() * speed;
    g.particles.push({
      x,
      y,
      vx: Math.cos(angle) * force,
      vy: Math.sin(angle) * force,
      life: 0.35 + Math.random() * 0.45,
      maxLife: 0.8,
      color,
      size: 2 + Math.random() * 5,
    });
  }
}

// Deterministic pseudo-random so background art never flickers frame-to-frame.
function hash01(seed: number) {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function laneOfX(x: number) {
  return clamp(Math.floor((x - ROAD_X) / (ROAD_W / LANES)), 0, LANES - 1);
}

function spawnPopup(g: GameData, x: number, y: number, text: string, color: string, size = 18) {
  g.popups.push({ x, y, life: 1, maxLife: 1, text, color, size });
}

function spawnShock(g: GameData, x: number, y: number, color: string, boost = 1) {
  g.shockwaves.push({ x, y, r: 10, vr: 500 * boost, life: 0.55, maxLife: 0.55, color });
}

function flashGame(g: GameData, color: string, strength: number) {
  g.flashA = Math.max(g.flashA, strength);
  g.flashColor = color;
}

// Forgiving hit test — both boxes are shrunk so clipping a corner or a grazing
// pass doesn't read as a full-on crash. Feel fairer without changing density.
function hitsPlayer(p: Player, o: Rect) {
  const ax = Math.abs(p.x - o.x);
  const ay = Math.abs(p.y - o.y);
  const pw = p.w * 0.72;
  const ph = p.h * 0.76;
  const ow = o.w * 0.84;
  const oh = o.h * 0.84;
  return ax * 2 < pw + ow && ay * 2 < ph + oh;
}

function spawnTraffic(g: GameData) {
  const occupied = new Set(g.traffic.filter((v) => v.y < 190).map((v) => v.lane));
  const nearObstacles = new Set(g.obstacles.filter((o) => o.y < 150).map((o) => laneOfX(o.x)));
  const free = Array.from({ length: LANES }, (_, i) => i).filter((lane) => !occupied.has(lane));
  if (!free.length) return;
  // Prefer lanes that won't hide a fresh hazard behind a car body.
  const clear = free.filter((lane) => !nearObstacles.has(lane));
  const pool = clear.length ? clear : free;
  const lane = pool[Math.floor(Math.random() * pool.length)];
  g.traffic.push(makeVehicle(lane, -80 - Math.random() * 160));
}

function spawnPickup(g: GameData) {
  const kindRoll = Math.random();
  const kind: PickupKind =
    kindRoll < 0.48 ? "coin" : kindRoll < 0.68 ? "nitro" : kindRoll < 0.88 ? "fuel" : "repair";
  const lane = Math.floor(Math.random() * LANES);
  g.pickups.push({
    x: laneCenter(lane),
    y: -40,
    r: kind === "coin" ? 14 : 17,
    kind,
    vy: 170 + Math.random() * 90,
    pulse: Math.random() * 10,
  });
}

function spawnObstacle(g: GameData) {
  const kind: ObstacleKind = Math.random() < 0.5 ? "cone" : Math.random() < 0.78 ? "barrel" : "oil";
  // Never drop a hazard into a lane that just spawned a car — it would be
  // hidden behind the traffic and feel like an unavoidable hit.
  const busy = new Set(g.traffic.filter((v) => v.y < 200).map((v) => v.lane));
  const lanes = Array.from({ length: LANES }, (_, i) => i).filter((lane) => !busy.has(lane));
  if (!lanes.length) return;
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  g.obstacles.push({
    x: laneCenter(lane),
    y: -50,
    w: kind === "oil" ? 62 : 34,
    h: kind === "oil" ? 38 : 42,
    kind,
    vy: 190 + Math.random() * 120,
  });
}

function spawnPolice(g: GameData) {
  if (g.police.length >= g.wanted + 1) return;
  const lane = Math.floor(Math.random() * LANES);
  const police = makeVehicle(lane, -130, "police");
  police.vy = 250 + g.wanted * 35;
  g.police.push(police);
}

function scoreNearMiss(g: GameData, vehicle: Vehicle, audio: ReturnType<typeof createAudio>) {
  if (vehicle.nearMissed || vehicle.y < g.player.y - 14 || vehicle.y > g.player.y + 26) return;
  const dx = Math.abs(vehicle.x - g.player.x);
  const danger = dx < (vehicle.w + g.player.w) * 0.86;
  if (!danger || rectsOverlap(g.player, vehicle)) return;
  vehicle.nearMissed = true;
  g.combo += 1;
  g.comboTime = 0;
  g.multiplier = clamp(1 + g.combo * 0.12, 1, 5);
  const gain = Math.floor(80 * g.multiplier);
  g.score += gain;
  g.player.nitro = clamp(g.player.nitro + 4, 0, 100);
  addParticles(g, g.player.x, g.player.y - 35, NEON_CYAN, 7, 150);
  spawnShock(g, (g.player.x + vehicle.x) / 2, (g.player.y + vehicle.y) / 2, NEON_CYAN, 0.85);
  if (g.combo > 1 && g.combo % 3 === 0) {
    spawnPopup(g, g.player.x, g.player.y - 62, `COMBO ×${g.combo}`, NEON_AMBER, 28);
    flashGame(g, NEON_CYAN, 0.09);
    if (!g.muted) audio.combo();
  } else {
    spawnPopup(g, (g.player.x + vehicle.x) / 2, g.player.y - 44, `NEAR MISS +${gain}`, NEON_CYAN, 14);
  }
  if (!g.muted) audio.miss();
}

function hitPlayer(g: GameData, audio: ReturnType<typeof createAudio>) {
  if (g.player.invulnerable > 0 || g.phase !== "playing") return;
  const fatal = g.player.health <= 1 || g.crashes + 1 >= 3;
  g.player.health -= 1;
  g.crashes += 1;
  g.combo = 0;
  g.comboTime = 0;
  g.multiplier = 1;
  g.player.invulnerable = 1.8;
  g.player.speed = Math.max(160, g.player.speed * 0.45);
  g.player.fuel = Math.max(g.player.fuel, 22);
  g.player.vx = 0;
  g.shake = fatal ? 0.9 : 0.62;
  g.flashA = 0;
  flashGame(g, NEON_RED, fatal ? 0.55 : 0.34);
  addParticles(g, g.player.x, g.player.y, NEON_RED, 48, 440);
  addParticles(g, g.player.x, g.player.y, NEON_AMBER, 26, 280);
  spawnShock(g, g.player.x, g.player.y, NEON_RED, 1.35);
  spawnPopup(g, g.player.x, g.player.y - 70, fatal ? "WRECKED!" : "-1 HP", NEON_RED, fatal ? 36 : 24);
  if (fatal) {
    if (!g.muted) audio.wreck();
  } else if (!g.muted) {
    audio.hit();
  }
  g.phase = "crashing";
  g.crashTimer = fatal ? 1.0 : 0.6;
  g.crashTo = fatal ? "gameover" : "upgrade";
}

function updateGame(g: GameData, keys: Keys, dt: number, audio: ReturnType<typeof createAudio>) {
  g.time += dt;
  g.roadScroll = (g.roadScroll + g.player.speed * dt) % 90;
  g.shake = Math.max(0, g.shake - dt);
  g.flashA = Math.max(0, g.flashA - dt * 2.2);

  for (const p of g.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life -= dt;
  }
  g.particles = g.particles.filter((p) => p.life > 0);

  for (const p of g.popups) {
    p.y -= 46 * dt;
    p.life -= dt * 1.05;
  }
  g.popups = g.popups.filter((p) => p.life > 0);

  for (const s of g.shockwaves) {
    s.r += s.vr * dt;
    s.vr *= 0.9;
    s.life -= dt * 1.4;
  }
  g.shockwaves = g.shockwaves.filter((s) => s.life > 0);

  if (g.phase === "countdown") {
    g.countdown -= dt;
    if (g.countdown <= 0) {
      g.phase = "playing";
      if (!g.goFired) {
        g.goFired = true;
        spawnPopup(g, W / 2, H * 0.42, "GO!", NEON_CYAN, 66);
        spawnShock(g, W / 2, H * 0.6, NEON_CYAN, 1.1);
        flashGame(g, NEON_CYAN, 0.14);
        if (!g.muted) audio.go();
      }
    }
    return;
  }

  // Slow-mo wreck before we cut to the upgrade / game-over screen.
  if (g.phase === "crashing") {
    g.crashTimer -= dt;
    g.player.speed = Math.max(0, g.player.speed - 620 * dt);
    g.shake = Math.max(g.shake, 0.24);
    if (g.crashTimer <= 0) {
      const target = g.crashTo || "upgrade";
      g.phase = target;
      g.crashTo = null;
      if (target === "gameover") {
        if (g.score > g.best) {
          g.best = g.score;
          g.newBest = true;
          try {
            localStorage.setItem(STORAGE_KEY, String(g.best));
          } catch {
            /* ignore */
          }
        }
      } else {
        g.upgrades = makeUpgradePool();
      }
    }
    return;
  }

  for (const rival of g.rivals) {
    const personalityBoost =
      rival.personality === "fast" ? 70 : rival.personality === "aggressive" ? 45 : rival.personality === "wild" ? Math.sin(g.time * 3) * 80 : 20;
    rival.distance = (rival.distance || 0) + (g.player.speed + personalityBoost - 30 + Math.random() * 24) * dt;
    rival.y += ((H - 150 - ((rival.distance || 0) - g.distance) * 0.08) - rival.y) * dt * 1.8;
    rival.changeTimer -= dt;
    if (rival.changeTimer <= 0) {
      rival.lane = clamp(rival.lane + (Math.random() < 0.5 ? -1 : 1), 0, LANES - 1);
      rival.changeTimer = 0.8 + Math.random() * 2.8;
    }
    rival.x += (laneCenter(rival.lane) - rival.x) * dt * 4;
  }

  if (g.phase !== "playing") return;

  const nitroActive = keys.nitro && g.player.nitro > 0;
  const targetSpeed = nitroActive ? g.stats.maxSpeed + 230 * g.stats.nitroPower : g.stats.maxSpeed;
  if (keys.up) g.player.speed += g.stats.acceleration * dt;
  else g.player.speed += 95 * dt;
  if (keys.down) g.player.speed -= g.stats.brakes * dt;
  g.player.speed = clamp(g.player.speed, 190, targetSpeed);

  if (nitroActive) {
    g.player.nitro = clamp(g.player.nitro - 28 * dt, 0, 100);
    g.shake = Math.max(g.shake, 0.08);
    addParticles(g, g.player.x, g.player.y + 48, "#22d3ee", 2, 130);
  } else {
    g.player.nitro = clamp(g.player.nitro + 4 * dt, 0, 100);
  }

  const steer = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
  g.player.vx += steer * g.stats.handling * dt;
  g.player.vx *= keys.down ? 0.88 : 0.92;
  g.player.x = clamp(g.player.x + g.player.vx * dt, ROAD_X + 32, ROAD_X + ROAD_W - 32);
  g.player.invulnerable = Math.max(0, g.player.invulnerable - dt);

  g.distance += g.player.speed * dt * 0.018;
  g.scenery += g.player.speed * dt;
  g.score += Math.floor((g.player.speed * dt * 0.08 + g.multiplier * dt * 6) * g.multiplier);

  const nextLevel = Math.max(1, Math.floor(g.distance / 450) + 1);
  if (nextLevel > g.lastLevel) {
    g.lastLevel = nextLevel;
    spawnPopup(g, W / 2, H * 0.3, `LEVEL ${nextLevel}`, NEON_PINK, 42);
    spawnShock(g, W / 2, H * 0.55, NEON_PINK, 1.15);
    flashGame(g, NEON_PINK, 0.18);
    if (!g.muted) audio.level();
  }
  g.level = nextLevel;

  const nextWanted = clamp(Math.floor(g.distance / 650) + 1, 1, 5);
  if (nextWanted > g.lastWanted) {
    g.lastWanted = nextWanted;
    spawnPopup(g, W / 2, H * 0.44, `${nextWanted === 5 ? "MAX " : ""}WANTED ${nextWanted === 5 ? "★★★★★" : "★".repeat(nextWanted)}`, NEON_RED, 30);
    flashGame(g, NEON_RED, 0.16);
    if (!g.muted) audio.warn();
  }
  g.wanted = nextWanted;
  g.player.fuel -= (0.75 + (nitroActive ? 1.4 : 0)) * dt;
  if (g.player.fuel <= 0) hitPlayer(g, audio);

  // Let an idle combo ease off so near-misses stay a risk/reward choice.
  if (g.combo > 0) {
    g.comboTime += dt;
    if (g.comboTime > 3.5) {
      g.combo -= 1;
      g.comboTime = 0;
      g.multiplier = clamp(1 + g.combo * 0.12, 1, 5);
    }
  }

  g.spawnTimer -= dt;
  g.pickupTimer -= dt;
  g.obstacleTimer -= dt;
  g.policeTimer -= dt;
  const density = Math.max(0.18, 0.82 - g.level * 0.045);
  if (g.spawnTimer <= 0) {
    spawnTraffic(g);
    if (g.level > 3 && Math.random() < 0.22) spawnTraffic(g);
    g.spawnTimer = density + Math.random() * 0.45;
  }
  if (g.pickupTimer <= 0) {
    spawnPickup(g);
    g.pickupTimer = 1.4 + Math.random() * 1.6;
  }
  if (g.obstacleTimer <= 0) {
    spawnObstacle(g);
    g.obstacleTimer = Math.max(0.95, 2.6 - g.level * 0.12) + Math.random();
  }
  if (g.policeTimer <= 0) {
    spawnPolice(g);
    g.policeTimer = Math.max(2.2, 7.5 - g.wanted * 0.8);
  }

  const scrollSpeed = g.player.speed * 0.72;
  for (const vehicle of g.traffic) {
    vehicle.y += (scrollSpeed - vehicle.vy) * dt;
    vehicle.changeTimer -= dt;
    if (vehicle.changeTimer <= 0 && g.level > 2 && Math.random() < 0.42) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      const target = clamp(vehicle.lane + dir, 0, LANES - 1);
      const nearPlayer = Math.abs(vehicle.y - g.player.y) < 170;
      const targetCenter = laneCenter(target);
      const cutsPlayer = Math.abs(targetCenter - g.player.x) < (vehicle.w + g.player.w) * 0.72;
      const blocked = g.traffic.some(
        (other) => other !== vehicle && other.lane === target && Math.abs(other.y - vehicle.y) < 140
      );
      // Never swerve into the lane the player occupies at close range.
      if (!(nearPlayer && cutsPlayer) && !blocked) vehicle.lane = target;
      vehicle.changeTimer = 1.5 + Math.random() * 3;
    }
    vehicle.x += (laneCenter(vehicle.lane) - vehicle.x) * dt * 2.5;
    scoreNearMiss(g, vehicle, audio);
  }
  g.traffic = g.traffic.filter((vehicle) => vehicle.y < H + 150);

  for (const police of g.police) {
    const chase = clamp((g.player.x - police.x) * 0.65, -180, 180);
    police.x += chase * dt;
    police.y += (scrollSpeed - police.vy + (police.y < g.player.y ? 220 : -60)) * dt;
    police.x = clamp(police.x, ROAD_X + 30, ROAD_X + ROAD_W - 30);
    scoreNearMiss(g, police, audio);
  }
  g.police = g.police.filter((police) => police.y < H + 150 && police.y > -220);

  for (const pickup of g.pickups) {
    pickup.y += (scrollSpeed - pickup.vy) * dt;
    pickup.pulse += dt;
    if (Math.hypot(g.player.x - pickup.x, g.player.y - pickup.y) < pickup.r + 34) {
      if (pickup.kind === "coin") {
        g.coins += 1;
        g.score += 130;
        spawnPopup(g, pickup.x, pickup.y - 18, "+130", NEON_AMBER, 13);
        if (!g.muted) audio.coin();
      }
      if (pickup.kind === "nitro") {
        g.player.nitro = clamp(g.player.nitro + 32, 0, 100);
        if (!g.muted) audio.power();
      }
      if (pickup.kind === "fuel") {
        g.player.fuel = clamp(g.player.fuel + 28, 0, 100);
        if (!g.muted) audio.power();
      }
      if (pickup.kind === "repair") {
        g.player.health = clamp(g.player.health + 1, 0, 3);
        spawnPopup(g, pickup.x, pickup.y - 18, "+1 HP", NEON_CYAN, 14);
        if (!g.muted) audio.power();
      }
      addParticles(g, pickup.x, pickup.y, pickup.kind === "coin" ? "#facc15" : "#22d3ee", 14, 210);
      pickup.y = H + 999;
    }
  }
  g.pickups = g.pickups.filter((pickup) => pickup.y < H + 80);

  for (const obstacle of g.obstacles) {
    obstacle.y += (scrollSpeed - obstacle.vy) * dt;
    if (hitsPlayer(g.player, obstacle)) {
      if (obstacle.kind === "oil") {
        g.player.vx += (Math.random() < 0.5 ? -1 : 1) * 420;
        obstacle.y = H + 999;
        g.shake = 0.18;
      } else {
        obstacle.y = H + 999;
        hitPlayer(g, audio);
      }
    }
  }
  g.obstacles = g.obstacles.filter((obstacle) => obstacle.y < H + 80);

  for (const vehicle of [...g.traffic, ...g.police]) {
    if (hitsPlayer(g.player, vehicle)) {
      vehicle.y = H + 999;
      hitPlayer(g, audio);
      break;
    }
  }
}

function drawVehicle(ctx: CanvasRenderingContext2D, v: Vehicle, t: number) {
  ctx.save();
  ctx.translate(v.x, v.y);

  // Add subtle tilting based on lateral movement
  const tiltAngle = clamp(v.vx / 800, -0.08, 0.08);
  ctx.rotate(tiltAngle);

  // Add suspension bob effect
  const suspensionBob = Math.sin(t * 8 + v.y * 0.05) * 0.5;
  ctx.translate(0, suspensionBob);

  // Vehicle-specific styling
  if (v.kind === "bike") {
    drawBike(ctx, v, t);
  } else if (v.kind === "police") {
    drawPoliceCar(ctx, v, t);
  } else if (v.kind === "rival") {
    drawRivalCar(ctx, v, t);
  } else {
    drawRegularVehicle(ctx, v, t);
  }

  ctx.restore();
}

function hexToRgba(hex: string, alpha: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawBike(ctx: CanvasRenderingContext2D, v: Vehicle, t: number) {
  const hw = v.w / 2;
  const hh = v.h / 2;
  const h = v.h;

  // Sleek tapered motorcycle body
  const bodyGradient = ctx.createLinearGradient(-hw, -hh, hw, hh);
  bodyGradient.addColorStop(0, v.color);
  bodyGradient.addColorStop(0.5, shadeColor(v.color, -15));
  bodyGradient.addColorStop(1, shadeColor(v.color, -30));
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(-hw + 4, -hh);
  ctx.quadraticCurveTo(0, -hh - h * 0.08, hw - 4, -hh);
  ctx.quadraticCurveTo(hw, -hh * 0.4, hw * 0.88, 0);
  ctx.quadraticCurveTo(hw, hh * 0.55, hw * 0.8, hh);
  ctx.lineTo(-hw * 0.8, hh);
  ctx.quadraticCurveTo(-hw, hh * 0.55, -hw * 0.88, 0);
  ctx.quadraticCurveTo(-hw, -hh * 0.4, -hw + 4, -hh);
  ctx.closePath();
  ctx.fill();

  // Fuel tank highlight
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, -hh * 0.2, hw * 0.52, hh * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Front headlight
  ctx.save();
  ctx.shadowColor = "#fef9c3";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#fef9c3";
  ctx.beginPath();
  ctx.arc(0, -hh + 3, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Wheels: tire + rim + spokes
  for (const wy of [-hh + 11, hh - 11]) {
    ctx.fillStyle = "#0b1220";
    ctx.beginPath();
    ctx.arc(0, wy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.arc(0, wy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, wy - 4.5);
    ctx.lineTo(0, wy + 4.5);
    ctx.moveTo(-4.5, wy);
    ctx.lineTo(4.5, wy);
    ctx.stroke();
  }

  // Handlebar
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-hw + 2, -hh + 16);
  ctx.lineTo(hw - 2, -hh + 16);
  ctx.stroke();

  // Rider: helmet + torso + arms
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.beginPath();
  ctx.ellipse(0, -hh + 24, 7.5, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = v.color;
  ctx.beginPath();
  ctx.arc(0, -hh + 24, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(15,23,42,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-hw + 3, -hh + 20);
  ctx.lineTo(-3, -hh + 26);
  ctx.moveTo(hw - 3, -hh + 20);
  ctx.lineTo(3, -hh + 26);
  ctx.stroke();
}

// Draws the four wheels of a top-down car. Tires poke slightly past the body
// so it reads as a car rather than a rounded slab.
function drawCarWheels(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  const tireW = w * 0.17;
  const tireH = h * 0.15;
  const frontY = -hh + h * 0.14;
  const rearY = hh - h * 0.14;

  for (const [wx, wy] of [
    [-hw * 0.9, frontY],
    [hw * 0.9, frontY],
    [-hw * 0.9, rearY],
    [hw * 0.9, rearY],
  ]) {
    // Tire
    ctx.fillStyle = "#0b1220";
    ctx.beginPath();
    ctx.roundRect(wx - tireW / 2, wy - tireH / 2, tireW, tireH, 4);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();
    // Rim
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.roundRect(wx - tireW * 0.34, wy - tireH * 0.34, tireW * 0.68, tireH * 0.68, 3);
    ctx.fill();
    // Rim centre cap
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.arc(wx, wy, Math.min(tireW, tireH) * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draws the cabin greenhouse (windshield + roof + rear window) of a top-down
// car. This is the strongest "this is a car" visual cue.
function drawCabin(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  opts: { police?: boolean; stripe?: boolean } = {}
) {
  const hw = w / 2;
  const hh = h / 2;
  const glassFront = -hh + h * 0.27;
  const glassBack = hh - h * 0.25;
  const ghFront = hw * 0.26; // windshield (front) half-width
  const ghRear = hw * 0.36; // rear glass half-width

  // Greenhouse glass — wider at the rear, slanted at the front
  ctx.fillStyle = "rgba(7,18,38,0.95)";
  ctx.beginPath();
  ctx.moveTo(-ghFront, glassFront);
  ctx.lineTo(ghFront, glassFront);
  ctx.lineTo(ghRear, glassBack);
  ctx.lineTo(-ghRear, glassBack);
  ctx.closePath();
  ctx.fill();

  // Glass reflection streak
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.moveTo(-ghFront + hw * 0.06, glassFront + h * 0.02);
  ctx.lineTo(-ghFront * 0.3, glassFront + h * 0.02);
  ctx.lineTo(-ghRear * 0.3, glassFront + h * 0.09);
  ctx.lineTo(-ghFront + hw * 0.06, glassFront + h * 0.09);
  ctx.closePath();
  ctx.fill();

  // Roof panel (body colour) between windshield and rear glass
  const roofFront = -hh + h * 0.37;
  const roofBack = hh - h * 0.33;
  const roofInset = hw * 0.3;
  const roofGrad = ctx.createLinearGradient(-roofInset, 0, roofInset, 0);
  roofGrad.addColorStop(0, shadeColor(color, -22));
  roofGrad.addColorStop(0.5, shadeColor(color, 8));
  roofGrad.addColorStop(1, shadeColor(color, -26));
  ctx.fillStyle = roofGrad;
  ctx.beginPath();
  ctx.roundRect(-roofInset, roofFront, roofInset * 2, roofBack - roofFront, 5);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-roofInset, roofFront, roofInset * 2, roofBack - roofFront, 5);
  ctx.stroke();

  // Racing stripes along the body
  if (opts.stripe) {
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    for (const sx of [-roofInset * 0.38, roofInset * 0.38]) {
      ctx.beginPath();
      ctx.roundRect(sx - 2, -hh + 2, 4, h - 4, 2);
      ctx.fill();
    }
  }

  // Police light bar on the roof
  if (opts.police) {
    const phase = Math.floor(t * 8) % 2;
    const barY = (roofFront + roofBack) / 2;
    ctx.save();
    ctx.shadowColor = phase ? "#ef4444" : "#3b82f6";
    ctx.shadowBlur = 20;
    ctx.fillStyle = phase ? "#ef4444" : "#3b82f6";
    ctx.beginPath();
    ctx.roundRect(-roofInset * 0.78, barY - 3.5, roofInset * 1.56, 7, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = phase ? "#fecaca" : "#bfdbfe";
    ctx.beginPath();
    ctx.arc(-roofInset * 0.5, barY, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(roofInset * 0.5, barY, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Full top-down car renderer shared by traffic, rivals and police.
function drawTopDownCar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  t: number,
  opts: { sport?: boolean; police?: boolean; stripe?: boolean } = {}
) {
  const hw = w / 2;
  const hh = h / 2;

  // Coloured halo behind police / rivals
  if (opts.police || opts.sport) {
    const haloColor = opts.police ? (Math.floor(t * 4) % 2 ? "#ef4444" : "#3b82f6") : color;
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 1.3);
    halo.addColorStop(0, hexToRgba(haloColor, 0.28));
    halo.addColorStop(1, hexToRgba(haloColor, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, w * 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "rgba(2,6,23,0.4)";
  ctx.beginPath();
  ctx.roundRect(-hw, -hh + 2, w, h, 10);
  ctx.fill();
  ctx.restore();

  // Body with a subtle front taper
  const bodyGrad = ctx.createLinearGradient(-hw, 0, hw, 0);
  bodyGrad.addColorStop(0, shadeColor(color, -34));
  bodyGrad.addColorStop(0.22, shadeColor(color, -12));
  bodyGrad.addColorStop(0.45, shadeColor(color, 14));
  bodyGrad.addColorStop(0.7, shadeColor(color, -4));
  bodyGrad.addColorStop(1, shadeColor(color, -38));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  const nose = hw * 0.9;
  ctx.moveTo(-nose, -hh + 4);
  ctx.quadraticCurveTo(0, -hh - h * 0.06, nose, -hh + 4);
  ctx.quadraticCurveTo(hw + h * 0.05, -hh * 0.35, hw * 0.98, hh * 0.25);
  ctx.quadraticCurveTo(hw * 0.95, hh, hw * 0.96, hh - 3);
  ctx.quadraticCurveTo(0, hh + h * 0.05, -hw * 0.96, hh - 3);
  ctx.quadraticCurveTo(-hw * 0.95, hh, -hw * 0.98, hh * 0.25);
  ctx.quadraticCurveTo(-hw - h * 0.05, -hh * 0.35, -nose, -hh + 4);
  ctx.closePath();
  ctx.fill();

  // Hood / bumper seam
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-hw * 0.6, -hh + h * 0.11);
  ctx.quadraticCurveTo(0, -hh + h * 0.07, hw * 0.6, -hh + h * 0.11);
  ctx.stroke();

  // Side-skirt shading (gives the body volume)
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.beginPath();
  ctx.roundRect(-hw, -hh * 0.2, hw * 0.14, h * 0.4, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(hw * 0.86, -hh * 0.2, hw * 0.14, h * 0.4, 3);
  ctx.fill();

  // Wheels
  drawCarWheels(ctx, w, h);

  // Cabin greenhouse
  drawCabin(ctx, w, h, t, color, opts);

  // Side mirrors
  ctx.fillStyle = shadeColor(color, -10);
  ctx.beginPath();
  ctx.roundRect(-hw - 3, -hh + h * 0.3, 6, 9, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(hw - 3, -hh + h * 0.3, 6, 9, 2);
  ctx.fill();

  // Headlights
  ctx.save();
  ctx.shadowColor = "#fef9c3";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#fef9c3";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.44, -hh + 3, w * 0.18, h * 0.05, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(hw * 0.44 - w * 0.18, -hh + 3, w * 0.18, h * 0.05, 3);
  ctx.fill();
  ctx.restore();

  // Taillights
  ctx.save();
  ctx.shadowColor = "#f87171";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.46, hh - 3 - h * 0.05, w * 0.2, h * 0.05, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(hw * 0.46 - w * 0.2, hh - 3 - h * 0.05, w * 0.2, h * 0.05, 3);
  ctx.fill();
  ctx.restore();

  // Sport rear wing
  if (opts.sport) {
    ctx.fillStyle = shadeColor(color, -25);
    ctx.beginPath();
    ctx.roundRect(-hw * 0.7, hh - 7, w * 0.98, 5, 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawPoliceCar(ctx: CanvasRenderingContext2D, v: Vehicle, t: number) {
  drawTopDownCar(ctx, v.w, v.h, v.color, t, { police: true });
}

function drawRivalCar(ctx: CanvasRenderingContext2D, v: Vehicle, t: number) {
  drawTopDownCar(ctx, v.w, v.h, v.color, t, { sport: true, stripe: true });
}

function drawRegularVehicle(ctx: CanvasRenderingContext2D, v: Vehicle, t: number) {
  drawTopDownCar(ctx, v.w, v.h, v.color, t, {});
}

function drawPlayer(ctx: CanvasRenderingContext2D, g: GameData) {
  const p = g.player;
  if (p.invulnerable > 0 && Math.floor(g.time * 18) % 2 === 0) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(clamp(p.vx / 900, -0.18, 0.18));

  const hw = p.w / 2;
  const hh = p.h / 2;
  const h = p.h;
  const color = "#0891b2";

  // Cyan halo around the player
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w * 1.45);
  halo.addColorStop(0, "rgba(34,211,238,0.32)");
  halo.addColorStop(1, "rgba(34,211,238,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, p.w * 1.45, 0, Math.PI * 2);
  ctx.fill();

  // Drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "rgba(2,6,23,0.4)";
  ctx.beginPath();
  ctx.roundRect(-hw, -hh + 2, p.w, p.h, 11);
  ctx.fill();
  ctx.restore();

  // Sleek body with tapered nose
  const bodyGrad = ctx.createLinearGradient(-hw, 0, hw, 0);
  bodyGrad.addColorStop(0, "#164e63");
  bodyGrad.addColorStop(0.22, "#0e7490");
  bodyGrad.addColorStop(0.45, "#06b6d4");
  bodyGrad.addColorStop(0.72, "#0891b2");
  bodyGrad.addColorStop(1, "#155e75");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  const nose = hw * 0.86;
  ctx.moveTo(-nose, -hh + 5);
  ctx.quadraticCurveTo(0, -hh - h * 0.07, nose, -hh + 5);
  ctx.quadraticCurveTo(hw + h * 0.06, -hh * 0.4, hw * 0.96, hh * 0.3);
  ctx.quadraticCurveTo(hw * 0.92, hh, hw * 0.94, hh - 4);
  ctx.quadraticCurveTo(0, hh + h * 0.06, -hw * 0.94, hh - 4);
  ctx.quadraticCurveTo(-hw * 0.92, hh, -hw * 0.96, hh * 0.3);
  ctx.quadraticCurveTo(-hw - h * 0.06, -hh * 0.4, -nose, -hh + 5);
  ctx.closePath();
  ctx.fill();

  // Body highlight outline
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-hw, -hh + 2, p.w, p.h, 11);
  ctx.stroke();

  // Hood scoop on the nose
  ctx.fillStyle = "#0f766e";
  ctx.beginPath();
  ctx.roundRect(-9, -hh + 8, 18, 11, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Side intake vents
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.98, -hh * 0.16, hw * 0.14, h * 0.32, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(hw * 0.84, -hh * 0.16, hw * 0.14, h * 0.32, 3);
  ctx.fill();

  // Wheels + cabin (shared renderer pieces for a consistent car look)
  drawCarWheels(ctx, p.w, p.h);
  drawCabin(ctx, p.w, p.h, g.time, color, {});

  // Headlights
  ctx.save();
  ctx.shadowColor = "#fef08a";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.ellipse(-hw * 0.4, -hh + 5, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hw * 0.4, -hh + 5, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Taillights
  ctx.save();
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.46, hh - 10, p.w * 0.22, 5, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(hw * 0.46 - p.w * 0.22, hh - 10, p.w * 0.22, 5, 2);
  ctx.fill();
  ctx.restore();

  // Rear wing
  ctx.fillStyle = "#0e7490";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.72, hh - 6, p.w * 0.72, 6, 2);
  ctx.fill();
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.72, hh - 6, p.w * 0.72, 2, 1);
  ctx.fill();

  // Nitro flames when active
  if (g.player.nitro > 50) {
    const nitroIntensity = (g.player.nitro - 50) / 50;
    const flameLength = 20 + Math.random() * 15 * nitroIntensity;

    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 20 * nitroIntensity;

    const flameGradient = ctx.createLinearGradient(0, p.h / 2, 0, p.h / 2 + flameLength);
    flameGradient.addColorStop(0, `rgba(34,211,238,${0.9 * nitroIntensity})`);
    flameGradient.addColorStop(0.5, `rgba(59,130,246,${0.7 * nitroIntensity})`);
    flameGradient.addColorStop(1, "rgba(59,130,246,0)");

    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.moveTo(-8, p.h / 2);
    ctx.lineTo(0, p.h / 2 + flameLength);
    ctx.lineTo(8, p.h / 2);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  // Speed lines around car when moving fast
  if (p.speed > 500) {
    const speedIntensity = (p.speed - 500) / 220;
    ctx.strokeStyle = `rgba(34,211,238,${speedIntensity * 0.3})`;
    ctx.lineWidth = 1;

    for (let i = 0; i < 4; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const y = -p.h / 2 + 10 + i * 15;
      ctx.beginPath();
      ctx.moveTo(side * (p.w / 2 + 5), y);
      ctx.lineTo(side * (p.w / 2 + 15 + Math.random() * 10), y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

let scanlineTile: HTMLCanvasElement | null = null;

// Scrolling neon canyon wall on one side of the highway. Windows are lit
// deterministically (hash01) so they stream past smoothly with zero flicker.
function drawCanyonSide(ctx: CanvasRenderingContext2D, g: GameData, left: boolean) {
  const x0 = left ? 0 : ROAD_X + ROAD_W;
  const x1 = left ? ROAD_X : W;
  const w = x1 - x0;

  // Tower face, slightly lighter toward the road so the neon spills over it.
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, "#0c0326");
  base.addColorStop(0.5, "#130636");
  base.addColorStop(1, "#0a021c");
  ctx.fillStyle = base;
  ctx.fillRect(x0, 0, w, H);

  // Pink neon bleeding from the road edge onto the wall.
  const spill = ctx.createLinearGradient(left ? x1 : x0, 0, left ? x1 - 30 : x0 + 30, 0);
  spill.addColorStop(0, "rgba(255,45,149,0.18)");
  spill.addColorStop(1, "rgba(255,45,149,0)");
  ctx.fillStyle = spill;
  ctx.fillRect(left ? x1 - 30 : x0, 0, 30, H);

  const cols = 3;
  const pad = 12;
  const cw = (w - pad * 2) / cols;
  const rh = 34;
  const firstRow = Math.floor((g.scenery - 60) / rh);
  const lastRow = Math.ceil((g.scenery + H + 60) / rh);
  for (let c = 0; c < cols; c += 1) {
    for (let r = firstRow; r <= lastRow; r += 1) {
      const y = r * rh - g.scenery;
      const h = hash01((c + 1) * 91.73 + r * 7.13);
      if (h < 0.34) {
        const color = h < 0.15 ? NEON_CYAN : h < 0.25 ? NEON_PINK : NEON_AMBER;
        ctx.fillStyle = hexToRgba(color, 0.35 + h * 0.5);
        ctx.fillRect(x0 + pad + c * cw, y, cw * 0.76, 13);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(x0 + pad + c * cw + 1, y + 1, cw * 0.76 - 2, 2);
      } else if (h > 0.965) {
        // Occasional glowing billboard
        ctx.fillStyle = hexToRgba(h > 0.98 ? NEON_PINK : NEON_CYAN, 0.85);
        ctx.fillRect(x0 + pad * 2, y, w - pad * 4, 16);
      }
    }
  }

  // Crisp vertical trim: cyan on the road side, pink on the outer edge.
  const roadTrim = left ? x1 - 3 : x0 + 1;
  const outerTrim = left ? x0 + 2 : x1 - 4;
  ctx.strokeStyle = hexToRgba(NEON_CYAN, 0.5);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(roadTrim, 0);
  ctx.lineTo(roadTrim, H);
  ctx.stroke();
  ctx.strokeStyle = hexToRgba(NEON_PINK, 0.3);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(outerTrim, 0);
  ctx.lineTo(outerTrim, H);
  ctx.stroke();
}

function drawScanlines(ctx: CanvasRenderingContext2D) {
  if (!scanlineTile) {
    const tile = document.createElement("canvas");
    tile.width = 1;
    tile.height = 3;
    const tctx = tile.getContext("2d");
    if (tctx) {
      tctx.clearRect(0, 0, 1, 3);
      tctx.fillStyle = "rgba(0,0,0,0.55)";
      tctx.fillRect(0, 2, 1, 1);
    }
    scanlineTile = tile;
  }
  const pat = ctx.createPattern(scanlineTile, "repeat");
  if (!pat) return;
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawGame(ctx: CanvasRenderingContext2D, g: GameData) {
  const speedNorm = clamp(g.player.speed / 760, 0, 1);
  const rush = 0.45 + speedNorm * 0.55;

  // ---- dusk sky base ----
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#0a0122");
  sky.addColorStop(0.4, "#17063f");
  sky.addColorStop(0.7, "#22054c");
  sky.addColorStop(1, "#0b0220");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Neon tower walls rushing past on both sides
  drawCanyonSide(ctx, g, true);
  drawCanyonSide(ctx, g, false);

  // ---- asphalt ----
  const asphalt = ctx.createLinearGradient(ROAD_X, 0, ROAD_X + ROAD_W, 0);
  asphalt.addColorStop(0, "#0d0526");
  asphalt.addColorStop(0.5, "#06020f");
  asphalt.addColorStop(1, "#0d0526");
  ctx.fillStyle = asphalt;
  ctx.fillRect(ROAD_X, 0, ROAD_W, H);

  // Faint sheen bands drifting down the asphalt (additive, very subtle)
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const sheenSpan = 120;
  const sheenPhase = g.scenery % sheenSpan;
  for (let i = -1; i <= Math.ceil(H / sheenSpan); i += 1) {
    const sy = i * sheenSpan + sheenPhase;
    const grad = ctx.createLinearGradient(0, sy, 0, sy + sheenSpan);
    grad.addColorStop(0, "rgba(124,58,237,0)");
    grad.addColorStop(0.5, "rgba(124,58,237,0.05)");
    grad.addColorStop(1, "rgba(124,58,237,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(ROAD_X, sy, ROAD_W, sheenSpan);
  }
  ctx.restore();

  // ---- neon road edges (pink outer halo + cyan hotline) ----
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(255,45,149,0.15)";
  ctx.beginPath();
  ctx.moveTo(ROAD_X, 0);
  ctx.lineTo(ROAD_X, H);
  ctx.moveTo(ROAD_X + ROAD_W, 0);
  ctx.lineTo(ROAD_X + ROAD_W, H);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = NEON_CYAN;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = NEON_CYAN;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(ROAD_X, 0);
  ctx.lineTo(ROAD_X, H);
  ctx.moveTo(ROAD_X + ROAD_W, 0);
  ctx.lineTo(ROAD_X + ROAD_W, H);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ---- lane markers ----
  for (let lane = 1; lane < LANES; lane += 1) {
    const x = ROAD_X + lane * (ROAD_W / LANES);
    ctx.strokeStyle = "rgba(215,226,255,0.5)";
    ctx.lineWidth = 3;
    ctx.setLineDash([34, 56]); // matches the 90px roadScroll wrap -> seamless
    ctx.lineDashOffset = -g.roadScroll;
    ctx.shadowColor = "rgba(103,232,249,0.35)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(x, -90);
    ctx.lineTo(x, H + 90);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.setLineDash([]);

  // ---- neon dawn at the far end (retro striped-sun glow) ----
  {
    const glowY = H * 0.18;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const dawn = ctx.createRadialGradient(W / 2, glowY, 0, W / 2, glowY, 380 * rush);
    dawn.addColorStop(0, "rgba(255,45,149,0.3)");
    dawn.addColorStop(0.45, "rgba(168,85,247,0.16)");
    dawn.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = dawn;
    ctx.fillRect(0, 0, W, H * 0.6);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(4,1,12,0.5)";
    const gap = 26;
    const band = 42;
    const bandOffset = (g.time * 46) % (gap + band);
    for (let y = -band + bandOffset; y < H * 0.45; y += gap + band) {
      ctx.fillRect(ROAD_X, y, ROAD_W, band);
    }
    ctx.restore();
  }

  // ---- distance fog over the far road (cars emerge from the dark) ----
  const fog = ctx.createLinearGradient(0, H * 0.08, 0, H * 0.55);
  fog.addColorStop(0, "rgba(3,2,10,0.58)");
  fog.addColorStop(1, "rgba(3,2,10,0)");
  ctx.fillStyle = fog;
  ctx.fillRect(ROAD_X - 2, H * 0.08, ROAD_W + 4, H * 0.47);

  // ---- player headlight beams ----
  {
    ctx.save();
    const px = g.player.x;
    const py = g.player.y;
    const beamLen = 220 + speedNorm * 160;
    for (const side of [-1, 1]) {
      const hx = px + side * g.player.w * 0.34;
      const beam = ctx.createLinearGradient(0, py, 0, py - beamLen);
      beam.addColorStop(0, "rgba(255,244,214,0.2)");
      beam.addColorStop(1, "rgba(255,244,214,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(hx - 26, py - 6);
      ctx.lineTo(hx + 26, py - 6);
      ctx.lineTo(hx + side * 54, py - beamLen);
      ctx.lineTo(hx - side * 54, py - beamLen);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  for (const pickup of g.pickups) {
    const pulse = 1 + Math.sin(pickup.pulse * 8) * 0.15;
    ctx.save();
    ctx.translate(pickup.x, pickup.y);
    ctx.scale(pulse, pulse);

    ctx.shadowBlur = 25;
    ctx.shadowColor = pickup.kind === "coin" ? "#facc15" : pickup.kind === "fuel" ? "#22c55e" : pickup.kind === "repair" ? "#f43f5e" : "#38bdf8";

    const pickupGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, pickup.r);
    const baseColor = pickup.kind === "coin" ? "#facc15" : pickup.kind === "fuel" ? "#22c55e" : pickup.kind === "repair" ? "#f43f5e" : "#38bdf8";
    pickupGrad.addColorStop(0, baseColor);
    pickupGrad.addColorStop(0.7, shadeColor(baseColor, -20));
    pickupGrad.addColorStop(1, shadeColor(baseColor, -40));
    ctx.fillStyle = pickupGrad;

    ctx.beginPath();
    ctx.arc(0, 0, pickup.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, pickup.r * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#082f49";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pickup.kind === "coin" ? "$" : pickup.kind === "fuel" ? "F" : pickup.kind === "repair" ? "+" : "N", 0, 1);
    ctx.restore();
  }

  for (const obstacle of g.obstacles) {
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);

    if (obstacle.kind === "oil") {
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(-obstacle.w / 2, -obstacle.h / 2, obstacle.w, obstacle.h, 20);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.ellipse(-obstacle.w / 4, -obstacle.h / 4, obstacle.w / 3, obstacle.h / 3, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const baseColor = obstacle.kind === "barrel" ? "#f97316" : "#facc15";
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 12;

      const obsGrad = ctx.createLinearGradient(-obstacle.w / 2, -obstacle.h / 2, obstacle.w / 2, obstacle.h / 2);
      obsGrad.addColorStop(0, baseColor);
      obsGrad.addColorStop(0.5, shadeColor(baseColor, -15));
      obsGrad.addColorStop(1, shadeColor(baseColor, -30));
      ctx.fillStyle = obsGrad;

      ctx.beginPath();
      ctx.roundRect(-obstacle.w / 2, -obstacle.h / 2, obstacle.w, obstacle.h, 8);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(-obstacle.w / 2 + 6, -5, obstacle.w - 12, 10);

      ctx.fillStyle = "rgba(0,0,0,0.3)";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-obstacle.w / 2 + 8 + i * 12, -obstacle.h / 2 + 12, 6, obstacle.h - 24);
      }
    }
    ctx.restore();
  }

  // ---- wet-road neon reflections (additive, drawn before cars) ----
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const reflect = (x: number, y: number, halfW: number, color: string, len: number, alpha: number) => {
    if (y < -20 || y > H + 30) return;
    const grad = ctx.createLinearGradient(0, y, 0, y + len);
    grad.addColorStop(0, hexToRgba(color, alpha));
    grad.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, halfW, len * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  const tailLen = (base: number) => base + speedNorm * 46;
  for (const v of g.traffic) reflect(v.x, v.y + v.h / 2, v.w * 0.4, NEON_RED, tailLen(20), 0.16);
  for (const p of g.police) {
    const c = Math.floor(g.time * 4) % 2 ? NEON_RED : "#3b82f6";
    reflect(p.x, p.y + p.h / 2, p.w * 0.4, c, tailLen(26), 0.2);
  }
  for (const r of g.rivals) {
    if (r.y < H - 60) reflect(r.x, r.y + r.h / 2, r.w * 0.4, r.color, tailLen(18), 0.12);
  }
  reflect(g.player.x, g.player.y + g.player.h / 2, 12, NEON_RED, tailLen(32), 0.34);
  if (g.player.nitro > 50) {
    reflect(g.player.x, g.player.y + g.player.h / 2, 9, NEON_CYAN, tailLen(44), 0.4);
  }
  ctx.restore();

  for (const rival of g.rivals) drawVehicle(ctx, rival, g.time);
  for (const vehicle of g.traffic) drawVehicle(ctx, vehicle, g.time);
  for (const police of g.police) drawVehicle(ctx, police, g.time);
  drawPlayer(ctx, g);

  // ---- motion streaks (deterministic — no per-frame flicker) ----
  if (speedNorm > 0.3) {
    const intensity = (speedNorm - 0.3) / 0.7;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const travel = g.time * (110 + speedNorm * 950);
    for (let i = 0; i < 16; i += 1) {
      const sx = ROAD_X + 26 + hash01(i * 17.31) * (ROAD_W - 52);
      const len = 30 + hash01(i * 91.7) * 80;
      const cyc = (travel * (0.9 + hash01(i * 3.71) * 0.5) + i * 173) % (H + len);
      const sy = H - cyc;
      const a = (0.05 + 0.15 * intensity) * (0.55 + hash01(i * 57.1) * 0.7);
      ctx.fillStyle = hexToRgba(i % 3 === 0 ? NEON_PINK : NEON_CYAN, a);
      ctx.fillRect(sx, sy, 2, len);
    }
    ctx.restore();
  }

  // ---- shockwave rings ----
  for (const s of g.shockwaves) {
    const ratio = clamp(s.life / s.maxLife, 0, 1);
    ctx.strokeStyle = hexToRgba(s.color, ratio * 0.85);
    ctx.lineWidth = 1 + 4 * ratio;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ---- vignette (with low-health red pulse) ----
  const lowPulse =
    g.player.health <= 1 && ["playing", "crashing"].includes(g.phase)
      ? 0.1 + Math.sin(g.time * 6) * 0.07
      : 0;
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(2,0,10,0.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  if (lowPulse > 0.01) {
    const red = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.72);
    red.addColorStop(0, "rgba(255,77,109,0)");
    red.addColorStop(1, hexToRgba(NEON_RED, lowPulse));
    ctx.fillStyle = red;
    ctx.fillRect(0, 0, W, H);
  }

  // ---- particles ----
  for (const particle of g.particles) {
    const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.globalAlpha = lifeRatio;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 7 * lifeRatio;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * lifeRatio * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;

  // ---- floating popups (score / combo / level) ----
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  for (const pop of g.popups) {
    const fade = clamp(pop.life / (pop.maxLife * 0.6), 0, 1);
    ctx.globalAlpha = fade;
    ctx.font = `900 ${pop.size}px system-ui`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(4,1,12,0.85)";
    ctx.strokeText(pop.text, pop.x, pop.y);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, pop.x, pop.y);
  }
  ctx.globalAlpha = 1;

  // ---- full-screen impact flash ----
  if (g.flashA > 0.01) {
    ctx.fillStyle = hexToRgba(g.flashColor, Math.min(0.5, g.flashA));
    ctx.fillRect(0, 0, W, H);
  }

  drawScanlines(ctx);
}

function makeSnapshot(g: GameData): Snapshot {
  const leaderboard = [
    { name: "You", distance: g.distance, color: "#22d3ee" },
    ...g.rivals.map((rival) => ({
      name: (rival as Vehicle & { name?: string }).name || "AI",
      distance: rival.distance || 0,
      color: rival.color,
    })),
  ].sort((a, b) => b.distance - a.distance);

  return {
    phase: g.phase,
    score: g.score,
    best: g.best,
    distance: g.distance,
    health: g.player.health,
    fuel: g.player.fuel,
    nitro: g.player.nitro,
    level: g.level,
    combo: g.combo,
    multiplier: g.multiplier,
    wanted: g.wanted,
    coins: g.coins,
    crashes: g.crashes,
    countdown: g.countdown,
    newBest: g.newBest,
    upgrades: g.upgrades,
    leaderboard,
    muted: g.muted,
  };
}

export function NeonHighwayRacerClient() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef(createAudio());
  const keysRef = useRef<Keys>({ left: false, right: false, up: false, down: false, nitro: false });
  const gameRef = useRef<GameData>(makeGame());
  const lastRef = useRef(0);
  const [snapshot, setSnapshot] = useState<Snapshot>(() => makeSnapshot(gameRef.current));
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
      const best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
      gameRef.current.best = best;
      setSnapshot(makeSnapshot(gameRef.current));
    } catch {
      /* ignore */
    }
  }, []);

  const startRun = useCallback(() => {
    const old = gameRef.current;
    gameRef.current = makeGame(old.best, old.muted);
    gameRef.current.phase = "countdown";
    keysRef.current = { left: false, right: false, up: false, down: false, nitro: false };
    lastRef.current = performance.now();
    if (!gameRef.current.muted) audioRef.current.start();
    setSnapshot(makeSnapshot(gameRef.current));
  }, []);

  const togglePause = useCallback(() => {
    const g = gameRef.current;
    if (g.phase === "playing") g.phase = "paused";
    else if (g.phase === "paused") {
      g.phase = "playing";
      lastRef.current = performance.now();
    }
    setSnapshot(makeSnapshot(g));
  }, []);

  const chooseUpgrade = (upgrade: Upgrade) => {
    const g = gameRef.current;
    upgrade.apply(g);
    g.phase = "countdown";
    g.countdown = 2;
    g.player.invulnerable = 1.5;
    g.player.fuel = clamp(g.player.fuel + 18, 0, 100);
    g.upgrades = [];
    lastRef.current = performance.now();
    setSnapshot(makeSnapshot(g));
  };

  const toggleMute = () => {
    const g = gameRef.current;
    g.muted = !g.muted;
    setSnapshot(makeSnapshot(g));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, rect.width);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(width * (H / W) * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${width * (H / W)}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    let raf = 0;
    let stateTimer = 0;
    const frame = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000 || 0, 0.033);
      lastRef.current = now;
      const g = gameRef.current;
      updateGame(g, keysRef.current, dt, audioRef.current);

      const scale = canvas.width / W;
      const sx = g.shake ? (Math.random() - 0.5) * g.shake * 24 : 0;
      const sy = g.shake ? (Math.random() - 0.5) * g.shake * 18 : 0;
      ctx.setTransform(scale, 0, 0, scale, sx, sy);
      drawGame(ctx, g);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      stateTimer += dt;
      if (stateTimer > 0.08 || g.phase !== snapshot.phase) {
        stateTimer = 0;
        setSnapshot(makeSnapshot(g));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const setKey = (event: KeyboardEvent, value: boolean) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") keysRef.current.left = value;
      if (event.code === "ArrowRight" || event.code === "KeyD") keysRef.current.right = value;
      if (event.code === "ArrowUp" || event.code === "KeyW") keysRef.current.up = value;
      if (event.code === "ArrowDown" || event.code === "KeyS") keysRef.current.down = value;
      if (event.code === "Space" || event.code === "ShiftLeft" || event.code === "ShiftRight") keysRef.current.nitro = value;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS", "Space"].includes(event.code)) {
        event.preventDefault();
      }
    };
    const onDown = (event: KeyboardEvent) => {
      if (event.code === "Enter" && ["ready", "gameover"].includes(gameRef.current.phase)) startRun();
      if (event.code === "KeyP" || event.code === "Escape") togglePause();
      setKey(event, true);
    };
    const onUp = (event: KeyboardEvent) => setKey(event, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [snapshot.phase, startRun, togglePause]);

  const setTouchKey = (key: keyof Keys, value: boolean) => {
    keysRef.current[key] = value;
  };

  const overlayTitle =
    snapshot.phase === "ready"
      ? "Neon Highway Racer"
      : snapshot.phase === "paused"
        ? "Paused"
        : snapshot.phase === "upgrade"
          ? "Pit Stop Upgrade"
          : snapshot.phase === "gameover"
            ? "Run Complete"
            : Math.ceil(snapshot.countdown).toString();

  return (
    <div className="space-y-4">
      <style>{`@keyframes ch-countdown-bump { 0% { transform: scale(1.7); opacity: 0; } 16% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }`}</style>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div
          ref={wrapRef}
          className="relative overflow-hidden rounded-xl border border-cyan-400/40 bg-slate-950 shadow-2xl shadow-cyan-950/30"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <canvas ref={canvasRef} className="block h-full w-full touch-none" />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 text-white sm:p-4">
            <div className="rounded-lg border border-cyan-300/30 bg-slate-950/70 px-3 py-2 font-mono text-sm font-bold shadow-lg shadow-cyan-500/10 backdrop-blur sm:text-lg">
              {snapshot.score.toLocaleString()}
            </div>
            <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold sm:text-sm">
              <span className="rounded-lg bg-slate-950/70 px-3 py-2 backdrop-blur">HP {snapshot.health}/3</span>
              <span className="rounded-lg bg-slate-950/70 px-3 py-2 backdrop-blur">Lvl {snapshot.level}</span>
              <span className="rounded-lg bg-slate-950/70 px-3 py-2 backdrop-blur">Wanted {"★".repeat(snapshot.wanted)}</span>
            </div>
          </div>

          {snapshot.phase === "countdown" && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/55 text-center text-white">
              <div
                key={Math.ceil(snapshot.countdown)}
                className="text-7xl font-black text-cyan-300 sm:text-8xl"
                style={{
                  animation: "ch-countdown-bump 0.95s ease-out",
                  textShadow: "0 0 34px rgba(34,211,238,0.9), 0 0 90px rgba(255,45,149,0.6)",
                }}
              >
                {Math.ceil(snapshot.countdown)}
              </div>
              <p className="mt-4 animate-pulse text-xs font-bold uppercase tracking-[0.4em] text-white/75">Get ready</p>
            </div>
          )}

          {["ready", "paused", "upgrade", "gameover"].includes(snapshot.phase) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto bg-slate-950/68 px-3 py-2 text-center text-white backdrop-blur-[2px] sm:gap-4 sm:p-5">
              <h2 className="text-3xl font-black sm:text-5xl">{overlayTitle}</h2>
              {snapshot.phase === "upgrade" ? (
                <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                  {snapshot.upgrades.map((upgrade) => (
                    <button
                      key={upgrade.label}
                      onClick={() => chooseUpgrade(upgrade)}
                      className="rounded-lg border border-cyan-300/30 bg-white/12 p-4 text-left transition hover:bg-cyan-400/20"
                    >
                      <span className="block font-bold text-cyan-100">{upgrade.label}</span>
                      <span className="mt-1 block text-sm text-white/75">{upgrade.detail}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <p className="max-w-xl text-sm text-white/82 sm:text-base">
                    Dodge traffic, outrun police, collect fuel and nitro, and chase risky near-miss combos.
                    Three crashes end the run.
                  </p>
                  {snapshot.newBest && <p className="rounded-full bg-cyan-300 px-4 py-1 text-sm font-bold text-cyan-950">New best score</p>}
                  <button
                    onClick={startRun}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    <Play className="h-5 w-5" />
                    {snapshot.phase === "ready" ? "Start Race" : "Restart"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile touch controls live below the canvas so they never cover the car */}
        {snapshot.phase === "playing" && (
          <div className="sm:hidden">
            <div className="flex items-stretch gap-1.5 rounded-xl border border-cyan-400/30 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
              <DashButton label="Left" shape="paddle" onChange={(value) => setTouchKey("left", value)}>
                <ArrowLeft className="h-6 w-6" />
              </DashButton>
              <DashButton label="Brake" shape="pedal" onChange={(value) => setTouchKey("down", value)}>
                <ArrowDown className="h-5 w-5" />
              </DashButton>
              <DashButton label="Gas" shape="pedal" onChange={(value) => setTouchKey("up", value)}>
                <ArrowUp className="h-5 w-5" />
              </DashButton>
              <DashButton label="Nitro" shape="led" onChange={(value) => setTouchKey("nitro", value)}>
                N
              </DashButton>
              <DashButton label="Right" shape="paddle" onChange={(value) => setTouchKey("right", value)}>
                <ArrowRight className="h-6 w-6" />
              </DashButton>
            </div>
          </div>
        )}

        <aside className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Distance" value={`${Math.floor(snapshot.distance)} m`} />
            <Stat label="Best" value={snapshot.best.toLocaleString()} />
            <Stat label="Fuel" value={`${Math.ceil(snapshot.fuel)}%`} />
            <Stat label="Nitro" value={`${Math.ceil(snapshot.nitro)}%`} />
            <Stat label="Combo" value={`${snapshot.combo}x`} />
            <Stat label="Coins" value={snapshot.coins.toString()} />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span>Live Race</span>
              <span>{snapshot.multiplier.toFixed(1)}x</span>
            </div>
            {snapshot.leaderboard.slice(0, 8).map((driver, index) => (
              <div key={driver.name} className="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-sm dark:bg-slate-900">
                <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <span style={{ backgroundColor: driver.color }} className="h-2.5 w-2.5 rounded-full" />
                  {index + 1}. {driver.name}
                </span>
                <span className="font-mono text-xs text-slate-500">{Math.floor(driver.distance)}m</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">WASD / arrows</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Space / Shift nitro</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">P pause</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={toggleMute}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            {snapshot.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            Sound
          </button>
          <button
            onClick={togglePause}
            disabled={!["playing", "paused"].includes(snapshot.phase)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100"
          >
            {snapshot.phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {snapshot.phase === "paused" ? "Resume" : "Pause"}
          </button>
          <button
            onClick={startRun}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-bold text-white transition hover:bg-cyan-600"
          >
            <RotateCcw className="h-4 w-4" />
            Restart
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>

    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-900">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}
