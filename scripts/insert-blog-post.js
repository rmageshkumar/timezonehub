const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  // Find or create travel-tips category
  let cat = await p.blogCategory.findUnique({ where: { slug: "travel-tips" } });
  if (!cat) {
    cat = await p.blogCategory.create({
      data: {
        name: "Travel Tips",
        slug: "travel-tips",
        description:
          "Travel guides, jet lag tips, and timezone strategies for global travelers.",
      },
    });
    console.log("Created category:", cat.slug);
  }

  const content = `<h2 id="master-the-shift">1. Master the Shift: London vs. Sydney Time Gap</h2>
<p>The exact difference between London and Sydney shifts throughout the year due to staggered Daylight Saving Time changes:</p>

<table>
<thead>
<tr><th>Period</th><th>London Timezone</th><th>Sydney Timezone</th><th>Time Gap</th></tr>
</thead>
<tbody>
<tr><td><strong>UK Summer / AU Winter</strong> (Apr–Oct)</td><td>BST (UTC+1)</td><td>AEST (UTC+10)</td><td><strong>Sydney is 9 hours ahead</strong></td></tr>
<tr><td><strong>UK Winter / AU Summer</strong> (Oct–Mar)</td><td>GMT (UTC+0)</td><td>AEDT (UTC+11)</td><td><strong>Sydney is 11 hours ahead</strong></td></tr>
<tr><td><strong>Transitional Months</strong> (Mar &amp; Oct)</td><td>Staggered DST</td><td>Staggered DST</td><td><strong>10 hours ahead</strong></td></tr>
</tbody>
</table>

<p><em>Tip: Add both cities to your <strong>ClockHive Favorites</strong> dashboard before departure to track current time offsets instantly.</em></p>

<h2 id="jet-lag-defense">2. Jet Lag Defense: Adjusting Your Circadian Rhythm</h2>
<p>Beating a 10-hour jump takes systematic preparation rather than relying purely on caffeine:</p>

<ul>
<li><strong>Pre-flight adjustment:</strong> Three days before flying east (London to Sydney), shift your sleep schedule 1–2 hours earlier. When flying west (Sydney to London), stay up 1–2 hours later.</li>
<li><strong>Flight timing:</strong> Change your watch to your destination time zone as soon as you board. Sleep when it is night at your destination, even if you are not fully exhausted.</li>
<li><strong>Light exposure:</strong> Natural sunlight is the fastest signal for your circadian clock. Upon arriving in Sydney in the morning, get immediate outside light to suppress melatonin production.</li>
</ul>

<h2 id="remote-work">3. Remote Work &amp; Meeting Coordination</h2>
<p>When managing client calls or team check-ins across London and Sydney, finding overlapping working hours can be tricky.</p>

<h3>Best overlapping window (UK Summer / AU Winter — 9h gap):</h3>
<ul>
<li><strong>8:00 AM – 10:00 AM London</strong> matches <strong>5:00 PM – 7:00 PM Sydney</strong>.</li>
<li>This early-morning UK / late-afternoon Sydney slot provides a clean 2-hour window for synchronized communication.</li>
</ul>

<h3>Best overlapping window (UK Winter / AU Summer — 11h gap):</h3>
<ul>
<li><strong>7:30 AM London</strong> matches <strong>6:30 PM Sydney</strong>.</li>
<li>Use asynchronous updates (Loom videos, written documentation) whenever possible during this stretch.</li>
</ul>

<p><em>Tip: Use the <strong>ClockHive AI Scheduler</strong> to automatically calculate sweet spots for multi-city calls without doing mental math.</em></p>

<h2 id="checklist">Quick Travel Essentials Checklist</h2>
<ul>
<li><strong>Plug Adapters:</strong> UK uses Type G (3-pin); Australia uses Type I (angled 2/3-pin).</li>
<li><strong>Transit Cards:</strong> Oyster or contactless pay for London Underground; Opal card or contactless for Sydney Trains &amp; Ferries.</li>
<li><strong>Arrival Preparation:</strong> Set up international roaming or download a regional eSIM before landing.</li>
</ul>`;

  const post = await p.blogPost.create({
    data: {
      title:
        "Navigating Extreme Time Differences: The Ultimate London to Sydney Travel & Timezone Guide",
      slug: "london-to-sydney-timezone-travel-guide",
      excerpt:
        "Master the 9-11 hour time gap between London and Sydney with practical strategies for jet lag, remote work coordination, and travel preparation.",
      content,
      status: "published",
      publishedAt: new Date(),
      categoryId: cat.id,
      tags: JSON.stringify([
        "travel",
        "london",
        "sydney",
        "jet-lag",
        "remote-work",
        "timezone",
      ]),
      seoTitle:
        "London to Sydney Timezone Guide — Jet Lag & Remote Work Tips | ClockHive",
      seoDescription:
        "Master the 9-11 hour time difference between London and Sydney. Practical jet lag strategies, meeting coordination tips, and travel essentials for remote workers.",
      seoKeywords:
        "london to sydney timezone, jet lag tips, london sydney time difference, remote work travel, timezone management",
    },
  });

  console.log("Blog post created:", post.slug);
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
