import { getDSTInfo } from "../src/lib/dst";

const zones = [
  "America/New_York", "Europe/London", "Australia/Sydney",
  "Asia/Kolkata", "Asia/Tokyo", "Europe/Paris",
  "America/Los_Angeles", "Pacific/Auckland",
];

zones.forEach((tz) => {
  const info = getDSTInfo(tz);
  const nextInfo = info.daysUntilTransition !== null
    ? " | Next transition: " + info.daysUntilTransition + " days"
    : "";
  console.log(
    tz.padEnd(30),
    "DST:", info.isDST ? "ON " : "OFF",
    "| Status:", info.status.padEnd(45),
    nextInfo,
    info.transitionIsImminent ? " ⚠️ IMMINENT" : ""
  );
});
