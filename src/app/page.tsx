import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountryCard } from "@/components/CountryCard";
import { AdUnit } from "@/components/AdUnit";
import { HeroSearch } from "@/components/HeroSearch";
import { Timeline } from "@/components/Timeline";
import { Globe, ArrowRight, Search, Zap, Users, TrendingUp, ArrowLeftRight, Calendar, Sparkles, Play, ShieldCheck, Star, Briefcase } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getFeaturedCountries() {
  return prisma.country.findMany({
    where: { isActive: true },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
        take: 10,
        include: { country: true },
      },
    },
    orderBy: { displayOrder: "asc" },
    take: 15,
  });
}

async function getStats() {
  const [countries, cities, timezones] = await Promise.all([
    prisma.country.count({ where: { isActive: true } }),
    prisma.city.count({ where: { isActive: true } }),
    prisma.timezone.count(),
  ]);
  return { countries, cities, timezones };
}

export default async function HomePage() {
  const countries = await getFeaturedCountries();
  const stats = await getStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              The #1 Timezone Platform for Remote Teams
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="gradient-text">ClockHive</span>
              <br />
              <span className="text-slate-900 dark:text-slate-100">Every Timezone,</span>
              <br />
              <span className="text-slate-900 dark:text-slate-100">One Beautiful Platform</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Compare world times, plan meetings across time zones, and manage your global team
              with the most intuitive timezone platform ever built.
            </p>

            {/* Hero Search */}
            <HeroSearch />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">{stats.countries}+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">{stats.cities}+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">{stats.timezones}+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Timezones</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Header Banner Ad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit placement="header_banner" className="flex justify-center" />
      </section>

      {/* Timeline Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              World Time Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              See current times across major cities at a glance
            </p>
          </div>
          <Timeline cities={countries.flatMap(c => c.cities).slice(0, 12).map(city => ({
            id: city.id,
            name: city.name,
            timezone: city.timezone,
            countryName: city.country.name,
            countryFlag: city.country.flag,
          }))} />
        </div>
      </section>

      {/* Full Width Banner After Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit placement="full_width_timeline" className="flex justify-center" />
      </section>

      {/* Featured Countries */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                <Globe className="w-6 h-6 inline mr-2 text-primary-500" />
                Featured Countries
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Explore time zones across the world&apos;s most popular countries
              </p>
            </div>
            <Link
              href="/countries"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              View All Countries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country, index) => (
              <div key={country.id}>
                <CountryCard country={country} />
                {/* Native Ad every 5 cards */}
                {(index + 1) % 5 === 0 && index < countries.length - 1 && (
                  <div className="mt-6">
                    <AdUnit placement="between_cards" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/countries"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Countries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Why ClockHive?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Built for modern distributed teams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Smart Search"
              description="Search by city, country, airport code, timezone abbreviation, or country code in seconds."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Meeting Planner"
              description="Find the perfect meeting time across multiple time zones with our intelligent overlap finder."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Always Up-to-Date"
              description="Automatic DST adjustments and real-time timezone data keep you accurate year-round."
            />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Everything You Need to Master Time Zones
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              A complete toolkit for global teams and remote workers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard icon={<Globe className="w-5 h-5" />} title="Country Explorer" desc="Browse 126+ countries with accurate timezone data" href="/countries" />
            <ToolCard icon={<ArrowLeftRight className="w-5 h-5" />} title="Time Converter" desc="Convert times between any two cities instantly" href="/converter" />
            <ToolCard icon={<Briefcase className="w-5 h-5" />} title="Business Hours" desc="Find the common window when everyone is at work" href="/business-time" />
            <ToolCard icon={<Calendar className="w-5 h-5" />} title="Meeting Planner" desc="Find overlapping working hours across multiple cities" href="/meeting-planner" />
            <ToolCard icon={<Sparkles className="w-5 h-5" />} title="AI Scheduler" desc="Let AI find the best meeting time with smart scoring" href="/ai-scheduler" />
            <ToolCard icon={<Play className="w-5 h-5" />} title="Scrum Poker" desc="Agile estimation tool for distributed development teams" href="/scrum-poker" />
            <ToolCard icon={<Search className="w-5 h-5" />} title="Smart Search" desc="Search by city, airport code, timezone, or country" href="/search" />
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Trusted by Remote Teams Worldwide
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Join thousands of professionals who manage time zones smarter
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "ClockHive replaced 3 different tools we were using. The meeting planner alone saves us hours every week.",
                name: "Sarah Chen",
                role: "Engineering Manager, Remote-First Startup",
              },
              {
                quote: "Finally, a timezone tool that's both powerful AND beautiful. The AI scheduler is surprisingly accurate.",
                name: "Marcus Rivera",
                role: "Product Designer, Distributed Agency",
              },
              {
                quote: "We use ClockHive daily for our standup scheduling across 8 time zones. The scrum poker is a bonus!",
                name: "Priya Patel",
                role: "Scrum Master, Global SaaS Company",
              },
            ].map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 relative">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Master Time Zones?
          </h2>
          <p className="text-white/80 mb-8">
            Join thousands of remote workers and global teams using ClockHive.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register" className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg">
              Get Started Free
            </Link>
            <Link href="/countries" className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Explore Countries
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-2xl p-6 text-center card-hover">
      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mx-auto mb-4">
        <div className="text-primary-500">{icon}</div>
      </div>
      <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function ToolCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="glass rounded-2xl p-6 card-hover flex items-start gap-4 group">
      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
        <div className="text-primary-500">{icon}</div>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
    </Link>
  );
}
