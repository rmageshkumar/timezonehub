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
              <a href="https://www.linkedin.com/company/clockhive-cc" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.facebook.com/clockhive.cc" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="mailto:hello@clockhive.cc" className="text-slate-400 hover:text-primary-500 transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-slate-900 dark:text-slate-100">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/countries" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Countries</Link></li>
              <li><Link href="/business-time" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Compare</Link></li>
              <li><Link href="/meeting-planner" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Meeting Planner</Link></li>
              <li><Link href="/search" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Search</Link></li>
              <li><Link href="/games/reaction" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Games</Link></li>
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
