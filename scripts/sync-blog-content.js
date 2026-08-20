const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@libsql/client");
const fs = require("fs");

async function main() {
  // Read local blog post
  const p = new PrismaClient();
  const post = await p.blogPost.findUnique({
    where: { slug: "london-to-sydney-timezone-travel-guide" },
  });
  await p.$disconnect();
  if (!post) {
    console.log("Post not found locally");
    return;
  }

  // Connect to Turso
  const env = {};
  fs.readFileSync(".env", "utf-8")
    .split("\n")
    .forEach((l) => {
      const m = l.match(/^(\w+)\s*=\s*"(.+)"$/);
      if (m) env[m[1]] = m[2];
    });
  const c = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  // Update the content
  await c.execute({
    sql: "UPDATE blog_posts SET content = ? WHERE slug = ?",
    args: [post.content, post.slug],
  });
  console.log("✅ Full content synced to Turso");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
