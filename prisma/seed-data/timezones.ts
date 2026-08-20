import { PrismaClient } from "@prisma/client";

export async function seedTimezones(prisma: PrismaClient) {
  const timezones = [
    { name: "Pacific/Midway", offset: "-11:00", abbr: "SST" },
    { name: "Pacific/Honolulu", offset: "-10:00", abbr: "HST" },
    { name: "Pacific/Gambier", offset: "-09:00", abbr: "GAMT" },
    { name: "America/Anchorage", offset: "-09:00", abbr: "AKST" },
    { name: "America/Los_Angeles", offset: "-08:00", abbr: "PST" },
    { name: "America/Denver", offset: "-07:00", abbr: "MST" },
    { name: "America/Chicago", offset: "-06:00", abbr: "CST" },
    { name: "America/New_York", offset: "-05:00", abbr: "EST" },
    { name: "America/Halifax", offset: "-04:00", abbr: "AST" },
    { name: "America/Sao_Paulo", offset: "-03:00", abbr: "BRT" },
    { name: "Atlantic/South_Georgia", offset: "-02:00", abbr: "GST" },
    { name: "Atlantic/Azores", offset: "-01:00", abbr: "AZOT" },
    { name: "Europe/London", offset: "+00:00", abbr: "GMT" },
    { name: "Europe/Paris", offset: "+01:00", abbr: "CET" },
    { name: "Europe/Helsinki", offset: "+02:00", abbr: "EET" },
    { name: "Europe/Moscow", offset: "+03:00", abbr: "MSK" },
    { name: "Asia/Dubai", offset: "+04:00", abbr: "GST" },
    { name: "Asia/Karachi", offset: "+05:00", abbr: "PKT" },
    { name: "Asia/Kolkata", offset: "+05:30", abbr: "IST" },
    { name: "Asia/Dhaka", offset: "+06:00", abbr: "BST" },
    { name: "Asia/Bangkok", offset: "+07:00", abbr: "ICT" },
    { name: "Asia/Shanghai", offset: "+08:00", abbr: "CST" },
    { name: "Asia/Tokyo", offset: "+09:00", abbr: "JST" },
    { name: "Australia/Sydney", offset: "+10:00", abbr: "AEST" },
    { name: "Pacific/Norfolk", offset: "+11:00", abbr: "NFT" },
    { name: "Pacific/Auckland", offset: "+12:00", abbr: "NZST" },
    { name: "Pacific/Tongatapu", offset: "+13:00", abbr: "TOT" },
    { name: "Pacific/Kiritimati", offset: "+14:00", abbr: "LINT" },
  ];

  for (const tz of timezones) {
    await prisma.timezone.upsert({ where: { name: tz.name }, update: {}, create: tz });
  }
  console.log(`✅ ${timezones.length} timezones seeded`);
}
