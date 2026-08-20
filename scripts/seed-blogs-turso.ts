/**
 * Seeds the 2 new blog posts to Turso
 * Run with: npx tsx scripts/seed-blogs-turso.ts
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

const blogPosts = [
  {
    slug: "manage-remote-teams-across-time-zones",
    categorySlug: "remote-work",
    title: "How to Manage Remote Teams Across Time Zones (Complete Guide)",
    excerpt: "Managing a remote team across multiple time zones is the new normal. Learn how to coordinate effectively with async communication, overlap hours, and the right tools.",
    tags: ["remote team management", "time zone collaboration", "distributed teams", "remote work", "global team"],
    seoTitle: "How to Manage Remote Teams Across Time Zones | ClockHive",
    seoDescription: "Complete guide to managing remote teams across time zones. Learn about overlap hours, async communication, follow-the-sun workflow, and the best tools for distributed teams.",
    content: `<h2>Why Time Zone Management Matters</h2>
<p>When your team is spread across countries, even a simple meeting can become complicated. For example:</p>
<ul>
<li>A developer in India starts their day when a designer in the US is asleep</li>
<li>A manager in the UK may struggle to find overlap with Australia</li>
</ul>
<p>Without proper coordination, this leads to missed messages, delayed decisions, and frustration among team members.</p>

<h2>1. Establish Clear Overlap Hours</h2>
<p>The most important rule: <strong>find at least 2–4 hours of overlapping work time.</strong></p>
<p>During this overlap:</p>
<ul>
<li>Schedule meetings</li>
<li>Discuss critical tasks</li>
<li>Resolve blockers</li>
</ul>
<p>Tip: Use tools like ClockHive to find the best overlap between cities instantly.</p>

<h2>2. Use Asynchronous Communication</h2>
<p>You can't rely only on real-time communication.</p>
<p>Instead:</p>
<ul>
<li>Use tools like Slack, Notion, or email</li>
<li>Record meetings for those who can't attend</li>
<li>Write clear documentation</li>
</ul>
<p><strong>Rule:</strong> If it's not documented, it doesn't exist.</p>

<h2>3. Define Clear Roles & Ownership</h2>
<p>In remote teams, confusion kills productivity.</p>
<p>Make sure:</p>
<ul>
<li>Every task has an owner</li>
<li>Deadlines are clearly defined</li>
<li>Expectations are documented</li>
</ul>
<p>This reduces dependency on real-time communication.</p>

<h2>4. Use the Right Tools</h2>
<p>Here are must-have tools for distributed teams:</p>
<ul>
<li>Timezone tools: ClockHive</li>
<li>Project management: Jira, Trello</li>
<li>Communication: Slack, Microsoft Teams</li>
<li>Documentation: Notion, Confluence</li>
</ul>

<h2>5. Respect Work-Life Balance</h2>
<p>Avoid scheduling meetings at odd hours for the same person repeatedly.</p>
<p>Best practices:</p>
<ul>
<li>Rotate meeting times</li>
<li>Avoid late-night calls</li>
<li>Respect local holidays</li>
</ul>
<p>A tired team is an unproductive team.</p>

<h2>6. Create a "Follow-the-Sun" Workflow</h2>
<p>Turn time zones into an advantage.</p>
<p>Example:</p>
<ul>
<li>India team finishes work, hands off to Europe</li>
<li>Europe team, hands off to the US</li>
</ul>
<p>This enables <strong>24-hour productivity</strong>.</p>

<h2>7. Track Performance, Not Hours</h2>
<p>Don't measure success by online time.</p>
<p>Instead track:</p>
<ul>
<li>Output</li>
<li>Task completion</li>
<li>Quality of work</li>
</ul>
<p>Remote work is about results, not presence.</p>

<h2>8. Build Team Culture</h2>
<p>Remote teams often feel disconnected.</p>
<p>Fix this by:</p>
<ul>
<li>Hosting virtual team events</li>
<li>Encouraging casual chats</li>
<li>Celebrating wins</li>
</ul>
<p>Strong culture improves collaboration across time zones.</p>

<h2>Final Thoughts</h2>
<p>Managing remote teams across time zones doesn't have to be difficult. With the right systems, tools, and mindset, it can actually become your biggest strength.</p>
<p>The key is simple: communicate clearly, plan overlaps, and respect time differences. And most importantly, use tools like <strong>ClockHive</strong> to simplify global collaboration.</p>`,
  },
  {
    slug: "what-is-utc-time-beginners-guide",
    categorySlug: "timezone-guides",
    title: "What is UTC Time? A Complete Beginner's Guide",
    excerpt: "What is UTC time, and why does it matter? Learn how Coordinated Universal Time works, how it relates to time zones, and how to convert UTC to your local time.",
    tags: ["UTC", "GMT", "time zones", "UTC offset", "global time", "time conversion"],
    seoTitle: "What is UTC Time? A Complete Beginner's Guide | ClockHive",
    seoDescription: "What is UTC time? Learn the difference between UTC and GMT, how UTC offsets work, and how to convert UTC to local time. Simple guide for beginners.",
    content: `<h2>What is UTC Time?</h2>
<p><strong>UTC (Coordinated Universal Time)</strong> is the global standard for measuring time.</p>
<p>It is:</p>
<ul>
<li>The same everywhere in the world</li>
<li>Not affected by time zones or daylight saving</li>
</ul>
<p>Think of UTC as the <strong>world's master clock</strong>.</p>

<h2>Why UTC Exists</h2>
<p>Before UTC, different countries used their own local times, which caused confusion—especially for:</p>
<ul>
<li>Aviation</li>
<li>Shipping</li>
<li>Global business</li>
<li>Internet systems</li>
</ul>
<p>UTC was introduced to standardize time globally.</p>

<h2>UTC vs GMT – What's the Difference?</h2>
<p>Many people confuse UTC with GMT.</p>
<ul>
<li><strong>GMT (Greenwich Mean Time)</strong> is based on Earth's rotation</li>
<li><strong>UTC</strong> is based on atomic clocks (more precise)</li>
</ul>
<p>In daily use, they are almost the same, but UTC is the official global standard.</p>

<h2>How UTC Relates to Time Zones</h2>
<p>Every time zone is defined as an offset from UTC.</p>
<p>Examples:</p>
<ul>
<li>India: UTC +5:30</li>
<li>London: UTC +0 (or +1 in daylight saving)</li>
<li>New York: UTC -5</li>
</ul>
<p>So when you see: <strong>"Meeting at 14:00 UTC"</strong>, you convert it to your local time.</p>

<h2>Where is UTC Used?</h2>
<p>UTC is used in:</p>
<ul>
<li>Aviation schedules</li>
<li>Programming & servers</li>
<li>International meetings</li>
<li>GPS systems</li>
<li>Stock markets</li>
</ul>
<p>Basically, anything global depends on UTC.</p>

<h2>How to Convert UTC to Local Time</h2>
<p>You can convert manually: <strong>Local Time = UTC + Offset</strong></p>
<p>Example:</p>
<ul>
<li>UTC: 10:00</li>
<li>India (+5:30): 15:30</li>
</ul>
<p>Or use tools like ClockHive to instantly compare time zones without confusion.</p>

<h2>Common Mistakes</h2>
<p>Avoid these:</p>
<ul>
<li>Confusing UTC with your local time</li>
<li>Ignoring daylight saving changes</li>
<li>Scheduling meetings without converting time</li>
</ul>

<h2>Why You Should Care About UTC</h2>
<p>Understanding UTC helps you:</p>
<ul>
<li>Avoid missed meetings</li>
<li>Coordinate globally</li>
<li>Work with international teams</li>
<li>Build better apps</li>
</ul>

<h2>Final Thoughts</h2>
<p>UTC is the backbone of global timekeeping. Whether you're a developer, remote worker, or traveler, understanding UTC makes life much easier.</p>
<p>Next time you see UTC, remember—it's the <strong>reference point for the entire world</strong>.</p>`,
  },
];

async function main() {
  console.log("📝 Seeding blog posts to Turso...");

  for (const post of blogPosts) {
    const category = await prisma.blogCategory.findUnique({ where: { slug: post.categorySlug } });
    if (!category) {
      console.log(`⚠️  Category not found: ${post.categorySlug}`);
      continue;
    }

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: JSON.stringify(post.tags),
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: JSON.stringify(post.tags),
        status: "published",
        publishedAt: new Date(),
        categoryId: category.id,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      },
    });

    console.log(`✅ Seeded: ${post.title}`);
  }

  console.log("🎉 Blog posts seeded to Turso!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
