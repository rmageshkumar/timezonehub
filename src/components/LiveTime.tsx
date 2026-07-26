"use client";

import { useEffect, useState } from "react";

export function LiveTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: timezone,
          })
        );
      } catch {
        setTime("--:--");
      }
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
      {time || "--:--"}
    </span>
  );
}
