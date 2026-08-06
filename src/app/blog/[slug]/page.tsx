import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogPostingSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { SocialShare } from "@/components/SocialShare";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { Calendar, Clock, User, ArrowLeft, BookOpen, Tag } from "lucide-react";
import { formatDate, addHeadingIds, readingTime } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      images: post.featuredImage ? [post.featuredImage] : [],
      url: `${BASE_URL}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
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
    include: { category: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const tags = post.tags ? (JSON.parse(post.tags) as string[]) : [];
  const postContent = addHeadingIds(post.content);
  const readTime = readingTime(post.content);

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <BlogPostingSchema post={post} url={postUrl} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Blog", url: `${BASE_URL}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <Navbar />
      <main className="flex-1 py-12">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500 mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="inline-block text-xs font-semibold text-primary-500 bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900 px-3 py-1 rounded-full mb-4 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.viewCount} views
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full rounded-2xl mb-10 object-cover max-h-96"
            />
          )}

          {/* Content with TOC */}
          <div className="lg:flex lg:gap-10">
            <TableOfContents content={post.content} />

            <div className="min-w-0 flex-1">
              <div
                className="prose dark:prose-invert max-w-none
                  prose-headings:scroll-mt-20 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-base prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                  prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-table:text-sm prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:px-3 prose-th:py-2
                  prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-slate-700"
                dangerouslySetInnerHTML={{ __html: postContent }}
              />
            </div>
          </div>

          {/* Author Card */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                CH
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">ClockHive Team</div>
                <p className="text-sm text-slate-500 mt-1">
                  Helping remote teams and global professionals master time zones. We build tools that make distributed work effortless.
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Tag className="w-4 h-4 text-slate-400" />
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-500 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share */}
          <SocialShare
            url={postUrl}
            title={post.seoTitle || post.title}
            description={post.seoDescription || post.excerpt || ""}
          />

          {/* Newsletter/CTA */}
          <div className="mt-10 glass rounded-2xl p-8 text-center bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/40 dark:to-accent-950/40 border border-primary-100 dark:border-primary-900/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              🌍 Never miss a timezone tip
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
              Get the latest guides on remote work, timezone management, and global team productivity.
            </p>
            <Link
              href="/auth/register"
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
            >
              Create Free Account
            </Link>
          </div>

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
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="glass rounded-xl p-5 card-hover group"
                  >
                    {rp.category && (
                      <span className="text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">
                        {rp.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-3 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">{rp.publishedAt ? formatDate(rp.publishedAt) : ""}</p>
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
