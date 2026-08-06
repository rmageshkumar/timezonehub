import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Code2, Key, Server, Globe, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | ClockHive",
  description:
    "ClockHive API documentation — Integrate timezone data, conversions, and meeting scheduling into your applications.",
};

const endpoints = [
  {
    method: "POST",
    path: "/api/auth/register",
    description: "Register a new user account",
    category: "Authentication",
    icon: Key,
  },
  {
    method: "GET",
    path: "/api/search",
    description: "Search for cities and timezone data",
    category: "Data",
    icon: Globe,
  },
  {
    method: "POST",
    path: "/api/contact",
    description: "Submit a contact form message",
    category: "Forms",
    icon: Server,
  },
  {
    method: "POST",
    path: "/api/feedback",
    description: "Submit user feedback",
    category: "Forms",
    icon: Server,
  },
  {
    method: "GET",
    path: "/api/calendar/ics",
    description: "Generate ICS calendar feed for meetings",
    category: "Calendar",
    icon: Shield,
  },
  {
    method: "POST",
    path: "/api/scrum-poker",
    description: "Scrum poker estimation endpoint",
    category: "Tools",
    icon: Zap,
  },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-500 text-sm font-medium mb-4">
              <Code2 className="w-4 h-4" />
              Developer Resources
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              API Documentation
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Integrate ClockHive&apos;s timezone data, conversions, and meeting
              scheduling into your own applications.
            </p>
          </div>

          {/* API Endpoints */}
          <div className="space-y-6">
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon;
              return (
                <div
                  key={endpoint.path}
                  className="glass rounded-2xl p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            endpoint.method === "GET"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                              : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">
                          {endpoint.path}
                        </code>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {endpoint.description}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                      {endpoint.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Authentication Info */}
          <div className="mt-12 glass rounded-2xl p-8 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/40 dark:to-accent-950/40 border border-primary-100 dark:border-primary-900/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Authentication
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Most API endpoints require authentication. Use your ClockHive
              account credentials to obtain a session token. For public data
              endpoints, no authentication is required.
            </p>
            <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`// Example: Use with fetch
const res = await fetch("https://clockhive.cc/api/search?q=London", {
  headers: {
    "Content-Type": "application/json",
  },
});
const data = await res.json();`}
              </pre>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="mt-8 glass rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Rate Limits &amp; Fair Use
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              To ensure service quality for all users, we enforce rate limits on
              API endpoints. If you need higher limits for your application,
              please{" "}
              <a
                href="/contact"
                className="text-primary-500 hover:underline"
              >
                contact us
              </a>{" "}
              for enterprise access.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
