export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Track visitors, popular cities, ad revenue, and more</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Visitors", "Sessions", "Searches", "Ad Clicks"].map((label) => (
          <div key={label} className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">—</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Popular Cities</h3>
        <p className="text-sm text-slate-500">Analytics data will populate as visitors interact with the platform.</p>
      </div>
    </div>
  );
}
