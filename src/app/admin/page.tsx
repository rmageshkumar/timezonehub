import { prisma } from "@/lib/prisma";
import {
  Users, Globe, Search, TrendingUp, DollarSign, Eye,
  ArrowUp, ArrowDown, MapPin, Activity, Clock, Megaphone
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const [
    totalUsers, activeUsers, countries, cities, searchesToday,
    totalAdImpressions, totalAdClicks, blogPosts, feedbacks,
    contactMessages, newsletterSubs
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "active" } }),
    prisma.country.count({ where: { isActive: true } }),
    prisma.city.count({ where: { isActive: true } }),
    prisma.analyticsEvent.count({
      where: {
        type: "search",
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.advertisement.aggregate({ _sum: { impressions: true } }),
    prisma.advertisement.aggregate({ _sum: { clicks: true } }),
    prisma.blogPost.count(),
    prisma.feedback.count({ where: { status: "open" } }),
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.newsletterSubscriber.count({ where: { status: "active" } }),
  ]);

  // Recent analytics for chart
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const dailyVisits = await Promise.all(
    last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const count = await prisma.analyticsEvent.count({
        where: {
          type: "pageview",
          createdAt: { gte: date, lt: nextDay },
        },
      });
      return { date: date.toLocaleDateString("en-US", { weekday: "short" }), count };
    })
  );

  // Top countries by city count
  const topCountries = await prisma.country.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    take: 5,
    include: { _count: { select: { cities: true } } },
  });

  // Recent audit logs
  const recentAuditLogs = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return {
    totalUsers, activeUsers, countries, cities, searchesToday,
    totalAdImpressions: totalAdImpressions._sum.impressions || 0,
    totalAdClicks: totalAdClicks._sum.clicks || 0,
    blogPosts, openFeedback: feedbacks, unreadMessages: contactMessages,
    newsletterSubs, dailyVisits, topCountries, recentAuditLogs,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your ClockHive platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Active Users" value={stats.activeUsers} color="green" />
        <StatCard icon={<Globe className="w-5 h-5" />} label="Countries" value={stats.countries} color="purple" />
        <StatCard icon={<MapPin className="w-5 h-5" />} label="Cities" value={stats.cities} color="orange" />
        <StatCard icon={<Search className="w-5 h-5" />} label="Searches Today" value={stats.searchesToday} color="indigo" />
        <StatCard icon={<Eye className="w-5 h-5" />} label="Ad Impressions" value={stats.totalAdImpressions} color="pink" />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Ad Clicks" value={stats.totalAdClicks} color="emerald" />
        <StatCard icon={<Megaphone className="w-5 h-5" />} label="Blog Posts" value={stats.blogPosts} color="cyan" />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Open Feedback" value={stats.openFeedback} color="red" />
        <StatCard icon={<MailIcon className="w-5 h-5" />} label="Unread Messages" value={stats.unreadMessages} color="yellow" />
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits Chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Daily Visits (Last 7 Days)</h3>
          <div className="flex items-end gap-2 h-40">
            {stats.dailyVisits.map((day, i) => {
              const maxCount = Math.max(...stats.dailyVisits.map(d => d.count), 1);
              const height = (day.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{day.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-400 to-primary-300 transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-xs text-slate-500">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Countries */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {stats.topCountries.map((country, i) => (
              <div key={country.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-400 w-5">{i + 1}</span>
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{country.name}</span>
                </div>
                <span className="text-xs text-slate-500">{country._count.cities} cities</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Audit Logs */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
        {stats.recentAuditLogs.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {stats.recentAuditLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 capitalize">{log.action.replace(/_/g, " ")}</span>
                {log.user && (
                  <span className="text-slate-400 text-xs">by {log.user.name || log.user.email}</span>
                )}
                <span className="text-slate-400 text-xs ml-auto">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-500",
    green: "bg-green-50 dark:bg-green-950 text-green-500",
    purple: "bg-purple-50 dark:bg-purple-950 text-purple-500",
    orange: "bg-orange-50 dark:bg-orange-950 text-orange-500",
    indigo: "bg-indigo-50 dark:bg-indigo-950 text-indigo-500",
    pink: "bg-pink-50 dark:bg-pink-950 text-pink-500",
    emerald: "bg-emerald-50 dark:bg-emerald-950 text-emerald-500",
    cyan: "bg-cyan-50 dark:bg-cyan-950 text-cyan-500",
    red: "bg-red-50 dark:bg-red-950 text-red-500",
    yellow: "bg-yellow-50 dark:bg-yellow-950 text-yellow-500",
  };

  return (
    <div className="glass rounded-2xl p-4 card-hover">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${colorMap[color] || colorMap.blue} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Simple mail icon since we already imported MessageSquare but need Mail
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
