import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, Tag, FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Timezone Tips & Guides | ClockHive",
  description: "Expert tips on timezone management, remote work, meeting scheduling, and global team coordination.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  const categories = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Blog</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Tips, guides, and insights about timezone management
            </p>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-500 transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  {cat.name}
                  <span className="text-xs opacity-60">({cat._count.posts})</span>
                </Link>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="glass rounded-2xl overflow-hidden card-hover group"
              >
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">
                      {post.category.name}
                    </span>
                  )}
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-3 group-hover:text-primary-500 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.viewCount} views
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
