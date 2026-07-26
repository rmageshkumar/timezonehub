import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (tursoUrl) {
    const libsql = createClient({ url: tursoUrl, authToken: tursoToken || undefined });
    return new PrismaClient({ adapter: new PrismaLibSQL(libsql) });
  }
  return new PrismaClient();
}

const prisma = createPrismaClient();

async function main() {
  const cities = await prisma.city.findMany({ where: { isActive: true }, include: { country: true } });
  const now = new Date();
  let correct = 0;
  let dstActive = 0;
  let wrong = 0;
  let invalid = 0;
  const errors: string[] = [];

  for (const city of cities) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: city.timezone,
        timeZoneName: "longOffset",
      }).formatToParts(now);

      const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "";
      const m = tzName.match(/GMT([+-]\d{2}):?(\d{2})?/);

      if (m) {
        const actual = m[1] + ":" + (m[2] || "00");
        const isDST = city.dstOffset && city.gmtOffset !== actual;
        const matchesDST = isDST && actual === city.dstOffset;

        if (actual === city.gmtOffset) {
          correct++;
        } else if (matchesDST) {
          dstActive++;
        } else {
          wrong++;
          errors.push(
            city.country.flag + " " + city.name + " (" + city.timezone +
            "): Std=" + city.gmtOffset +
            " DST=" + (city.dstOffset || "N/A") +
            " Actual=" + actual
          );
        }
      }
    } catch (e: any) {
      invalid++;
      errors.push(city.country.flag + " " + city.name + ": INVALID tz " + city.timezone);
    }
  }

  console.log("\nResults: Correct=" + correct + " DST-Active=" + dstActive + " Errors=" + wrong + " Invalid=" + invalid + " / " + cities.length);
  if (wrong === 0 && invalid === 0) {
    console.log("ALL " + cities.length + " CITIES VERIFIED CORRECT! (" + dstActive + " currently in DST)");
  } else {
    errors.slice(0, 15).forEach((e) => console.log("  " + e));
  }

  await prisma.$disconnect();
}

main();
