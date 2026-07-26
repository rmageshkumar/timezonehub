import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Ban, Trash2, Shield, Eye, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { favorites: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">{users.length} total users</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export Users
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Favorites</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-bold text-primary-600">
                        {user.name?.[0] || user.email[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{user.name || "Anonymous"}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === "super_admin" ? "bg-red-100 dark:bg-red-900/30 text-red-700" :
                      user.role === "admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700" :
                      user.role === "premium" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-600"
                    }`}>
                      <Shield className="w-3 h-3" /> {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700" :
                      user.status === "suspended" ? "bg-red-100 dark:bg-red-900/30 text-red-700" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}>{user.status}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{user._count.favorites}</td>
                  <td className="p-4 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500" title="Suspend">
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
