/**
 * One-off: add Dammam, Khobar and NEOM to the Saudi Arabia (SA) country in the
 * PROD Turso DB so `/country/sa` shows a full "Time across Saudi Arabia" list
 * and `/city/dammam`, `/city/khobar`, `/city/neom` become indexable city pages.
 *
 * Uses the PrismaLibSQL adapter + `.env` (like `src/lib/prisma.ts`) so it writes
 * to the REMOTE Turso DB, NOT local `prisma/dev.db`. Safe to re-run (upserts by
 * the `name_countryId` composite unique).
 *
 * Run:  npx tsx scripts/add-saudi-cities.ts
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

// Mirrors the "MORE SAUDI ARABIA CITIES" block in prisma/seed-data/countries.ts
const CITIES = [
  { name: "Dammam", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "DMM", latitude: 26.4207, longitude: 50.0888, population: 1203000 },
  { name: "Khobar", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: null, latitude: 26.2172, longitude: 50.1971, population: 660000 },
  { name: "NEOM", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: null, latitude: 28.1051, longitude: 35.2014, population: 5000 },
];

async function main() {
  const country = await prisma.country.findUnique({ where: { code: "SA" } });
  if (!country) {
    console.error("❌ Saudi Arabia (SA) not found in prod");
    process.exit(1);
  }

  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { name_countryId: { name: city.name, countryId: country.id } },
      update: {},
      create: { ...city, countryId: country.id },
    });
    console.log(`✅ ${city.name} (${city.timezone} UTC${city.gmtOffset})`);
  }

  const total = await prisma.city.count({ where: { countryId: country.id } });
  console.log(`🎉 Added ${CITIES.length} Saudi cities. Total cities for SA: ${total}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
