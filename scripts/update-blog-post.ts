/**
 * One-off: push the expanded content of a single blog post to the PROD Turso DB.
 *
 * WHY: the "why-scrum-teams-struggle-with-time" post was crawled by Google but
 * "currently not indexed" — its content was thin (219 words) and truncated.
 * The expanded version lives in `prisma/seed-data/blog-posts.ts`. This script
 * mirrors that content and updates ONLY this post by slug (safe to re-run).
 *
 * NOTE: uses the PrismaLibSQL adapter + `.env` (like `src/lib/prisma.ts`) so it
 * writes to the REMOTE Turso DB, NOT local `prisma/dev.db`.
 *
 * Run:  npx tsx scripts/update-blog-post.ts
 */
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const envContent = readFileSync(".env", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^(\w+)\s*=\s*"(.+)"$/);
  if (match) env[match[1]] = match[2].trim();
});

const tursoUrl = env.TURSO_DATABASE_URL;
const tursoToken = env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }),
});

const SLUG = "why-scrum-teams-struggle-with-time";

// Mirrors the expanded content in prisma/seed-data/blog-posts.ts
const content = `<h2>The Real Time Problems in Scrum Teams</h2>
<p>In my experience working with distributed Scrum teams, time isn't just a logistics issue — it's the number one thing that kills sprint momentum. Here's what I've seen happen again and again.</p>

<h3>1. The 9 AM Standup That's Actually 9 PM</h3>
<p>When your team spans India, the UK, and the US, someone always gets the bad slot. We've seen teams where the India developers dial into standups at 9 PM every single day. That's not sustainable.</p>
<p><strong>Fix:</strong> Rotate standup times. Use ClockHive to find overlapping windows that don't punish the same people every sprint. Or go async — have everyone post their update in Slack by a certain UTC time.</p>
<p>Rotation matters more than people think. If the same person is always the one waking up at 6 AM or staying up past midnight, they'll burn out — and burnout shows up in sprint velocity long before anyone quits. A simple rule that works well: whoever attended the ceremony at the worst local hour picks the time for the next sprint.</p>

<h3>2. Estimation Sessions That Drag Forever</h3>
<p>Here's where most teams go wrong: they let estimation become a debate club. One person anchors with a high number, everyone adjusts, and suddenly a 3-point story becomes an 8.</p>
<p><strong>Fix:</strong> Use Scrum Poker. Everyone votes independently first, then you discuss the outliers. Our tool makes this dead simple — no setup, just share a link.</p>
<p>The second mistake is estimating at the wrong time of day. Estimation takes real cognitive effort, so don't schedule it right after lunch or at the very end of a long day. And cap the session: if a story takes more than ten minutes to estimate, it's probably too big — break it down instead of debating it.</p>

<h3>3. Sprint Planning Across Time Zones</h3>
<p>A 4-hour sprint planning session is brutal when half your team is fighting sleep. We've found that splitting planning into two 2-hour sessions (with async prep in between) works dramatically better for distributed teams.</p>
<p>Here's the pattern that works: send the sprint goal and the candidate backlog items out 24 hours before planning. Ask everyone to review async and drop comments on anything unclear. Then hold the first short session to agree on the sprint goal, and the second to lock the backlog. Each session stays focused, and nobody is forced into a marathon call.</p>

<h3>4. The Meeting Overload Problem</h3>
<p>Scrum ceremonies — standup, refinement, planning, retro — can easily eat five hours a week. In a distributed team each one is harder to schedule, so meetings multiply instead of shrinking.</p>
<p><strong>Fix:</strong> Audit every ceremony for async potential. Refinement is a perfect candidate — record the demo, let people ask questions in a thread, and only meet for the actual decisions. Use ClockHive's Business Hours tool to find the true overlap between your time zones, then protect that window for ceremonies and keep everything else async.</p>

<h3>5. Estimation Culture Beats Estimation Accuracy</h3>
<p>Teams obsess over getting estimates "right." The truth is, estimates are always wrong — they're a communication tool, not a promise.</p>
<p>What actually matters is that the team builds a shared sense of scale. When the senior developer explains why a "simple" login page is really an 8, the junior developer learns something they'll carry into every future estimate. That shared vocabulary is built in estimation sessions — and over a few sprints it becomes consistent, which is what makes planning useful.</p>

<h3>6. Timezone Awareness Is a Team Skill</h3>
<p>Distributed Scrum only works when everyone internalizes where their teammates are. Not just "they're in India" but "it's their evening right now."</p>
<p>Simple practices go a long way: put everyone's local time in the team channel header, keep a shared world clock on the team dashboard, and make it a rule to never schedule a meeting without checking everyone's local hour first. ClockHive's city pages and Meeting Planner are built for exactly this — paste the cities, see the overlap, and schedule with confidence.</p>

<h2>Bringing It All Together</h2>
<p>None of these fixes require a perfect process. Start with a single change: rotate the standup, split the planning session, or take refinement async. Each one removes a small amount of friction — and for distributed teams, friction is what kills momentum.</p>
<p>Time is the most expensive resource in Scrum. Stop fighting it, and you'll be surprised how much faster your team moves.</p>`;

async function main() {
  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } });
  if (!existing) {
    console.error(`❌ Post not found in prod: ${SLUG}`);
    process.exit(1);
  }

  await prisma.blogPost.update({
    where: { slug: SLUG },
    data: { content },
  });

  console.log(`✅ Updated content for "${SLUG}" (${content.length} chars, ~${content.trim().split(/\s+/).length} words)`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
