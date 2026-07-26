"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Clock, Menu, Search, Sun, Moon, X, Globe, BarChart3, Settings, ArrowLeftRight, Sparkles, User, LogOut, Heart, LayoutDashboard, Calendar, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: "Home", icon: Clock },
    { href: "/countries", label: "Countries", icon: Globe },
    { href: "/converter", label: "Converter", icon: ArrowLeftRight },
    { href: "/compare", label: "Compare", icon: BarChart3 },
    { href: "/ai-scheduler", label: "AI Scheduler", icon: Sparkles },
    { href: "/meeting-planner", label: "Meeting Planner", icon: Clock },
    { href: "/blog", label: "Blog", icon: Globe },
    { href: "/scrum-poker", label: "Scrum Poker", icon: Play },
  ];

  const isAdmin = (session?.user as any)?.role && ["super_admin", "admin", "editor", "moderator"].includes((session?.user as any).role);

  return (
    <nav className="glass sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">TimezoneHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 hidden dark:block text-slate-300" />
              <Moon className="w-4 h-4 dark:hidden text-slate-600" />
            </button>

            <Link href="/search" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Link>

            {isAdmin && (
              <Link href="/admin" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </Link>
            )}

            {/* User Menu */}
            {status === "authenticated" ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                    {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:inline">
                    {session.user?.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl shadow-xl z-40 overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-slate-500 truncate">{session.user?.email}</div>
                        <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/dashboard?tab=favorites" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Heart className="w-4 h-4" /> My Favorites
                        </Link>
                        <Link href="/schedule" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Calendar className="w-4 h-4" /> My Schedule
                        </Link>
                        <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                        <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 w-full text-left">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/auth/login" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm px-4 py-1.5">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-700 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 dark:bg-primary-950 text-primary-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
