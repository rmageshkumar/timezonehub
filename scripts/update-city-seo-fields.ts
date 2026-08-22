/**
 * Idempotent: adds the `region` + `seoFaqs` columns to `cities` and backfills them
 * for the SEO target cities (US state names for titles, city-specific FAQs like
 * "What is DC time?" / "What is GVA time?").
 *
 * Additive only — never deletes/overwrites unrelated data. Safe to re-run.
 * Run with: npx tsx scripts/update-city-seo-fields.ts   (--check = read-only)
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
  console.error("❌ Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const client = createClient({ url: tursoUrl, authToken: tursoToken });

/** US cities that get "<city> <state>" search queries — state goes in the SEO title. */
const REGIONS: { name: string; region: string }[] = [
  { name: "New York", region: "New York" },
  { name: "Los Angeles", region: "California" },
  { name: "San Francisco", region: "California" },
  { name: "Seattle", region: "Washington" },
  { name: "Chicago", region: "Illinois" },
  { name: "Houston", region: "Texas" },
  { name: "Dallas", region: "Texas" },
  { name: "Phoenix", region: "Arizona" },
  { name: "Denver", region: "Colorado" },
  { name: "Miami", region: "Florida" },
  { name: "Boston", region: "Massachusetts" },
  { name: "Washington DC", region: "District of Columbia" },
  { name: "Anchorage", region: "Alaska" },
  { name: "Honolulu", region: "Hawaii" },
];

/** City-specific FAQs (JSON array of {q, a}) merged into the city page FAQ + JSON-LD. */
const SEO_FAQS: { name: string; faqs: { q: string; a: string }[] }[] = [
  {
    name: "Washington DC",
    faqs: [
      { q: "What is DC time?", a: "\"DC time\" is shorthand for the local time in Washington DC, the capital of the United States. Washington DC uses Eastern Time (America/New_York, UTC-5, UTC-4 during daylight saving time)." },
      { q: "Is Washington DC on Eastern Time?", a: "Yes — Washington DC is in the Eastern Time Zone (America/New_York). Its offset is UTC-5, moving to UTC-4 during daylight saving time." },
    ],
  },
  {
    name: "Geneva",
    faqs: [
      { q: "What is GVA time?", a: "GVA is the IATA airport code for Geneva. Geneva is on Central European Time (Europe/Zurich, UTC+1, UTC+2 during daylight saving time)." },
    ],
  },
  {
    name: "Jeddah",
    faqs: [
      { q: "What is JED time?", a: "JED is the IATA airport code for Jeddah. Jeddah is on Arabian Standard Time (Asia/Riyadh, UTC+3) and does not observe daylight saving time." },
    ],
  },
  {
    name: "Incheon",
    faqs: [
      { q: "What is ICN time?", a: "ICN is the IATA airport code for Incheon. Incheon is on Korea Standard Time (Asia/Seoul, UTC+9) and does not observe daylight saving time." },
    ],
  },
  {
    name: "Brisbane",
    faqs: [
      { q: "What is BNE time?", a: "BNE is the IATA airport code for Brisbane. Brisbane is on Australian Eastern Standard Time (Australia/Brisbane, UTC+10) and does not observe daylight saving time." },
    ],
  },
];

async function columnExists(table: string, column: string): Promise<boolean> {
  const res = await client.execute({ sql: `PRAGMA table_info(${table})`, args: [] });
  return res.rows.some((r) => r.name === column);
}

async function main() {
  const us = await client.execute({ sql: "SELECT id FROM countries WHERE code = 'US' LIMIT 1", args: [] });
  if (us.rows.length === 0) {
    console.error("❌ United States (US) not found in countries table");
    process.exit(1);
  }
  const usId = us.rows[0].id as string;

  console.log(`${CHECK_ONLY ? "🔍 (--check)" : "🔧"} Updating city SEO fields...`);

  // 1. Add columns (additive) if missing
  for (const col of ["region", "seoFaqs"]) {
    const exists = await columnExists("cities", col);
    if (exists) {
      console.log(`ℹ️  column cities.${col} already exists`);
    } else if (CHECK_ONLY) {
      console.log(`⚠️  (--check) cities.${col} missing — would ALTER TABLE`);
    } else {
      await client.execute({ sql: `ALTER TABLE cities ADD COLUMN ${col} TEXT`, args: [] });
      console.log(`✅ added cities.${col}`);
    }
  }

  // 2. Backfill region for US cities
  for (const { name, region } of REGIONS) {
    const res = await client.execute({
      sql: "SELECT id, region FROM cities WHERE name = ? AND countryId = ? AND isActive = 1 LIMIT 1",
      args: [name, usId],
    });
    if (res.rows.length === 0) {
      console.log(`⚠️  no active US city named "${name}"`);
      continue;
    }
    const row = res.rows[0];
    if (row.region === region) {
      console.log(`ℹ️  ${name} region already set (${region})`);
    } else if (CHECK_ONLY) {
      console.log(`ℹ️  ${name} region would be "${region}" (currently ${row.region ?? "unset"})`);
    } else {
      await client.execute({
        sql: "UPDATE cities SET region = ?, updatedAt = datetime('now') WHERE id = ?",
        args: [region, row.id as string],
      });
      console.log(`✅ ${name} → region "${region}"`);
    }
  }

  // 3. Backfill seoFaqs
  for (const { name, faqs } of SEO_FAQS) {
    const res = await client.execute({
      sql: "SELECT id, seoFaqs FROM cities WHERE name = ? AND isActive = 1 LIMIT 1",
      args: [name],
    });
    if (res.rows.length === 0) {
      console.log(`⚠️  no active city named "${name}"`);
      continue;
    }
    const row = res.rows[0];
    const json = JSON.stringify(faqs);
    if (row.seoFaqs === json) {
      console.log(`ℹ️  ${name} seoFaqs already set`);
    } else if (CHECK_ONLY) {
      console.log(`ℹ️  ${name} seoFaqs would be set (${faqs.length} Q&A)`);
    } else {
      await client.execute({
        sql: "UPDATE cities SET seoFaqs = ?, updatedAt = datetime('now') WHERE id = ?",
        args: [json, row.id as string],
      });
      console.log(`✅ ${name} seoFaqs (${faqs.length} Q&A)`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  });
