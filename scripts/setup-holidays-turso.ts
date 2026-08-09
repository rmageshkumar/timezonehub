/**
 * One-time script: creates the public_holidays table on Turso
 * Run with: npx tsx scripts/setup-holidays-turso.ts
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
CREATE TABLE IF NOT EXISTS "public_holidays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localName" TEXT,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'public',
    "isRecurring" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "countryId_name_date" ON "public_holidays"("countryId", "name", "date");
`;

async function main() {
  console.log("🔧 Creating public_holidays table on Turso...");

  // Split into separate statements (Turso/libsql doesn't support multi-statement)
  const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    await client.execute(stmt + ";");
  }

  console.log("✅ public_holidays table created on Turso!");

  // Verify
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='public_holidays'");
  if (result.rows.length > 0) {
    console.log("✅ Verified: public_holidays table exists");
  }
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  });
