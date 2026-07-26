import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">{feedbacks.length} submissions</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["suggestion", "bug_report", "feature_request"] as const).map((type) => {
          const count = feedbacks.filter((f) => f.type === type).length;
          return (
            <div key={type} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{count}</div>
              <div className="text-xs text-slate-500 capitalize mt-1">{type.replace("_", " ")}s</div>
            </div>
          );
        })}
      </div>
      <div className="space-y-3">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="glass rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  fb.type === "bug_report" ? "bg-red-100 dark:bg-red-900/30 text-red-700" :
                  fb.type === "feature_request" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700" :
                  "bg-blue-100 dark:bg-blue-900/30 text-blue-700"
                }`}>{fb.type.replace("_", " ")}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  fb.status === "open" ? "bg-yellow-100 text-yellow-700" :
                  fb.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>{fb.status}</span>
              </div>
              <span className="text-xs text-slate-400">{fb.user?.name || "Anonymous"} · {formatDate(fb.createdAt)}</span>
            </div>
            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">{fb.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{fb.content}</p>
            {fb.adminReply && (
              <div className="mt-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-950 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-xs font-medium text-primary-600">Reply: </span>{fb.adminReply}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
