/**
 * One-time script: creates the attractions table on Turso
 * Run with: npx tsx scripts/setup-attractions-turso.ts
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^(\w+)\s*=\s*"(.+)"$/);
  if (match) env[match[1]] = match[2].trim();
});

const tursoUrl = env.TURSO_DATABASE_URL;
const tursoToken = env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const client = createClient({ url: tursoUrl, authToken: tursoToken });

const sql = `
CREATE TABLE IF NOT EXISTS "attractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "distanceKm" REAL,
    "travelTime" TEXT,
    "area" TEXT,
    "suggestedDay" INTEGER,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("cityId") REFERENCES "cities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
`;

async function main() {
  console.log("🔧 Creating attractions table on Turso...");
  await client.execute(sql);
  console.log("✅ Attractions table created on Turso!");

  // Verify
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='attractions'");
  if (result.rows.length > 0) {
    console.log("✅ Verified: attractions table exists");
  }
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  });
