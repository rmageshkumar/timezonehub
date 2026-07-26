import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Views</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{post.title}</div>
                    <div className="text-xs text-slate-500">/{post.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-slate-500">{post.category?.name || "—"}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${
                      post.status === "published" ? "bg-green-100 dark:bg-green-900/30 text-green-700" :
                      post.status === "draft" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}>{post.status}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{post.viewCount}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link href={`/blog/${post.slug}`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400" target="_blank">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/admin/blog/${post.id}/edit`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
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
