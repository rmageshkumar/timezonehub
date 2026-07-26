export default function AdminSEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">SEO Manager</h1>
        <p className="text-sm text-slate-500 mt-1">Manage meta tags, sitemaps, and canonical URLs</p>
      </div>
      <div className="glass rounded-2xl p-6">
        <p className="text-slate-500 text-sm">
          SEO pages are auto-generated for every city and country. Configure global SEO settings and
          manage individual page overrides below.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-Generated Pages</div>
            <div className="text-2xl font-bold text-primary-500 mt-1">~200+</div>
            <div className="text-xs text-slate-500 mt-1">City & Country pages</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Sitemap Status</div>
            <div className="text-2xl font-bold text-green-500 mt-1">Active</div>
            <div className="text-xs text-slate-500 mt-1">Auto-updating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
