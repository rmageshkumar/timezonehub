import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserDashboardClient } from "@/components/UserDashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const userId = (session.user as any).id;

  const [favorites, recentSearches, savedComparisons, loginHistory] = await Promise.all([
    prisma.userFavorite.findMany({
      where: { userId },
      include: { city: { include: { country: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const user = session.user;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserDashboardClient
            user={user}
            favorites={favorites}
            recentSearches={recentSearches}
            savedComparisons={savedComparisons}
            loginHistory={loginHistory}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
