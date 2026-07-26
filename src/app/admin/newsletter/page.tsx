import { prisma } from "@/lib/prisma";
import { Download, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Newsletter</h1>
          <p className="text-sm text-slate-500 mt-1">{subscribers.length} subscribers</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Source</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-4 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {sub.email}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${sub.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{sub.source || "—"}</td>
                <td className="p-4 text-sm text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
