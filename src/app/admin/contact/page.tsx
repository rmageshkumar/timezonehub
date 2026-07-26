import { prisma } from "@/lib/prisma";
import { Mail, CheckCircle, XCircle, Reply } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Contact Messages</h1>
        <p className="text-sm text-slate-500 mt-1">{messages.length} messages</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{msg.name}</span>
                  <span className="text-xs text-slate-500 ml-2">{msg.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    msg.status === "unread" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700" :
                    msg.status === "read" ? "bg-slate-100 text-slate-500" :
                    "bg-green-100 dark:bg-green-900/30 text-green-700"
                  }`}>{msg.status}</span>
                  <span className="text-xs text-slate-400">{formatDate(msg.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{msg.message}</p>
              {msg.adminReply && (
                <div className="mt-2 p-3 rounded-lg bg-primary-50 dark:bg-primary-950">
                  <div className="text-xs font-medium text-primary-600 mb-1">Reply:</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{msg.adminReply}</p>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1">
                  <Reply className="w-3 h-3" /> Reply
                </button>
                <button className="text-xs text-green-500 hover:text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Mark Read
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
