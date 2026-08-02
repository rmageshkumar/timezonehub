import Link from "next/link";
import { ClockHiveLogo } from "@/components/ClockHiveLogo";
import { Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ClockHiveLogo className="w-8 h-8" />
              <span className="font-bold text-lg gradient-text">ClockHive</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              The most beautiful timezone management platform for remote teams, developers, and global businesses.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="mailto:hello@clockhive.cc" className="text-slate-400 hover:text-primary-500 transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-slate-900 dark:text-slate-100">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/countries" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Countries</Link></li>
              <li><Link href="/compare" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Time Comparison</Link></li>
              <li><Link href="/meeting-planner" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Meeting Planner</Link></li>
              <li><Link href="/search" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-slate-900 dark:text-slate-100">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Blog</Link></li>
              <li><Link href="/api-docs" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">API Docs</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Contact</Link></li>
              <li><Link href="/feedback" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Feedback</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-slate-900 dark:text-slate-100">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/sitemap.xml" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ClockHive. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> for global teams
          </p>
        </div>
      </div>
    </footer>
  );
}
