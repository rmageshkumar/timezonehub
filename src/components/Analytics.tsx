"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const recordPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "pageview",
            data: { path: pathname },
            device: getDeviceType(),
            browser: getBrowser(),
            referrer: document.referrer || undefined,
          }),
        });
      } catch {
        // silently fail
      }
    };

    recordPageView();
  }, [pathname]);

  return null;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}
