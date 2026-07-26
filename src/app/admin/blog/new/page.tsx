"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface BlogCategory {
  id: string;
  name: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: "",
    tags: "",
    status: "draft",
    scheduledAt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    fetch("/api/admin/blog/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title
      if (field === "title" && !prev.slug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          excerpt: form.excerpt || null,
          content: form.content,
          featuredImage: form.featuredImage || null,
          categoryId: form.categoryId || null,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
          status: form.status,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          seoKeywords: form.seoKeywords || null,
        }),
      });

      if (res.ok) {
        toast.success("Blog post created!");
        router.push("/admin/blog");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create post");
      }
    } catch {
      toast.error("An error occurred");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">New Blog Post</h1>
            <p className="text-sm text-slate-500 mt-1">Create and publish a new article</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" /> {showPreview ? "Edit" : "Preview"}
          </button>
          <button
            type="submit"
            form="blog-form"
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : form.status === "published" ? "Publish" : "Save Draft"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="glass rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{form.title || "Untitled Post"}</h1>
          {form.excerpt && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 italic">{form.excerpt}</p>
          )}
          {form.featuredImage && (
            <img src={form.featuredImage} alt="" className="w-full rounded-xl mb-6 max-h-96 object-cover" />
          )}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: form.content || "<p>No content yet...</p>" }}
          />
        </div>
      ) : (
        <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="input-field text-lg font-semibold"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="input-field font-mono text-sm"
                placeholder="my-blog-post-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                className="input-field"
                placeholder="A brief summary of the post..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Content *</label>
              <textarea
                rows={14}
                required
                value={form.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="input-field font-mono text-sm"
                placeholder="Write your post content in HTML..."
              />
              <p className="text-xs text-slate-400 mt-1">Supports HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;, etc.</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Post Settings</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="input-field">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {form.status === "scheduled" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Publish Date</label>
                  <input type="datetime-local" value={form.scheduledAt} onChange={(e) => handleChange("scheduledAt", e.target.value)} className="input-field" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <select value={form.categoryId} onChange={(e) => handleChange("categoryId", e.target.value)} className="input-field">
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags</label>
                <input type="text" value={form.tags} onChange={(e) => handleChange("tags", e.target.value)} className="input-field" placeholder="timezone, remote-work, tips" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Featured Image URL</label>
                <input type="url" value={form.featuredImage} onChange={(e) => handleChange("featuredImage", e.target.value)} className="input-field" placeholder="https://example.com/image.jpg" />
                {form.featuredImage && (
                  <img src={form.featuredImage} alt="Preview" className="mt-2 rounded-lg h-24 object-cover" />
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">SEO Settings</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">SEO Title</label>
                <input type="text" value={form.seoTitle} onChange={(e) => handleChange("seoTitle", e.target.value)} className="input-field" placeholder="Custom SEO title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meta Description</label>
                <textarea rows={3} value={form.seoDescription} onChange={(e) => handleChange("seoDescription", e.target.value)} className="input-field" placeholder="Meta description for search engines..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Keywords</label>
                <input type="text" value={form.seoKeywords} onChange={(e) => handleChange("seoKeywords", e.target.value)} className="input-field" placeholder="keyword1, keyword2, keyword3" />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
