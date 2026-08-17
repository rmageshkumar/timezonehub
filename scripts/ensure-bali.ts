/**
 * Idempotent: ensures the Bali city (Denpasar alias + DPS airport code) exists
 * in the production Turso DB, and that /city/bali + /city/denpasar resolve.
 *
 * Run with: npx tsx scripts/ensure-bali.ts
 * (reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from .env)
 *
 * Pass --check to run read-only (report only, no writes).
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const CHECK_ONLY = process.argv.includes("--check");

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

const BALI = {
  name: "Bali",
  countryCode: "ID",
  timezone: "Asia/Makassar",
  gmtOffset: "+08:00",
  airportCode: "DPS",
  latitude: -8.4095,
  longitude: 115.1889,
  population: 726000,
  aliases: JSON.stringify(["Denpasar"]),
};

async function main() {
  console.log(`${CHECK_ONLY ? "🔍 (--check) Verifying" : "🔧 Ensuring"} Bali in production DB...`);

  const country = await client.execute({ sql: "SELECT id FROM countries WHERE code = ? LIMIT 1", args: [BALI.countryCode] });
  if (country.rows.length === 0) {
    console.error("❌ Indonesia (ID) not found — run `npm run db:seed` first.");
    process.exit(1);
  }
  const countryId = country.rows[0].id as string;

  const existing = await client.execute({
    sql: "SELECT id, airportCode, aliases FROM cities WHERE name = ? AND countryId = ? LIMIT 1",
    args: [BALI.name, countryId],
  });

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    console.log(`ℹ️  Bali exists (id=${row.id}, airport=${row.airportCode}, aliases=${row.aliases})`);
    if (CHECK_ONLY) {
      console.log(
        row.airportCode === "DPS" && String(row.aliases).includes("Denpasar")
          ? "✅ Bali already has DPS + Denpasar alias — nothing to do"
          : "⚠️ Bali is missing DPS/Denpasar alias — run without --check to fix"
      );
      return;
    }
    await client.execute({
      sql: `UPDATE cities
         SET airportCode = ?, timezone = ?, gmtOffset = ?, aliases = ?, isActive = 1,
             updatedAt = datetime('now')
       WHERE id = ?`,
      args: [BALI.airportCode, BALI.timezone, BALI.gmtOffset, BALI.aliases, row.id as string],
    });
    console.log("✅ Updated Bali with DPS + Denpasar alias");
  } else {
    if (CHECK_ONLY) {
      console.log("⚠️ Bali NOT in production DB — run without --check to insert it");
      return;
    }
    await client.execute({
      sql: `INSERT INTO cities
         (id, name, countryId, timezone, gmtOffset, dstOffset, airportCode, aliases,
          latitude, longitude, population, isActive, displayOrder, createdAt, updatedAt)
       VALUES
         (lower(hex(randomblob(8))), ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, 1, 0, datetime('now'), datetime('now'))`,
      args: [BALI.name, countryId, BALI.timezone, BALI.gmtOffset, BALI.airportCode, BALI.aliases, BALI.latitude, BALI.longitude, BALI.population],
    });
    console.log("✅ Bali inserted");
  }

  // Verify the lookups the /city route performs
  const bySlug = await client.execute({ sql: "SELECT id FROM cities WHERE name = ? AND isActive = 1 LIMIT 1", args: [BALI.name] });
  const byCode = await client.execute({ sql: "SELECT name FROM cities WHERE airportCode = ? AND isActive = 1 LIMIT 1", args: [BALI.airportCode] });
  const byAlias = await client.execute({ sql: "SELECT name FROM cities WHERE aliases LIKE ? AND isActive = 1 LIMIT 1", args: ["%Denpasar%"] });

  console.log(bySlug.rows.length ? "✅ /city/bali resolves" : "⚠️ /city/bali NOT found");
  console.log(byCode.rows.length ? `✅ airport lookup DPS → ${byCode.rows[0].name}` : "⚠️ airport lookup DPS failed");
  console.log(byAlias.rows.length ? `✅ alias lookup denpasar → ${byAlias.rows[0].name}` : "⚠️ alias lookup denpasar failed");
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  });
