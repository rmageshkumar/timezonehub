import { prisma } from "@/lib/prisma";
import { HomepageBuilderClient } from "@/components/HomepageBuilderClient";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Homepage Builder</h1>
        <p className="text-sm text-slate-500 mt-1">Enable, disable, and reorder homepage sections without code changes</p>
      </div>
      <HomepageBuilderClient initialSections={sections} />
    </div>
  );
}
