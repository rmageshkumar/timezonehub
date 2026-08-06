import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };

  const title = `${category.name} — Blog Category | ClockHive`;
  const description = category.description || `Browse all ${category.name} articles on ClockHive. Timezone tips, guides, and insights for remote teams.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/category/${slug}`,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/category/${slug}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.blogCategory.findUnique({
    where: { slug },
    include: { _count: { select: { posts: { where: { status: "published" } } } } },
  });

  if (!category) notFound();

  const posts = await prisma.blogPost.findMany({
    where: { categoryId: category.id, status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500 mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Category Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-500 text-sm font-medium mb-4">
              <FolderOpen className="w-4 h-4" />
              Category
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-sm text-slate-500 mt-3">
              {category._count.posts} article{category._count.posts !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
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
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 dark:text-slate-400">
                No published posts in this category yet.
              </p>
              <Link href="/blog" className="btn-primary mt-4 inline-block px-6 py-2 rounded-full">
                Browse All Posts
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
