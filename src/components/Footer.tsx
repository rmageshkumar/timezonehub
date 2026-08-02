import Link from "next/link";
import { Clock, Mail, Github, Twitter, Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">ClockHive</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              The most beautiful timezone management platform for remote teams, developers, and global businesses.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Mail className="w-4 h-4" /></a>
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
