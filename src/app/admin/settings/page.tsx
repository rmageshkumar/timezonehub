import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage platform settings</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
