import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const ADMIN_PASSWORD = "Cl0ckH1ve!Adm1n#2026";
const DEMO_PASSWORD = "Dem0!Cl0ckH1ve#2026";

export async function seedUsers(prisma: PrismaClient) {
  const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@clockhive.cc" },
    update: { password: adminPassword },
    create: {
      name: "Super Admin",
      email: "admin@clockhive.cc",
      password: adminPassword,
      role: "super_admin",
      status: "active",
    },
  });
  console.log("✅ Admin user ready:", admin.email);

  const userPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: "demo@clockhive.cc" },
    update: { password: userPassword },
    create: {
      name: "Demo User",
      email: "demo@clockhive.cc",
      password: userPassword,
      role: "user",
      status: "active",
    },
  });
  console.log("✅ Demo user ready");
}
