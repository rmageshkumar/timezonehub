import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date | string, timezone?: string): string {
  const d = new Date(date);
  try {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone || undefined,
    });
  } catch {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

export function getGMTOffset(offset: string): string {
  if (!offset) return "UTC";
  const num = parseFloat(offset);
  if (isNaN(num)) return "UTC";
  const sign = num >= 0 ? "+" : "";
  const hours = Math.floor(Math.abs(num));
  const minutes = Math.round((Math.abs(num) - hours) * 60);
  if (minutes === 0) return `GMT${sign}${hours}`;
  return `GMT${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
}

export function isWeekend(date?: Date): boolean {
  const d = date || new Date();
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function isBusinessHours(date?: Date, timezone?: string): boolean {
  const d = date || new Date();
  let hours: number;
  try {
    const parts = d.toLocaleString("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    hours = parseInt(parts);
  } catch {
    hours = d.getHours();
  }
  return hours >= 9 && hours < 17;
}

export function isDaytime(date?: Date, timezone?: string): boolean {
  const d = date || new Date();
  let hours: number;
  try {
    const parts = d.toLocaleString("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    hours = parseInt(parts);
  } catch {
    hours = d.getHours();
  }
  return hours >= 6 && hours < 18;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
