/**
 * Seed script: creates 12 ClockHive blog guides (timezone + Scrum/Agile)
 * and writes their SVG cover/diagram images into public/blog/.
 *
 * Run: node scripts/seed-blog-guides.js
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");

// Match src/lib/prisma.ts: use the Turso (libsql) adapter when TURSO_DATABASE_URL
// is set (what the Next dev server reads), otherwise fall back to local SQLite.
let p;
const tursoUrl = process.env.TURSO_DATABASE_URL;
if (tursoUrl) {
  const adapter = new PrismaLibSQL({
    url: tursoUrl,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
  p = new PrismaClient({ adapter });
} else {
  p = new PrismaClient();
}
const BLOG_DIR = path.join(__dirname, "..", "public", "blog");

function ensureDir() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
}

/** Escape XML special chars so text is safe inside an SVG file (strict XML) */
function xmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Build a clean SVG cover for a blog post */
function coverSvg({ emoji, title, subtitle, from, to, accent = "#ffffff" }) {
  const t = xmlEscape(title);
  const s = xmlEscape(subtitle);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="90" r="200" fill="#ffffff" opacity="0.07"/>
  <circle cx="150" cy="560" r="240" fill="#ffffff" opacity="0.06"/>
  <circle cx="620" cy="330" r="260" fill="#000000" opacity="0.05"/>
  <text x="600" y="235" font-size="118" text-anchor="middle">${emoji}</text>
  <rect x="240" y="315" width="720" height="6" rx="3" fill="url(#line)"/>
  <text x="600" y="420" font-size="56" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-weight="700" fill="#ffffff" text-anchor="middle">${t}</text>
  <text x="600" y="492" font-size="28" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-weight="400" fill="#ffffff" opacity="0.85" text-anchor="middle">${s}</text>
  <text x="600" y="568" font-size="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-weight="600" fill="#ffffff" opacity="0.6" text-anchor="middle">ClockHive — Guides</text>
</svg>
`;
}

function writeImage(name, svg) {
  const file = path.join(BLOG_DIR, name);
  fs.writeFileSync(file, svg, "utf8");
  console.log("wrote image:", "/blog/" + name);
}

/** Small diagram SVGs used inline inside post content */
const DIAGRAMS = {
  "timezone-offsets.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="360" viewBox="0 0 1000 360">
  <rect width="1000" height="360" fill="#f8fafc"/>
  <text x="500" y="50" font-size="30" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="700" fill="#0f172a" text-anchor="middle">The same instant, different local times</text>
  <line x1="60" y1="120" x2="940" y2="120" stroke="#cbd5e1" stroke-width="4"/>
  <line x1="500" y1="90" x2="500" y2="320" stroke="#ef4444" stroke-width="3" stroke-dasharray="8 8"/>
  <text x="500" y="78" font-size="20" font-family="Segoe UI,Arial,sans-serif" fill="#ef4444" text-anchor="middle" font-weight="700">UTC 12:00</text>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <rect x="60" y="150" width="300" height="80" rx="12" fill="#eef2ff"/>
    <text x="210" y="190" font-size="26" font-weight="700" fill="#1e3a8a">04:00</text>
    <text x="210" y="218" font-size="18" fill="#64748b">New York (UTC-8)</text>
    <rect x="640" y="150" width="300" height="80" rx="12" fill="#f0fdf4"/>
    <text x="790" y="190" font-size="26" font-weight="700" fill="#166534">17:30</text>
    <text x="790" y="218" font-size="18" fill="#64748b">Chennai (UTC+5:30)</text>
  </g>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <rect x="60" y="260" width="300" height="80" rx="12" fill="#fff7ed"/>
    <text x="210" y="300" font-size="26" font-weight="700" fill="#9a3412">21:00</text>
    <text x="210" y="328" font-size="18" fill="#64748b">Sydney (UTC+10)</text>
    <rect x="640" y="260" width="300" height="80" rx="12" fill="#faf5ff"/>
    <text x="790" y="300" font-size="26" font-weight="700" fill="#6b21a8">01:00</text>
    <text x="790" y="328" font-size="18" fill="#64748b">Auckland (UTC+13)</text>
  </g>
</svg>`,
  "dst-change.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="340" viewBox="0 0 1000 340">
  <rect width="1000" height="340" fill="#fffdf5"/>
  <text x="500" y="55" font-size="30" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="700" fill="#0f172a" text-anchor="middle">Spring forward, fall back</text>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <rect x="80" y="100" width="380" height="120" rx="14" fill="#fef3c7"/>
    <text x="270" y="150" font-size="30" font-weight="700" fill="#92400e">☀️ Spring forward</text>
    <text x="270" y="185" font-size="18" fill="#78350f">+1 hour — clocks go from 02:00 to 03:00</text>
    <text x="270" y="210" font-size="16" fill="#a16207">We lose an hour of sleep</text>
    <rect x="540" y="100" width="380" height="120" rx="14" fill="#e0f2fe"/>
    <text x="730" y="150" font-size="30" font-weight="700" fill="#075985">🌙 Fall back</text>
    <text x="730" y="185" font-size="18" fill="#0c4a6e">-1 hour — clocks go from 02:00 back to 01:00</text>
    <text x="730" y="210" font-size="16" fill="#0369a1">We gain an hour of sleep</text>
  </g>
  <text x="500" y="300" font-size="20" font-family="Segoe UI,Arial,sans-serif" fill="#64748b" text-anchor="middle">Offsets change twice a year for most of Europe &amp; North America</text>
</svg>`,
  "scrum-cycle.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420">
  <rect width="1000" height="420" fill="#faf5ff"/>
  <text x="500" y="50" font-size="30" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="700" fill="#0f172a" text-anchor="middle">The Scrum sprint loop</text>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <rect x="60" y="90" width="200" height="110" rx="14" fill="#ede9fe"/>
    <text x="160" y="135" font-size="26">🎯</text>
    <text x="160" y="170" font-size="22" font-weight="700" fill="#5b21b6">Sprint Planning</text>
    <rect x="400" y="90" width="200" height="110" rx="14" fill="#e0f2fe"/>
    <text x="500" y="135" font-size="26">🗓️</text>
    <text x="500" y="170" font-size="22" font-weight="700" fill="#075985">Daily Standup</text>
    <rect x="740" y="90" width="200" height="110" rx="14" fill="#dcfce7"/>
    <text x="840" y="135" font-size="26">🚀</text>
    <text x="840" y="170" font-size="22" font-weight="700" fill="#166534">Sprint Review</text>
    <rect x="260" y="270" width="200" height="110" rx="14" fill="#fce7f3"/>
    <text x="360" y="315" font-size="26">🔍</text>
    <text x="360" y="350" font-size="22" font-weight="700" fill="#9d174d">Retrospective</text>
  </g>
  <g stroke="#94a3b8" stroke-width="4" fill="none">
    <path d="M 270 145 L 390 145"/>
    <path d="M 610 145 L 730 145"/>
    <path d="M 840 205 L 840 250 L 470 250 L 470 260"/>
    <path d="M 250 270 L 250 205 L 60 205 L 60 205"/>
    <text x="430" y="235" font-size="20" fill="#64748b" font-family="Segoe UI,Arial,sans-serif">repeat</text>
  </g>
</svg>`,
  "story-points-scale.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300" viewBox="0 0 1000 300">
  <rect width="1000" height="300" fill="#f0fdf4"/>
  <text x="500" y="55" font-size="30" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="700" fill="#0f172a" text-anchor="middle">The classic story-point scale</text>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <g><rect x="60" y="120" width="120" height="90" rx="12" fill="#dcfce7"/><text x="120" y="165" font-size="34" font-weight="700" fill="#166534">1</text><text x="120" y="195" font-size="16" fill="#15803d">trivial</text></g>
    <g><rect x="200" y="120" width="120" height="90" rx="12" fill="#bbf7d0"/><text x="260" y="165" font-size="34" font-weight="700" fill="#15803d">2</text><text x="260" y="195" font-size="16" fill="#166534">small</text></g>
    <g><rect x="340" y="120" width="120" height="90" rx="12" fill="#86efac"/><text x="400" y="165" font-size="34" font-weight="700" fill="#166534">3</text><text x="400" y="195" font-size="16" fill="#166534">medium</text></g>
    <g><rect x="480" y="120" width="120" height="90" rx="12" fill="#fde68a"/><text x="540" y="165" font-size="34" font-weight="700" fill="#92400e">5</text><text x="540" y="195" font-size="16" fill="#b45309">large</text></g>
    <g><rect x="620" y="120" width="120" height="90" rx="12" fill="#fdba74"/><text x="680" y="165" font-size="34" font-weight="700" fill="#9a3412">8</text><text x="680" y="195" font-size="16" fill="#9a3412">x-large</text></g>
    <g><rect x="760" y="120" width="120" height="90" rx="12" fill="#fca5a5"/><text x="820" y="165" font-size="34" font-weight="700" fill="#b91c1c">13</text><text x="820" y="195" font-size="16" fill="#b91c1c">big — split me</text></g>
  </g>
  <text x="500" y="260" font-size="20" font-family="Segoe UI,Arial,sans-serif" fill="#64748b" text-anchor="middle">Relative, not absolute — a 5 is always bigger than a 3, never "5 hours"</text>
</svg>`,
  "sprint-planning.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300" viewBox="0 0 1000 300">
  <rect width="1000" height="300" fill="#fff7ed"/>
  <text x="500" y="55" font-size="30" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="700" fill="#0f172a" text-anchor="middle">Backlog → Sprint Backlog</text>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <rect x="80" y="110" width="320" height="120" rx="14" fill="#ffedd5"/>
    <text x="240" y="150" font-size="24" font-weight="700" fill="#9a3412">📥 Product Backlog</text>
    <text x="240" y="182" font-size="18" fill="#c2410c">everything we might build</text>
    <text x="240" y="210" font-size="16" fill="#ea580c">(prioritised, not committed)</text>
    <rect x="600" y="110" width="320" height="120" rx="14" fill="#dcfce7"/>
    <text x="760" y="150" font-size="24" font-weight="700" fill="#166534">✅ Sprint Backlog</text>
    <text x="760" y="182" font-size="18" fill="#15803d">what we commit to this sprint</text>
    <text x="760" y="210" font-size="16" fill="#16a34a">(pulled in at planning)</text>
  </g>
  <text x="500" y="255" font-size="26" fill="#64748b" text-anchor="middle">← the team picks →</text>
  <path d="M 410 170 L 590 170" stroke="#0f172a" stroke-width="6" fill="none" marker-end="url(#arr)"/>
  <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#0f172a"/></marker></defs>
</svg>`,
  "agile-vs-waterfall.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="320" viewBox="0 0 1000 320">
  <rect width="1000" height="320" fill="#f0fdfa"/>
  <text x="500" y="55" font-size="30" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="700" fill="#0f172a" text-anchor="middle">Waterfall vs Agile delivery</text>
  <g font-family="Segoe UI,Arial,sans-serif" text-anchor="middle">
    <text x="220" y="100" font-size="22" font-weight="700" fill="#b91c1c">Waterfall — one big reveal</text>
    <rect x="80" y="120" width="280" height="50" rx="8" fill="#fecaca"/><text x="220" y="152" font-size="16" fill="#991b1b">6 months, then... 💥</text>
    <rect x="80" y="185" width="280" height="50" rx="8" fill="#fee2e2"/><text x="220" y="217" font-size="16" fill="#991b1b">users see it at the end</text>
    <text x="720" y="100" font-size="22" font-weight="700" fill="#15803d">Agile — small, frequent</text>
    <rect x="400" y="120" width="70" height="50" rx="8" fill="#bbf7d0"/><text x="435" y="152" font-size="15" fill="#166534">2w</text>
    <rect x="478" y="120" width="70" height="50" rx="8" fill="#bbf7d0"/><text x="513" y="152" font-size="15" fill="#166534">2w</text>
    <rect x="556" y="120" width="70" height="50" rx="8" fill="#bbf7d0"/><text x="591" y="152" font-size="15" fill="#166534">2w</text>
    <rect x="634" y="120" width="70" height="50" rx="8" fill="#bbf7d0"/><text x="669" y="152" font-size="15" fill="#166534">2w</text>
    <rect x="712" y="120" width="70" height="50" rx="8" fill="#86efac"/><text x="747" y="152" font-size="15" fill="#166534">2w</text>
    <text x="700" y="200" font-size="16" fill="#166534">✅ shipped every sprint</text>
  </g>
  <text x="500" y="285" font-size="20" font-family="Segoe UI,Arial,sans-serif" fill="#64748b" text-anchor="middle">Agile bets on feedback; Waterfall bets on getting it right the first time</text>
</svg>`,
};

function writeDiagrams() {
  Object.entries(DIAGRAMS).forEach(([name, svg]) => writeImage(name, svg));
}

// ---------------------------------------------------------------------------
// Post definitions
// ---------------------------------------------------------------------------
const posts = [
  // ============ TIMEZONE GUIDES ============
  {
    categorySlug: "timezone-tips",
    categoryName: "Timezone Tips",
    categoryDesc:
      "Plain-English explainers about time zones, UTC, GMT and daylight saving — for teams and travelers.",
    title: "What Is a Time Zone? A Plain-English Explanation",
    slug: "what-is-a-time-zone",
    emoji: "🌍",
    cover: ["#0f172a", "#6366f1"],
    excerpt:
      "Time zones explained like a colleague would explain them — why the world is split into chunks, why India is +5:30 and Nepal +5:45, and why your 3 PM standup keeps hurting.",
    tags: ["timezone", "time-zones", "utc-offset", "remote-work", "explainer"],
    seoTitle: "What Is a Time Zone? A Plain-English Guide | ClockHive",
    seoDescription:
      "What is a time zone, really? Learn why the world is split into time zones, why offsets aren't always whole hours, and how to think about them for remote teams.",
    seoKeywords:
      "what is a time zone, time zone explained, utc offset, why time zones exist, remote team timezones",
    content: `
<p>Okay, let's talk time zones. Not the textbook version you half-forgot from school — the version you actually need when your colleague in Chennai keeps joining the standup at 11 PM. (Yes, that's a real story. We'll get there.)</p>

<h2 id="the-short-answer">The short answer</h2>
<p>A time zone is basically a region of the world that agrees to use the same local time. The sun rises at different moments depending on where you stand, so somewhere along the line humanity decided: "let's not all just pick random clocks, let's chunk the planet and give each chunk an offset from a common reference."</p>
<p>That common reference is UTC — but that's its own post. For now, think of a time zone as "how many hours (and sometimes minutes!) your local clock is ahead of or behind UTC."</p>

<h2 id="why-we-need-them">Why we even need them</h2>
<p>Back in the day, every town basically ran on its own sun time. Noon was whenever the sun was highest, and nobody cared that the next town over was a few minutes different. That worked fine until trains arrived and suddenly timetables became a nightmare. You can't run a railway when every station has a different "12:00".</p>
<p>So in the 1800s the world standardised — the Greenwich Meridian became the anchor, and the planet got sliced into roughly 24 time zones, one per hour. It's not perfectly even, and honestly it never was, but it fixed the trains.</p>

<h2 id="offsets-are-weird">Offsets aren't always whole hours</h2>
<p>Here's where it gets fun. You'd think every time zone is a clean UTC+1 or UTC-5, right? Nope.</p>
<ul>
<li><strong>India</strong> is UTC+5:30. Half an hour. Because of politics and history, not science.</li>
<li><strong>Nepal</strong> is UTC+5:45. Forty-five minutes! It's one of only a few places on Earth with a :45 offset.</li>
<li><strong>Australia</strong> has three different offsets across its states at once. Good luck with a national meeting.</li>
</ul>
<p>So when someone says "let's sync at 3 PM your time," the math is rarely a clean round number. That's the whole reason apps like ClockHive exist — because humans are awful at adding 5:30 to things.</p>

<h2 id="real-example">A real example, because this is personal</h2>
<p>I once worked on a team spread across London, Chennai and Sydney. We naively scheduled the daily standup at 3 PM London time. That meant Chennai was at 8:30 PM (fine-ish) and Sydney was at 1 AM the next day. The Sydney dev joined for exactly one standup looking like a zombie, then we fixed it. The lesson: don't schedule for one timezone and hope the rest cope.</p>
<p>Check the overlap, not just your own clock. Most of the time there's a two-hour window that works for everyone — it just requires looking at all three cities at once, not guessing.</p>

<h2 id="diagram">Same moment, different clocks</h2>
<img src="/blog/timezone-offsets.svg" alt="Diagram showing the same UTC instant displayed as different local times in New York, Chennai, Sydney and Auckland" class="w-full h-auto rounded-xl my-6" />
<p>That red dashed line is the <em>same instant</em> in all four cities. Same moment in the universe — four different numbers on the wall. This is the mental model that makes remote work survivable.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Is a time zone the same as an offset?</strong> Not quite. The offset is the number; the time zone also includes rules about daylight saving, history, and political boundaries. But for everyday life, "time zone = offset" is close enough.</p>
<p><strong>How many time zones are there?</strong> More than 24! Because of half-hour and :45 offsets plus weird political splits, the real count is around 37-38 across the world.</p>
<p><strong>Why is my friend's "same time" always different?</strong> Because their offset from UTC is different. The sun doesn't care about your meeting.</p>

<p><em>Tip: Open two or three cities in the <strong>ClockHive Business Hours</strong> tool before your next cross-timezone call — it shows you the shared window instantly instead of doing mental math.</em></p>
`,
  },
  {
    categorySlug: "timezone-tips",
    categoryName: "Timezone Tips",
    categoryDesc:
      "Plain-English explainers about time zones, UTC, GMT and daylight saving — for teams and travelers.",
    title: "What Is UTC Time? (And Why Your Code Uses It)",
    slug: "what-is-utc-time",
    emoji: "🕐",
    cover: ["#1e3a8a", "#0891b2"],
    excerpt:
      "UTC is the anchor every clock on Earth is measured against. Here's what it actually is, why your logs and APIs live in UTC, and why it is not a time zone.",
    tags: ["utc", "time-standard", "engineering", "explainer", "timestamps"],
    seoTitle: "What Is UTC Time? The Anchor Behind Every Clock | ClockHive",
    seoDescription:
      "UTC explained simply: what it is, why it's not a time zone, why developers store timestamps in UTC, and how it relates to GMT.",
    seoKeywords:
      "what is utc, coordinated universal time, utc time explained, why use utc, utc vs gmt, utc timestamps",
    content: `
<p>If you've ever looked at a server log and seen a timestamp ending in a big friendly "Z", that's UTC. And if you've ever wondered what the deal is — it's not a time zone, it's the <em>reference</em> all time zones point at. Let me explain it the way I'd explain it to a teammate over coffee.</p>

<h2 id="what-it-is">What UTC actually is</h2>
<p>UTC stands for Coordinated Universal Time (yes, the acronym doesn't match the words — blame the French, CUT sounded bad and TUC was already taken, so they landed on a compromise). It's a <strong>time standard</strong>: a single agreed-upon "now" that every time zone on Earth is described relative to.</p>
<p>When we say Chennai is UTC+5:30, we literally mean "take the UTC time, add five and a half hours, and that's what a clock in Chennai should show." UTC is the zero point. Everything else is an offset from it.</p>

<h2 id="not-a-timezone">It is not a time zone</h2>
<p>This trips everyone up, including me once. A time zone has rules — daylight saving, historical changes, political quirks. UTC has none of that. UTC never springs forward, never falls back, never changes. It just... ticks. Which is exactly why it's useful as an anchor: it never moves.</p>
<p>GMT, meanwhile, is technically a time zone (the UK's winter time). UTC and GMT are within a second of each other, so people use them interchangeably, but they're not the same thing. GMT can have daylight saving; UTC can't.</p>

<h2 id="why-developers-love-it">Why your code lives in UTC</h2>
<p>Here's the thing every developer learns the hard way: <strong>store timestamps in UTC, always.</strong> Here's why:</p>
<ul>
<li>If you store "8:00 PM" in a local timezone, that value is meaningless on a server in another country.</li>
<li>If you store "20:00 UTC", you can convert it to any local timezone on demand, and it's the same instant everywhere.</li>
<li>Daylight saving breaks stored local times — the same wall-clock time can exist twice in one year, or not at all.</li>
</ul>
<p>So your database rows, your API payloads, your logs — they should all speak UTC. Then you convert to the user's local time only at the very edge, in the UI. This is the pattern, and it saves an absurd amount of pain.</p>

<h2 id="the-z-thing">Why timestamps end in "Z"</h2>
<p>That trailing "Z" on timestamps like <code>2026-08-13T07:00:00Z</code>? It stands for "Zulu," the military call-sign for the zero meridian. It means "this time is in UTC, no offset." A "+05:30" suffix would mean the same instant written in Chennai's offset. The "Z" is just the clean way of saying UTC.</p>

<h2 id="leap-seconds">The weird bit: leap seconds</h2>
<p>Okay, fun fact. The Earth's rotation isn't perfectly steady, so occasionally scientists add a "leap second" to keep UTC aligned with the actual spin of the planet. It's rare (last one was 2016) and it does occasionally make engineers grumble, but it keeps our clocks honest. You'll probably never notice one, but now you know they exist.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Is UTC the same as Greenwich Mean Time?</strong> Practically yes — they're within a second. Technically GMT is a time zone and UTC is a standard. Your phone treats them as the same thing.</p>
<p><strong>Is UTC ahead or behind my time?</strong> Depends where you are. East of Greenwich (Europe, Asia, Australia) is ahead; the Americas are behind.</p>
<p><strong>Should I use UTC in my calendar?</strong> Use it in your code and your calendar backend. Show the user their local time. That's the whole game.</p>

<p><em>Tip: In ClockHive, every city page shows both the local time and its UTC offset — so you can sanity-check your mental math before scheduling across borders.</em></p>
`,
  },
  {
    categorySlug: "timezone-tips",
    categoryName: "Timezone Tips",
    categoryDesc:
      "Plain-English explainers about time zones, UTC, GMT and daylight saving — for teams and travelers.",
    title: "What Is GMT? The Time Zone With a Famous Address",
    slug: "what-is-gmt",
    emoji: "🧭",
    cover: ["#065f46", "#14b8a6"],
    excerpt:
      "GMT is the time zone that started it all — literally based on a line through a London observatory. Here's what it is, how it differs from UTC, and why your phone still says GMT+5:30.",
    tags: ["gmt", "greenwich", "timezone", "history", "explainer"],
    seoTitle: "What Is GMT? Greenwich Mean Time Explained Simply | ClockHive",
    seoDescription:
      "GMT explained: its history at the Royal Observatory, how it differs from UTC, and why phones still show GMT offsets even though UTC is the modern standard.",
    seoKeywords:
      "what is gmt, greenwich mean time, gmt vs utc, prime meridian, greenwich time explained",
    content: `
<p>GMT. You've seen it on your phone a thousand times — "GMT+5:30", "GMT-8" — but have you ever actually stopped to wonder where it came from? It's got a surprisingly fun origin story involving a London observatory, some angry sailors, and the entire planet agreeing on a line in the ground.</p>

<h2 id="what-it-is">What GMT is</h2>
<p>Greenwich Mean Time is the time at the Prime Meridian — the line of zero longitude that runs through the Royal Observatory in Greenwich, London. "Mean time" means "average sun time" (the sun isn't a perfect clock either; it wobbles a bit through the year, so they averaged it out).</p>
<p>So GMT is literally "the average time at that specific line in London." Everything east of it is ahead; everything west is behind.</p>

<h2 id="the-history">Why Greenwich? A little history</h2>
<p>In the 1800s, sailors needed a way to figure out their longitude at sea. The trick: compare the time on board against a reference time. If you knew Greenwich time and your local noon, you could calculate how far east or west you were. So the Royal Observatory in Greenwich became the reference.</p>
<p>Then trains happened (they always happen in these stories), and countries needed a shared standard for timetables. In 1884, a conference in Washington DC formally made the Greenwich Meridian the world's prime meridian — longitude zero. And GMT became the global reference time.</p>
<p>It's a bit wild that a suburb of London ended up as the world's clock, but here we are. Blame the British Empire and the shipping industry.</p>

<h2 id="gmt-vs-utc">GMT vs UTC — the eternal confusion</h2>
<p>Here's the thing everyone gets wrong: GMT and UTC are <em>not</em> the same thing, even though they're used interchangeably everywhere.</p>
<ul>
<li><strong>GMT is a time zone</strong>. It's the UK's standard time in winter. It has rules, and it can have daylight saving (British Summer Time = GMT+1).</li>
<li><strong>UTC is a time standard</strong>. It has no daylight saving, no rules, no politics. It never changes.</li>
</ul>
<p>They're within about a second of each other, so for 99.9% of life you can treat them as identical. But technically: GMT is a time zone, UTC is the anchor. Your phone says "GMT+5:30" for Chennai even though it's really "UTC+5:30" — because "GMT" is the term everyone grew up with and it stuck.</p>

<h2 id="why-you-still-see-it">Why your phone still says GMT</h2>
<p>It's mostly legacy and habit. The world agreed on UTC as the official standard decades ago, but "GMT" is friendlier and more familiar, so operating systems and apps kept showing it. Chennai's setting is "India Standard Time (GMT+5:30)" on most phones. It's wrong in a pedantic sense and right in a practical one.</p>
<p>Don't let it confuse you: GMT offset and UTC offset are, for all practical purposes, the same number.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Is GMT ahead of my timezone?</strong> If you're east of Greenwich, yes. London is the zero point — everything east is ahead, everything west is behind.</p>
<p><strong>Does GMT have daylight saving?</strong> GMT itself doesn't, but the UK does — it switches to British Summer Time (GMT+1) in summer. So London's offset from UTC is +0 in winter and +1 in summer.</p>
<p><strong>Why is Greenwich special?</strong> Because history made it so — longitude zero runs through its observatory. No scientific reason, just 140 years of tradition.</p>

<p><em>Tip: Wondering what GMT+5:30 means in practice? Add <strong>London</strong> and <strong>Chennai</strong> side-by-side in ClockHive and watch the same moment show up as two different local times.</em></p>
`,
  },
  {
    categorySlug: "timezone-tips",
    categoryName: "Timezone Tips",
    categoryDesc:
      "Plain-English explainers about time zones, UTC, GMT and daylight saving — for teams and travelers.",
    title: "What Is Daylight Saving Time? Spring Forward, Fall Back",
    slug: "what-is-daylight-saving-time",
    emoji: "☀️",
    cover: ["#b45309", "#f59e0b"],
    excerpt:
      "Daylight Saving Time explained without the jargon — why we move the clocks, who does and doesn't do it, and the two meetings-per-year that quietly break everyone's schedule.",
    tags: ["dst", "daylight-saving", "clocks", "timezone", "explainer"],
    seoTitle:
      "What Is Daylight Saving Time? Spring Forward, Fall Back | ClockHive",
    seoDescription:
      "Daylight Saving Time explained simply: why clocks change, who observes it, the history, and the practical gotchas for scheduling and code.",
    seoKeywords:
      "what is daylight saving time, dst explained, spring forward fall back, who observes dst, dst meeting scheduling",
    content: `
<p>Twice a year, the world quietly moves the clocks and half of us lose or gain an hour of sleep. That's Daylight Saving Time — or DST if you want to sound like you're in a hurry. Let me break down what's actually going on, because honestly the confusion around it is well-earned.</p>

<h2 id="the-basic-idea">The basic idea</h2>
<p>The concept is simple: in summer, when the days are long, we shift the clocks forward an hour so the sunlight is "used" later in the evening. Sunrise comes later, sunset comes later, and you get an extra hour of daylight after work. In autumn, we shift back.</p>
<p>Hence the mantra: <strong>spring forward, fall back.</strong> Spring = clocks go forward (+1 hour, lose sleep). Fall = clocks go back (-1 hour, gain sleep).</p>

<h2 id="why-it-exists">Why it exists (and who actually wanted it)</h2>
<p>People love to blame Benjamin Franklin, who jokingly suggested something similar in 1784 as a way to save candles. But the modern version really took off during World War I, when countries wanted to save fuel and energy by making evenings lighter. The idea stuck around, energy debates aside.</p>
<p>Honestly, the energy-saving argument is shaky these days — studies keep going back and forth on whether it saves anything at all. But the tradition is deeply embedded, so we keep doing it. Some places even tried to abolish it (more on that in a second).</p>

<h2 id="who-does-it">Who does and doesn't do it</h2>
<p>Here's the part that makes global scheduling painful — it's not universal, and it's not even consistent within countries.</p>
<ul>
<li><strong>Most of Europe</strong> observes it (and changes on the same dates).</li>
<li><strong>Most of North America</strong> observes it — except Arizona (except for the Navajo Nation, of course) and Hawaii.</li>
<li><strong>Most of Asia and Africa</strong> don't observe it at all. India, China, Japan, Singapore — no DST. The clocks just sit there.</li>
<li><strong>Australia</strong> does it in some states and not others, on dates that don't line up with the northern hemisphere at all.</li>
</ul>
<p>So in our London–Chennai–Sydney team, London and Sydney both change their clocks — at completely different times of year — while Chennai never changes. Which means the offset between London and Sydney isn't even constant. It drifts. That's the actual nightmare.</p>

<h2 id="the-gotcha">The scheduling gotcha (and the coding gotcha)</h2>
<p>The classic mistake: you schedule a recurring 3 PM meeting, and the week the clocks change, it quietly moves to 2 PM or 4 PM for your colleagues on the other side of the change. Nobody notices until someone misses it.</p>
<p>And if you're writing code, DST is where timezones go to break things. A wall-clock time like "02:30" can occur <em>twice</em> on the fall-back day, or <em>not at all</em> on the spring-forward day. If your app stores local times without an offset, you get bugs that only appear twice a year. This is why we store UTC and convert at the edge — DST can't touch UTC.</p>

<h2 id="diagram">The two moments</h2>
<img src="/blog/dst-change.svg" alt="Diagram showing spring forward adding an hour and fall back removing an hour" class="w-full h-auto rounded-xl my-6" />

<h2 id="faq">Quick answers</h2>
<p><strong>When does it change?</strong> Europe: last Sunday of March and October. US: second Sunday of March, first Sunday of November. Different places, different rules — always double-check the specific country.</p>
<p><strong>Is DST the same everywhere?</strong> No. Dates differ, and lots of countries don't do it at all.</p>
<p><strong>Is it being abolished?</strong> It gets proposed all the time. The EU voted to end it (then got stuck on the details), and some US states want to make it permanent. Nothing's actually changed for most of us yet.</p>

<p><em>Tip: When a timezone changes its clocks, the offset between cities changes too. Keep a <strong>ClockHive</strong> tab with your team's cities open and re-check the overlap after any DST weekend — it probably moved.</em></p>
`,
  },

  // ============ SCRUM / AGILE GUIDES ============
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is Scrum? The Framework That Runs on Sprints",
    slug: "what-is-scrum",
    emoji: "🏉",
    cover: ["#6d28d9", "#d946ef"],
    excerpt:
      "Scrum isn't a process you buy — it's a framework your team lives in. Here's the rugby origin, the three pillars, and how sprints actually work, explained by someone who's run them badly.",
    tags: ["scrum", "agile", "sprints", "framework", "explainer"],
    seoTitle:
      "What Is Scrum? A Plain-English Guide to the Framework | ClockHive",
    seoDescription:
      "What is Scrum, really? Learn the three pillars, the roles, the artifacts and the sprint events — explained conversationally for people new to the framework.",
    seoKeywords:
      "what is scrum, scrum framework explained, scrum roles, scrum events, scrum artifacts, sprints",
    content: `
<p>Scrum gets a bad rap because it's usually explained with a slide full of boxes and arrows that makes your eyes glaze over. Let me skip the boxes and tell you what it actually is — the way I'd explain it to a new teammate on day one.</p>

<h2 id="the-short-version">The short version</h2>
<p>Scrum is a <strong>framework</strong> for getting work done in small, repeatable chunks called sprints. You don't plan six months of work up front and pray. Instead you plan a couple of weeks, build, show people, learn, and do it again. The team decides what to build; the process gives it a steady rhythm.</p>
<p>It's not a methodology, and it's not a set of rules to follow blindly. It's more like a container — you put your own practices inside it.</p>

<h2 id="the-name">Why it's called "Scrum"</h2>
<p>Borrowed from rugby. In rugby, a "scrum" is when the whole team packs together to move the ball forward — everyone pushing in the same direction, nobody standing on the sidelines watching. The people who created Scrum in the early 90s liked that image, and honestly it's a perfect metaphor for a good team: heads down together, moving the thing forward.</p>

<h2 id="the-pillars">The three pillars (the part people skip)</h2>
<p>Underneath all the ceremonies there are three ideas that make Scrum work, and if these aren't there, the meetings are just meetings:</p>
<ul>
<li><strong>Transparency</strong> — everyone can see what's being worked on, what's done, what's stuck. No hidden work, no surprises.</li>
<li><strong>Inspection</strong> — the team regularly looks at what it built and how it's working, not just at the end of the project.</li>
<li><strong>Adaptation</strong> — and then actually changes course based on what it saw. This is the part most teams skip. Inspecting without adapting is just complaining.</li>
</ul>

<h2 id="the-pieces">The pieces: roles, artifacts, events</h2>
<p>Scrum has three roles, three artifacts, and five events. It sounds like a lot, but it's really just "who does what," "what we track," and "the meetings."</p>
<p><strong>Roles</strong> — the Product Owner (decides what's most valuable and keeps the backlog sorted), the Scrum Master (helps the team run Scrum well and removes blockers — not a boss), and the Developers (the people who actually build the thing). That's it. No project managers in the classic framework.</p>
<p><strong>Artifacts</strong> — the Product Backlog (the ever-growing list of everything we might build, prioritised), the Sprint Backlog (what we committed to this sprint), and the Increment (the working, usable result at the end).</p>
<p><strong>Events</strong> — Sprint Planning (pick what we'll do), the Daily Standup (15 minutes, sync up), the Sprint Review (show the work to stakeholders), and the Retrospective (how did the process go — what do we change). Then the sprint ends and a new one starts.</p>

<h2 id="the-loop">A sprint, start to finish</h2>
<img src="/blog/scrum-cycle.svg" alt="Diagram of the Scrum sprint loop: planning, daily standup, review, retrospective" class="w-full h-auto rounded-xl my-6" />
<p>Here's what a typical two-week sprint feels like:</p>
<ul>
<li><strong>Monday morning:</strong> Sprint planning. The team pulls the next chunk of work off the backlog, agrees on what's realistic, and commits.</li>
<li><strong>Every day:</strong> 15-minute standup. What did I do, what will I do, what's blocking me. Then everyone goes and works.</li>
<li><strong>End of week two:</strong> Sprint review — show a human what we actually built, even if it's rough. Then retrospective — talk about the process, pick one thing to improve.</li>
<li><strong>Then:</strong> do it again. Same length, same rhythm, forever.</li>
</ul>
<p>The magic isn't in any single meeting. It's the repetition. The team gets a reliable heartbeat, stakeholders get to course-correct every couple of weeks, and no one has to wait six months for feedback.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Is Scrum Agile?</strong> Yes — Scrum is one framework you can use to do Agile. Kanban is another. Agile is the umbrella mindset; Scrum is a specific way of running it.</p>
<p><strong>Do we have to do all the meetings?</strong> The framework says yes, but good teams tune it. The meetings are there to serve the pillars — if a meeting isn't helping transparency or adaptation, change it.</p>
<p><strong>Is Scrum for software only?</strong> No, it started there but marketing teams, HR teams and even law firms run Scrum these days. If work is complex and uncertain, the framework helps.</p>

<p><em>Tip: Sprints run on calendars — and if your team is distributed, make sure your sprint ceremonies land in everyone's working hours. A quick <strong>ClockHive</strong> check of your team's cities before setting the recurring invites saves a lot of groggy 11 PM standups.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is Scrum Poker? Estimating Without the Awkward Silence",
    slug: "what-is-scrum-poker",
    emoji: "🃏",
    cover: ["#7e22ce", "#ec4899"],
    excerpt:
      "Scrum Poker (aka Planning Poker) is how teams estimate work without copying each other's guesses. Here's why we use Fibonacci numbers and why the game beats arguing about hours.",
    tags: ["scrum-poker", "planning-poker", "estimation", "agile", "explainer"],
    seoTitle: "What Is Scrum Poker? Planning Poker Explained | ClockHive",
    seoDescription:
      "Scrum Poker explained simply: how a planning poker round works, why teams use Fibonacci numbers, and why relative estimation beats estimating in hours.",
    seoKeywords:
      "what is scrum poker, planning poker, story point estimation, fibonacci estimation, agile estimation",
    content: `
<p>Scrum Poker — also called Planning Poker — is the game teams play to estimate how big a piece of work is, without everyone just copying the loudest person in the room. It's a little weird when you first see it, and honestly it's one of my favourite ceremonies. Let me walk you through it.</p>

<h2 id="the-setup">The setup</h2>
<p>Everyone on the team gets a hand of cards. Each card has a number on it — usually the Fibonacci sequence: 0, 1, 2, 3, 5, 8, 13, 21, and maybe a "?" for "I have genuinely no idea" and a coffee cup for "break time."</p>
<p>The Product Owner (or whoever's running the session) reads out a piece of work from the backlog — a user story, a ticket, whatever. Then the team discusses it briefly: what's involved, what could go wrong, any unknowns.</p>

<h2 id="the-round">How a round goes</h2>
<ol>
<li>Someone reads the story out loud.</li>
<li>The team chats for a minute or two — clarifying questions, risks, assumptions.</li>
<li>Everyone secretly picks a card and places it face down. <strong>No talking about numbers yet.</strong></li>
<li>On the count of three, everyone flips their card at the same time.</li>
<li>If everyone picked the same number — great, that's the estimate. Moving on.</li>
<li>If the numbers are all over the place (a 2 and a 13, say), the outliers explain <em>why</em>. The person who said 2 hears why someone thinks it's a 13. Then you re-vote.</li>
</ol>
<p>That flip is the whole magic of the game. Nobody gets to anchor the conversation with "oh this is easy, it's a 2" before anyone else has thought. Everyone commits to a number independently, then the discussion happens <em>after</em> — which means the discussion is about the work, not about egos.</p>

<h2 id="why-fibonacci">Why Fibonacci?</h2>
<p>Good question, and the answer is more practical than mystical. As work gets bigger, our ability to tell it apart gets worse. The difference between a 1 and a 2 is easy to feel. The difference between a 21 and a 22? Nobody can actually feel that. So the scale grows: 1, 2, 3, 5, 8, 13, 21. The gaps widen as the numbers grow, which matches how our brains actually estimate — we're precise on small things and fuzzy on big ones.</p>
<p>It also stops the "but a 6 is bigger than a 5" arguments. With Fibonacci, there is no 6. You're either a 5 or an 8, and the jump forces a real conversation.</p>

<h2 id="points-not-hours">Points, not hours</h2>
<p>Here's the mental shift that trips people up: the numbers aren't hours. A "5" is not "5 hours." It's "about twice as big as a 2, whatever that means for us." The team builds a shared sense over time — "oh, a typical 5 is a new API endpoint with tests." That shared scale is the real asset, and it survives team changes and tech changes better than hour estimates ever do.</p>
<p>And because they're relative, you can't be accused of being slow. A 5 for us might be a 3 for a bigger team — and that's fine, because velocity (the points we complete per sprint) is <em>our</em> number, not a benchmark against anyone else.</p>

<h2 id="real-example">The real example</h2>
<p>My favourite poker moment: we had a ticket that the senior dev swore was a 2 — "it's just a config change." One person on the team quietly played a 13. When asked why, they said "config change, sure, but it touches the billing service, and the last time anyone touched the billing service we were down for a day." Silence. We re-voted. It came out an 8. The quiet person had context nobody else had, and the game surfaced it before we committed. That's the whole point.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Who plays Scrum Poker?</strong> The people doing the work — the developers. The Product Owner answers questions but doesn't normally vote (they have opinions, but the estimate is the doers').</p>
<p><strong>How long does it take?</strong> A well-run session estimates maybe 5-10 stories an hour. If a story takes forever to estimate, it's usually too big and should be split.</p>
<p><strong>Do we always have to agree?</strong> You aim for consensus-ish. Most teams accept it when the range tightens to within a Fibonacci step. Perfect agreement on every story isn't the goal.</p>

<p><em>Tip: Remote team estimating? Running poker over a shared screen with everyone revealing in a group chat works, but dedicated planning poker tools make it much smoother — and a <strong>ClockHive</strong> tab in the corner keeps you honest about whether the session lands in everyone's timezone.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Are Story Points? The Unit That Isn't Time",
    slug: "what-are-story-points",
    emoji: "📏",
    cover: ["#1e40af", "#6366f1"],
    excerpt:
      "Story points measure how big a piece of work feels — complexity, uncertainty, effort — not how long it takes. Here's why teams use them and why they beat guessing in hours.",
    tags: ["story-points", "estimation", "velocity", "scrum", "explainer"],
    seoTitle: "What Are Story Points? Relative Effort Explained | ClockHive",
    seoDescription:
      "Story points explained simply: what they measure, why they're relative and not time, how velocity works, and common mistakes teams make.",
    seoKeywords:
      "what are story points, story points explained, agile estimation, velocity, relative sizing",
    content: `
<p>Story points are the weird little numbers teams assign to work instead of saying "that'll take three days." If you're new to this, they seem suspiciously vague — and they kind of are. But the vagueness is the point. Let me explain why we don't just use hours.</p>

<h2 id="what-they-measure">What a story point actually measures</h2>
<p>A story point is a unit of <strong>relative size</strong>. It bundles three things together:</p>
<ul>
<li><strong>Effort</strong> — how much work it is.</li>
<li><strong>Complexity</strong> — how hard it is to wrap your head around.</li>
<li><strong>Uncertainty/risk</strong> — how much we don't know yet.</li>
</ul>
<p>All three get smooshed into one number. That sounds sloppy, but it's actually deliberate: separating them out makes estimation an argument. Bundling them keeps the conversation about "how big is this, roughly?"</p>

<h2 id="relative-not-absolute">It's relative, not absolute</h2>
<p>The key rule: a story point has <em>no fixed meaning</em>. A 5 isn't "5 units of anything." It only means "about twice as big as a 2, and a bit smaller than an 8." The team calibrates the scale together over time, until "a 3" starts meaning "the usual medium thing" to everyone.</p>
<p>Think t-shirt sizes. An "M" on one team is a completely different shirt than an "M" on another. But within one team, everyone knows an M is bigger than an S and smaller than an L. Same idea — story points are t-shirt sizes with numbers.</p>

<h2 id="why-not-hours">Why not just estimate hours?</h2>
<p>Because humans are genuinely terrible at estimating hours, and it gets worse with pressure. Here's what happens with hour estimates:</p>
<ul>
<li>We anchor on "how long should this <em>reasonably</em> take" and then pad it.</li>
<li>We conflate effort with calendar time — a 6-hour task that waits 3 days for a review feels like it "took 3 days."</li>
<li>We compare estimates to how long things actually took, which turns estimation into a guilt machine.</li>
</ul>
<p>Points sidestep all of that. Nobody is "late" against a story point. The number is a size, not a deadline. It's so much healthier.</p>

<h2 id="the-scale">The scale</h2>
<img src="/blog/story-points-scale.svg" alt="Diagram of the Fibonacci story point scale from 1 to 13 with descriptions" class="w-full h-auto rounded-xl my-6" />
<p>Most teams use Fibonacci: 1, 2, 3, 5, 8, 13. As things get bigger, the gaps widen — because our ability to tell big things apart gets worse. A 13 should feel like a red flag that says "this is too big, split it."</p>

<h2 id="velocity">Then comes velocity</h2>
<p>Here's where points earn their keep. Over a few sprints, the team totals up the points it actually completed. That number — <strong>velocity</strong> — becomes the planning guide. If our average is 30 points per two-week sprint, then next planning session we pull about 30 points of work. No guessing, no heroics, just "this is what we do in a sprint."</p>
<p>Velocity is a team's own pace. Comparing one team's velocity to another's is meaningless — a 30 for us isn't a 30 for them. It's our rhythm, and it's what makes sprint planning feel calm instead of stressful.</p>

<h2 id="real-example">A real example</h2>
<p>We once had a ticket that "should just be a quick UI tweak" — the kind of thing people say before it eats a week. It got a 2. Then we discovered the page was built with an old component library, the API didn't return the field we needed, and the design spec was for a screen that didn't exist yet. Same ticket, re-estimated: an 8. The points forced us to admit what we knew all along — it wasn't small. Good estimation is really just honesty with numbers.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Are story points the same as hours?</strong> No. Never. That's the whole idea. A 5 is "twice a 2," not "5 hours."</p>
<p><strong>Who decides the points?</strong> The people doing the work, as a team — usually through Scrum Poker.</p>
<p><strong>How many points should we do in a sprint?</strong> Whatever your velocity says. Don't compare to other teams. Start rough, refine over 3-4 sprints.</p>

<p><em>Tip: Estimation is a team conversation — and if your team is remote, make sure it happens when everyone's actually awake. A <strong>ClockHive</strong> glance at your team's cities before booking the session is the polite thing to do.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is Sprint Planning? Setting Up the Next Two Weeks",
    slug: "what-is-sprint-planning",
    emoji: "🎯",
    cover: ["#b91c1c", "#f97316"],
    excerpt:
      "Sprint Planning is the meeting where the team decides what it will actually build next. Here's the two questions it answers, how long it should take, and the mistakes to avoid.",
    tags: ["sprint-planning", "scrum", "agile", "backlog", "planning"],
    seoTitle: "What Is Sprint Planning? A Guide to the Meeting | ClockHive",
    seoDescription:
      "Sprint Planning explained: what it is, the two questions it answers, how long it takes, and how the team picks work using velocity and capacity.",
    seoKeywords:
      "what is sprint planning, sprint planning explained, scrum planning meeting, sprint backlog, agile planning",
    content: `
<p>Sprint Planning is the meeting where a Scrum team decides, together, what it's going to build over the next sprint. It's the first event of every sprint, and it sets the tone for everything after. Done well, the sprint feels calm. Done badly, the sprint feels like a series of surprises. Let me walk you through how it's supposed to work.</p>

<h2 id="the-two-questions">The two questions it answers</h2>
<p>Scrum says planning answers two questions, and honestly everything in the meeting is in service of them:</p>
<ol>
<li><strong>What can we deliver this sprint?</strong> — The team looks at the product backlog and picks the next chunk of valuable work.</li>
<li><strong>How will we get it done?</strong> — The team breaks that work into pieces and figures out the approach, at least well enough to start.</li>
</ol>
<p>Notice who answers the "what": the Product Owner brings the priorities, but the <em>team</em> decides what it can actually commit to. A Product Owner can't force 50 points into a sprint and call it planning. The team owns the commitment.</p>

<h2 id="who-and-how-long">Who's there, and how long does it take?</h2>
<p>Everyone on the team: the Product Owner, the Scrum Master, and the developers. For a two-week sprint, planning is usually capped at about two hours. For a one-week sprint, maybe an hour. The framework gives you that guideline because planning is meant to be focused — not an all-day workshop.</p>
<p>That time cap is a feature, not a rule to break. If planning routinely runs over, it's usually a sign the backlog isn't prioritised or the stories are too big — fix those, don't just extend the meeting.</p>

<h2 id="how-it-goes">How it actually goes</h2>
<img src="/blog/sprint-planning.svg" alt="Diagram showing work moving from the product backlog into the sprint backlog" class="w-full h-auto rounded-xl my-6" />
<p>A typical session looks like this:</p>
<ol>
<li>The Product Owner reminds everyone of the sprint goal — the "why" of this sprint, in one sentence.</li>
<li>The team looks at the top of the backlog, story by story, and checks each one is understood and estimated.</li>
<li>The team uses its <strong>velocity</strong> (points completed in recent sprints) and its <strong>capacity</strong> (who's here, who's on holiday, who has other commitments) to decide how much to pull in.</li>
<li>They commit to a sprint backlog, then break the big stories into tasks so Monday morning isn't a scramble.</li>
</ol>
<p>Velocity and capacity do the heavy lifting. If the team usually completes 30 points and someone's out for two days, you plan for a bit less — not because you're being lazy, but because planning that ignores reality is just hopeful fiction.</p>

<h2 id="the-mistake">The mistake everyone makes</h2>
<p>Over-committing. I've done it a dozen times. The team feels good, the backlog looks clear, so we pull in "just one more story." Then a production incident eats a day, a story turns out to be bigger than its points suggested, and suddenly the sprint ends with work spilling over. And the spill-over becomes <em>next</em> sprint's starting problem — the sprint goal quietly slips.</p>
<p>Good planning is a little bit boring. It's honest about capacity, it leaves a little slack, and it commits to less than the absolute maximum. The team that plans for 85% delivers more in the long run than the team that plans for 110%.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Can we change the sprint plan after planning?</strong> The sprint goal is fixed; the details can flex. If something urgent comes up, the team and Product Owner can swap work — but the goal stays the anchor.</p>
<p><strong>What if we finish early?</strong> Then you pull the next thing off the backlog. Planning gets the sprint started; the team manages the rest.</p>
<p><strong>Is planning the same as the review or retro?</strong> No. Planning looks forward (what will we build), review looks outward (what did we build), retro looks inward (how did the process go).</p>

<p><em>Tip: For remote teams, pick a planning slot that overlaps everyone's working hours. A quick <strong>ClockHive</strong> check of your team's timezones before setting the recurring invite saves the "who's up at 6 AM" conversation.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is a Daily Standup? 15 Minutes That Keep Teams Honest",
    slug: "what-is-a-daily-standup",
    emoji: "📣",
    cover: ["#0e7490", "#3b82f6"],
    excerpt:
      "The daily standup is 15 minutes, three questions, and a lot of unspoken rules. Here's what it's actually for, why you stand up, and the traps that turn it into a status meeting.",
    tags: ["daily-standup", "scrum", "agile", "meetings", "remote-work"],
    seoTitle: "What Is a Daily Standup? The 15-Minute Sync | ClockHive",
    seoDescription:
      "The daily standup explained: the three questions, why it's short and standing, what it's NOT for, and how to keep it useful for remote teams.",
    seoKeywords:
      "what is a daily standup, daily scrum, standup meeting, three questions, scrum daily",
    content: `
<p>The daily standup — or Daily Scrum, if you want to be official — is the most famous meeting in Agile. It's also the most frequently ruined one. Let me tell you what it's actually for, because most teams get it subtly wrong and then wonder why it feels like a waste of time.</p>

<h2 id="the-basics">The basics</h2>
<p>Every day, same time, same place, the team meets for <strong>15 minutes</strong> — ideally standing up, which is where the name comes from. The point of standing is physical: you don't want to be comfortable, because this meeting is supposed to be short and you're supposed to get back to work.</p>
<p>It's not a demo. It's not a status report. It's a daily re-sync so the team knows where things stand and can spot problems early.</p>

<h2 id="the-three-questions">The three questions</h2>
<p>Classically, everyone answers three things:</p>
<ol>
<li><strong>What did I do yesterday?</strong></li>
<li><strong>What am I doing today?</strong></li>
<li><strong>What's blocking me?</strong> (Anything in my way — a dependency, a question, an access permission that doesn't exist.)</li>
</ol>
<p>That's it. Fifteen minutes, three questions, around the circle. The third question is secretly the most important one — the whole point is to surface blockers while they're still cheap to fix, not a week later when everything's on fire.</p>

<h2 id="who-it's-for">Who it's really for</h2>
<p>Here's the mindset shift that makes standups work: the update isn't for the manager, it's for the <strong>team</strong>. Your teammates need to know what you're doing so they can help, coordinate, or warn you about the thing you're about to collide with.</p>
<p>If a standup turns into a performance review — "what have you got for me today?" — people stop being honest and start being defensive. Blockers get hidden, and the meeting becomes theatre. Keep it peer-to-peer and it stays useful.</p>

<h2 id="the-traps">The traps that kill a standup</h2>
<p>I've seen every one of these, and I've caused a couple:</p>
<ul>
<li><strong>The problem-solving pit.</strong> Someone mentions a bug, and suddenly three people are debugging on the spot while everyone else watches. That's not a standup — that's a working session. Park it: "let's grab a room after."</li>
<li><strong>The daily demo.</strong> Detailed walkthroughs of yesterday's work. Save that for the sprint review. Here, one or two sentences.</li>
<li><strong>The 45-minute update.</strong> If it's regularly running long, your stories are too big or your team is too big. Split either.</li>
<li><strong>The boss-report.</strong> The moment it becomes status-to-management, honesty dies. Protect it.</li>
</ul>

<h2 id="real-example">The real example</h2>
<p>We had a standup where someone casually mentioned they'd been "waiting for the staging environment all week." Nobody had said anything because nobody asked. That one sentence unblocked three days of work. The environment was fixed that afternoon. Standups are cheap insurance against silent waiting — which is why the blocker question matters more than the other two put together.</p>

<h2 id="remote">The remote twist</h2>
<p>Remote teams make standups both easier and harder. Easier because async updates in Slack or Teams are genuinely fine for many teams. Harder because a video standup across timezones means someone's usually eating breakfast or wearing their pyjama top on camera.</p>
<p>The golden rule for distributed teams: pick a time that's <em>actually in everyone's working hours</em>, even if it means someone starts slightly earlier or stays slightly later. One person permanently at 11 PM is how you lose them. And keep the three-question format tight — remote standups drift even faster than in-person ones.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Do we have to stand?</strong> No, but the standing is a useful nudge. If you sit, cap it at 15 minutes anyway.</p>
<p><strong>What if someone's on holiday?</strong> They're not there. You mention it once and move on. No need to update for them.</p>
<p><strong>Can we skip it if nothing's changed?</strong> Teams sometimes do "no blockers, moving on" days, but the habit is worth keeping — problems usually announce themselves on the day you'd skip.</p>

<p><em>Tip: For distributed teams, agree on the standup time using your team's actual timezones — <strong>ClockHive</strong> shows you the overlap in seconds so you can pick a slot that doesn't make anyone a 6 AM zombie.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is Agile Methodology? The Mindset, Not the Checklist",
    slug: "what-is-agile-methodology",
    emoji: "🔄",
    cover: ["#15803d", "#22c55e"],
    excerpt:
      "Agile is a way of thinking about work — small batches, fast feedback, and responding to change over following a plan. Here's the Manifesto, the mindset, and how Scrum fits inside it.",
    tags: ["agile", "methodology", "manifesto", "scrum", "kanban"],
    seoTitle: "What Is Agile Methodology? A Plain-English Guide | ClockHive",
    seoDescription:
      "Agile methodology explained: the Agile Manifesto values and principles, how it differs from waterfall, and how Scrum and Kanban fit inside the Agile mindset.",
    seoKeywords:
      "what is agile, agile methodology, agile manifesto, agile vs waterfall, scrum kanban agile",
    content: `
<p>Agile is one of those words that means everything and nothing these days. Companies slap it on job titles, tools, and process decks. But underneath all the noise, Agile is a genuinely simple idea, and once you see it, you can't unsee it. Let me strip it back.</p>

<h2 id="the-one-idea">The one idea at the core</h2>
<p>Agile is a mindset for doing complex, uncertain work: <strong>deliver small pieces frequently, get feedback fast, and change course based on what you learn.</strong> That's it. Everything else — the meetings, the boards, the ceremonies — is just scaffolding around that idea.</p>
<p>The opposite is the old way, usually called Waterfall: plan everything up front, build it all, then reveal it at the end. That works great when you know exactly what you're building. It collapses when you're building something nobody's built before — which is most software.</p>

<h2 id="the-manifesto">The Manifesto, in plain words</h2>
<p>In 2001, seventeen software folks got together and wrote the Agile Manifesto. It's famously short, and it boils down to four value shifts:</p>
<ul>
<li><strong>People and interactions</strong> over processes and tools.</li>
<li><strong>Working software</strong> over comprehensive documentation.</li>
<li><strong>Customer collaboration</strong> over contract negotiation.</li>
<li><strong>Responding to change</strong> over following a plan.</li>
</ul>
<p>Notice the phrasing — it's not "processes are bad." It's "these things matter more." The manifesto is about emphasis, not absolutes. You can still document things; you just shouldn't let the documentation become the point.</p>

<h2 id="agile-vs-waterfall">Agile vs Waterfall, side by side</h2>
<img src="/blog/agile-vs-waterfall.svg" alt="Diagram comparing waterfall's one big reveal to agile's frequent small deliveries" class="w-full h-auto rounded-xl my-6" />
<p>Here's the practical difference. Waterfall bets that you can get it right the first time — requirements, design, build, test, all in a straight line, with the big reveal at the end. Agile bets on feedback — you ship something rough every couple of weeks, watch how people use it, and adjust. If you're wrong about something, you find out in two weeks instead of six months. That's the entire advantage.</p>

<h2 id="scrum-vs-kanban">Scrum, Kanban, and other flavours</h2>
<p>Agile is the umbrella; the frameworks are the rain. The two you'll hear most:</p>
<ul>
<li><strong>Scrum</strong> — fixed-length sprints with specific ceremonies (planning, standup, review, retro). Good for teams that want a steady rhythm and a clear cadence.</li>
<li><strong>Kanban</strong> — a continuous flow of work through a board (to do → doing → done), no fixed sprints. Good for teams with a steady stream of incoming work, like support or ops.</li>
</ul>
<p>Both are Agile because both do the core thing: small batches, visible work, fast feedback. They just structure it differently. Pick the one that fits the work, not the one that's trendier.</p>

<h2 id="what-agile-is-not">What Agile is not</h2>
<p>Let me clear up some nonsense while I'm here. Agile is <em>not</em>:</p>
<ul>
<li>Doing everything in two weeks with no plan at all.</li>
<li>A set of tools (a Jira board does not make you agile).</li>
<li>A licence to change requirements every single day and call it "responding to change."</li>
<li>A way to make developers work faster. (Done right, it makes them work <em>smarter</em> and more sustainably — the velocity is a team's own pace, not a speed target.)</li>
</ul>

<h2 id="faq">Quick answers</h2>
<p><strong>Is Agile a methodology?</strong> Sort of — it's usually called a mindset or a set of principles. Scrum and Kanban are the methodologies that implement it.</p>
<p><strong>Does Agile work outside software?</strong> Yes, increasingly. Marketing, HR, hardware — anywhere the work is complex and the answer isn't known in advance.</p>
<p><strong>Do we have to use Scrum to be Agile?</strong> No. Scrum is one path. Kanban is another. If neither fits, you can still be agile with a board and a feedback loop.</p>

<p><em>Tip: Agile runs on cadence — sprint reviews, retros, planning, all on a recurring schedule. For distributed teams, a <strong>ClockHive</strong> check of everyone's timezones before locking those recurring invites is the most underrated thing you can do for the process.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is a Scrum Master? The Servant Leader, Not the Boss",
    slug: "what-is-a-scrum-master",
    emoji: "🛡️",
    cover: ["#1e293b", "#64748b"],
    excerpt:
      "The Scrum Master isn't a project manager and isn't the team's boss. They're the person who makes the process run smoothly and keeps blockers out of the way. Here's what they actually do.",
    tags: ["scrum-master", "scrum", "agile", "roles", "leadership"],
    seoTitle: "What Is a Scrum Master? The Role Explained | ClockHive",
    seoDescription:
      "What does a Scrum Master do? The servant-leader role explained: removing blockers, coaching the team, protecting the sprint — and what they deliberately don't do.",
    seoKeywords:
      "what is a scrum master, scrum master role, scrum master vs project manager, servant leader, agile coach",
    content: `
<p>Scrum Master is probably the most misunderstood role in Agile — and it's usually described in such fluffy terms that nobody can picture the actual job. "Servant leader." "Process coach." "Impediment remover." Great, but what does that person do on a Tuesday? Let me get concrete.</p>

<h2 id="not-a-pm">First, what they're NOT</h2>
<p>This is the part everyone gets wrong, so let's start here. A Scrum Master is <strong>not</strong> a project manager, and <strong>not</strong> the team's boss. They don't:</p>
<ul>
<li>Assign tasks to people. (The team self-organises and pulls work.)</li>
<li>Decide what gets built. (That's the Product Owner.)</li>
<li>Fire, hire, or do performance reviews.</li>
<li>Whip the team to work faster.</li>
</ul>
<p>If someone calls themselves a Scrum Master and they're bossing people around, they're doing it wrong. The role has no authority in the traditional sense — and that's deliberate.</p>

<h2 id="the-servant-leader">The servant leader idea</h2>
<p>Scrum calls the Scrum Master a "servant leader." Corny phrase, real meaning: the leader serves the team so the team can do its best work. Their job is to make everyone else more effective — clearing obstacles, smoothing the process, protecting the team from chaos — rather than being the one who gives orders.</p>
<p>The power comes from influence and trust, not position. A good Scrum Master is the person the team goes to with problems because they actually get things unstuck.</p>

<h2 id="what-they-do">What they actually do on a Tuesday</h2>
<p>Concretely, the day-to-day looks like:</p>
<ul>
<li><strong>Removing blockers.</strong> Someone's waiting on access for three days? The Scrum Master chases it. An API is down and nobody's got the right permissions? They escalate. This is the highest-leverage work — unblocking one person can save the whole sprint.</li>
<li><strong>Running the ceremonies.</strong> They facilitate planning, standup, review, and retro — keeping them short, focused, and actually useful. Not by talking the whole time, but by keeping the meeting on track.</li>
<li><strong>Coaching the team.</strong> Teaching the team to self-organise and improve, rather than fixing every problem for them. A Scrum Master who does all the work creates a team that depends on them — a bad outcome in disguise.</li>
<li><strong>Protecting the sprint.</strong> Shielding the team from the "can you just squeeze this in?" requests that would quietly destroy the sprint goal. They say no so the team doesn't have to.</li>
<li><strong>Improving the process.</strong> Taking the retro's "let's try this next sprint" and making sure it actually happens — following up, not just nodding.</li>
</ul>

<h2 id="real-example">A real example</h2>
<p>Our best Scrum Master ever spent a whole morning tracking down why the team couldn't deploy — turned out it was an expired credential on a shared account nobody owned. She fixed it, wrote a note about it, and the team's deployment went from a weekly ordeal to a non-event. Nobody clapped, nobody thanked her loudly, the sprint just... worked. That's the job. When it's done well, it's invisible.</p>

<h2 id="scrum-master-vs-coach">Scrum Master vs Agile Coach</h2>
<p>They overlap, but roughly: a Scrum Master works with one team on the Scrum process. An Agile Coach works with a whole organisation on Agile practices and culture. Many Scrum Masters grow into coaches over time. If you're starting out, focus on the one team first — the role is already plenty.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>Does the Scrum Master report to anyone?</strong> Yes, they have a manager like everyone — but their day-to-day is serving the team, not managing it.</p>
<p><strong>Can the Scrum Master also be a developer?</strong> Sometimes, in small teams — but it's hard to coach a ceremony while you're mid-code in the same ceremony. Most teams prefer a dedicated SM.</p>
<p><strong>Is the Scrum Master the Product Owner?</strong> No. The Product Owner owns the "what" (priorities and backlog); the Scrum Master owns the "how" (the process working smoothly). Keeping those separate matters.</p>

<p><em>Tip: A good Scrum Master keeps the team's rhythm — including that ceremony timezone problem. If your team is distributed, be the one who checks everyone's local time in <strong>ClockHive</strong> before locking the recurring standup. Your teammates will quietly love you for it.</em></p>
`,
  },
  {
    categorySlug: "scrum-agile",
    categoryName: "Scrum & Agile",
    categoryDesc:
      "Scrum and Agile explained in plain English — frameworks, ceremonies, and the jargon your team actually uses.",
    title: "What Is a Sprint Retrospective? The Meeting That Makes You Better",
    slug: "what-is-sprint-retrospective",
    emoji: "💡",
    cover: ["#a21caf", "#7c3aed"],
    excerpt:
      "The retrospective is the last meeting of every sprint — a blameless look at how the process went, and a promise to try one thing differently next time. Here's how to run one that isn't a waste of time.",
    tags: ["retrospective", "sprint-retro", "scrum", "agile", "improvement"],
    seoTitle: "What Is a Sprint Retrospective? A Guide | ClockHive",
    seoDescription:
      "Sprint retrospective explained: what it's for, why it's blameless, formats like start-stop-continue, and how to make sure improvements actually happen.",
    seoKeywords:
      "what is a sprint retrospective, sprint retro, agile retrospective, start stop continue, scrum retrospective",
    content: `
<p>The sprint retrospective — retro, for short — is my favourite meeting in all of Scrum, which is saying a lot because I'm not a meetings person. It's the one that actually makes the team better over time. Let me explain what it is and, more importantly, why most retros quietly fail and how to stop that.</p>

<h2 id="what-it-is">What it is</h2>
<p>The retro is the last event of the sprint, right after the review. The review looked outward — "here's what we built." The retro looks inward: <strong>"how did we work, and what should we change?"</strong></p>
<p>It's the "inspect and adapt" pillar of Scrum made real. Every sprint, the team takes a hard, honest look at its own process and picks something to improve. No sprint should end without that conversation, because otherwise you're just repeating the same sprint forever and expecting different results.</p>

<h2 id="blameless">The blameless rule</h2>
<p>The ground rule that makes or breaks a retro: <strong>no blaming people.</strong> We talk about systems, processes, and outcomes — not "you dropped the ball."</p>
<p>This isn't being soft. It's practical. The moment a retro becomes a blame game, people stop being honest, and an honest retro is the only kind worth having. You can't fix a process problem if nobody will admit it exists. "The deployment kept failing" is discussable. "Why did YOU break it" ends the conversation.</p>

<h2 id="formats">Common formats</h2>
<p>You don't need fancy tools. The simplest format that works — <strong>Start, Stop, Continue</strong>:</p>
<ul>
<li><strong>Start doing</strong> — new things to try (e.g., "let's write tests before the feature, not after").</li>
<li><strong>Stop doing</strong> — things that aren't working (e.g., "let's stop having three people in the daily demo").</li>
<li><strong>Continue doing</strong> — the things that work (e.g., "the pairing sessions were great, keep them").</li>
</ul>
<p>Other formats exist — "what went well / what went badly," the "sailboat" metaphor (what's pushing us forward, what's dragging us back, what rocks are ahead), a simple happy/sad/mad board. They're all the same conversation with different hats on. Pick one, rotate occasionally, don't overthink it.</p>

<h2 id="the-key">The part everyone skips: follow-through</h2>
<p>Here's the honest truth: most retros fail because the improvements never happen. The team has a great conversation, writes a great action item on the board... and then the next sprint starts and everyone forgets. A month later, the same retro has the same complaints, and everyone's secretly annoyed.</p>
<p>The fix is boring and it works: pick <strong>one</strong> action item (not five), make it someone's responsibility, and put it in the next sprint's plan. One small, real change per sprint compounds fast. Five aspirational changes fizzle. Every Scrum Master learns this the hard way — I know I did.</p>

<h2 id="real-example">A real example</h2>
<p>Our team kept complaining that "we never have time to fix the test debt." Every retro, same line. One retro, instead of nodding, we made it a sprint goal: spend the last day of the sprint on the worst test, no new features. It was painful — one feature slipped. But the next two sprints got faster, because the team finally trusted the tests. One action item, actually done, changed the team's whole relationship with its codebase.</p>

<h2 id="faq">Quick answers</h2>
<p><strong>How long is a retro?</strong> For a two-week sprint, usually about an hour to 90 minutes. Longer sprints, longer retro.</p>
<p><strong>Does the Product Owner attend?</strong> It's a team ceremony, so usually just the team and Scrum Master. The PO can be invited for specific topics but shouldn't dominate — the team needs to be able to talk honestly.</p>
<p><strong>What if there's nothing to complain about?</strong> Then talk about what's working and how to do more of it. "Nothing went wrong" is still useful data.</p>

<p><em>Tip: Remote retros can be awkward, especially if half the team is past midnight. Schedule the retro in everyone's shared hours — a <strong>ClockHive</strong> overlap check before booking means the "improve our process" meeting doesn't start with half the team half-asleep.</em></p>
`,
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  ensureDir();

  // Write cover images + diagrams
  posts.forEach((post) => {
    const subtitle =
      post.categorySlug === "timezone-tips"
        ? "Time zones, made simple"
        : "Agile & Scrum, made simple";
    writeImage(
      `${post.slug}-cover.svg`,
      coverSvg({
        emoji: post.emoji,
        title: post.title,
        subtitle,
        from: post.cover[0],
        to: post.cover[1],
      }),
    );
  });
  writeDiagrams();

  // Ensure categories
  const cats = {};
  for (const post of posts) {
    if (!cats[post.categorySlug]) {
      let cat = await p.blogCategory.findUnique({
        where: { slug: post.categorySlug },
      });
      if (!cat) {
        cat = await p.blogCategory.create({
          data: {
            name: post.categoryName,
            slug: post.categorySlug,
            description: post.categoryDesc,
          },
        });
        console.log("Created category:", cat.slug);
      }
      cats[post.categorySlug] = cat;
    }
  }

  // Insert posts (skip if slug already exists, so the script is idempotent)
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const existing = await p.blogPost.findUnique({
      where: { slug: post.slug },
    });
    if (existing) {
      console.log("SKIP (exists):", post.slug);
      continue;
    }
    const cat = cats[post.categorySlug];
    const featuredImage = `/blog/${post.slug}-cover.svg`;
    await p.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage,
        status: "published",
        publishedAt: new Date(Date.now() - i * 3600_000), // stagger by an hour
        categoryId: cat.id,
        tags: JSON.stringify(post.tags),
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoKeywords: post.seoKeywords,
      },
    });
    console.log("Created post:", post.slug, "->", featuredImage);
  }

  await p.$disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
