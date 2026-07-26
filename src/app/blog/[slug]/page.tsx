import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { category: true, comments: { where: { status: "approved" }, orderBy: { createdAt: "desc" } } },
  });

  if (!post || post.status !== "published") notFound();

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  // Related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "published",
      id: { not: post.id },
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Header */}
          {post.category && (
            <span className="text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-950 px-2.5 py-1 rounded-full">
              {post.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.viewCount} views</span>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <img src={post.featuredImage} alt={post.title} className="w-full rounded-2xl mb-8" />
          )}

          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              {(JSON.parse(post.tags) as string[]).map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Comments ({post.comments.length})
            </h2>
            {post.comments.map((comment) => (
              <div key={comment.id} className="glass rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-bold text-primary-600">
                    {comment.authorName[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{comment.authorName}</div>
                    <div className="text-xs text-slate-500">{formatDate(comment.createdAt)}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="glass rounded-xl p-4 card-hover">
                    <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">{rp.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{rp.publishedAt ? formatDate(rp.publishedAt) : ""}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
