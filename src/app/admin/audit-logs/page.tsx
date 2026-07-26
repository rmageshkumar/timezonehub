import { prisma } from "@/lib/prisma";
import { Clock, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Track every admin action</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No audit logs yet</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-slate-700 dark:text-slate-300 capitalize">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  {log.details && (
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      {log.details.length > 50 ? log.details.slice(0, 50) + "..." : log.details}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {log.user?.name || log.user?.email || "System"}
                </span>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
