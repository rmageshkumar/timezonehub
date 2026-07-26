import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^(\w+)\s*=\s*"(.+)"$/);
  if (match) env[match[1]] = match[2];
});

const tursoUrl = process.env.TURSO_DATABASE_URL || env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN || env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.log("No Turso config in .env, skipping Turso migration");
  process.exit(0);
}

async function main() {
  const client = createClient({ url: tursoUrl, authToken: tursoToken });
  const sql = readFileSync("/tmp/alter-verification.sql", "utf-8");
  const statements = sql.split(";").map((s) => s.trim()).filter(Boolean);

  for (const stmt of statements) {
    try {
      await client.execute(stmt + ";");
      console.log("✅", stmt.substring(0, 70));
    } catch (err: any) {
      if (err.message?.includes("duplicate")) {
        console.log("⏭️", stmt.substring(0, 70), "(already exists)");
      } else {
        console.error("❌", stmt.substring(0, 70), "-", err.message);
      }
    }
  }
  console.log("Done");
}

main();
