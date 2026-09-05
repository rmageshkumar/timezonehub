"use client";

import { useState } from "react";
import type { ReactNode } from "react";

// Shared on-screen touch button for the mobile game pads (Neon Highway Racer,
// Orbit Rescue, ...). Press-and-hold semantics: fires onChange(true) while
// pressed and onChange(false) on release / cancel / leave.
export function DashButton({
  label,
  children,
  shape,
  onChange,
}: {
  label: string;
  children: ReactNode;
  shape: "paddle" | "pedal" | "led";
  onChange: (value: boolean) => void;
}) {
  const [pressed, setPressed] = useState(false);
  const press = (value: boolean) => {
    setPressed(value);
    onChange(value);
  };

  const shapeClass =
    shape === "paddle"
      ? "flex-[1.15] rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-800 to-slate-900"
      : shape === "led"
        ? "flex-1 rounded-full border-2 border-red-500/70 bg-gradient-to-b from-red-600 to-red-800 shadow-[0_0_14px_rgba(239,68,68,0.55)]"
        : "flex-1 rounded-md border border-slate-700/80 bg-gradient-to-b from-slate-700 to-slate-900";

  return (
    <button
      aria-label={label}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        press(true);
      }}
      onPointerUp={() => press(false)}
      onPointerCancel={() => press(false)}
      onPointerLeave={() => press(false)}
      className={`touch-none ${shapeClass} flex h-16 select-none items-center justify-center font-bold text-white transition-transform ${
        pressed ? "scale-95 brightness-125" : "shadow-lg"
      } ${shape === "led" ? "text-sm tracking-wide" : ""}`}
    >
      {children}
    </button>
  );
}
