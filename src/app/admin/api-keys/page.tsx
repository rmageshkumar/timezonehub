export default function AdminAPIPage() {
  const keys = ["Google Maps", "OpenWeather", "Google Analytics", "AdSense", "SMTP", "Cloudflare", "Mailchimp"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">API Keys</h1>
        <p className="text-sm text-slate-500 mt-1">Manage third-party integration keys</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        {keys.map((name) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
            <input type="password" className="input-field max-w-xs" placeholder="Enter API key..." />
          </div>
        ))}
      </div>
    </div>
  );
}
