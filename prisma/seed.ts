import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { seedUsers } from "./seed-data/users";
import { seedCountries } from "./seed-data/countries";
import { seedTimezones } from "./seed-data/timezones";
import { seedSettings } from "./seed-data/settings";
import { seedBlogPosts } from "./seed-data/blog-posts";
import { seedAttractions } from "./seed-data/attractions";
import { seedPublicHolidays } from "./seed-data/public-holidays";

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (tursoUrl) {
    return new PrismaClient({ adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken || undefined }) });
  }
  return new PrismaClient();
}

const prisma = createPrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  await seedUsers(prisma);
  await seedCountries(prisma);
  await seedTimezones(prisma);
  await seedSettings(prisma);
  await seedBlogPosts(prisma);
  await seedAttractions(prisma);
  await seedPublicHolidays(prisma);

  console.log("\n🎉 Seeding complete\!");
  console.log("📧 Admin login: admin@clockhive.cc / Cl0ckH1ve\!Adm1n#2026");
  console.log("📧 Demo login:  demo@clockhive.cc / Dem0\!Cl0ckH1ve#2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
