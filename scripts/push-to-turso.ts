import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

// Read from .env manually
const envContent = readFileSync(".env", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^(\w+)\s*=\s*"(.+)"$/);
  if (match) env[match[1]] = match[2];
});

const tursoUrl = env.TURSO_DATABASE_URL;
const tursoToken = env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const client = createClient({ url: tursoUrl, authToken: tursoToken });

async function main() {
  const sql = readFileSync("/tmp/turso-schema.sql", "utf-8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await client.execute(stmt + ";");
      console.log("✅", stmt.split("\n")[0].trim());
    } catch (err: any) {
      console.error("❌", stmt.split("\n")[0].trim(), "-", err.message);
    }
  }

  console.log("\n🎉 Schema pushed to Turso!");
}

main().catch(console.error);
