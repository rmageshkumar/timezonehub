import { prisma } from "@/lib/prisma";
import { ThemeEditor } from "@/components/ThemeEditor";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const theme = await prisma.themeConfig.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Theme Manager</h1>
        <p className="text-sm text-slate-500 mt-1">Customize the look and feel of your platform</p>
      </div>
      <ThemeEditor initialTheme={theme} />
    </div>
  );
}
