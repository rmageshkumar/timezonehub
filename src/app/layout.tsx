import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ClockHive - The Most Beautiful Timezone Management Platform",
    template: "%s | ClockHive",
  },
  description:
    "Manage time zones for remote teams, developers, travelers, and global businesses. Compare cities, plan meetings, and track world time.",
  keywords: [
    "timezone", "world clock", "time converter", "meeting planner",
    "remote teams", "timezone management", "GMT", "UTC", "city time",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClockHive",
    title: "ClockHive - Beautiful Timezone Management",
    description: "The most beautiful timezone management platform for remote teams and global businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClockHive",
    description: "Beautiful timezone management for everyone.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100 !shadow-xl",
              duration: 4000,
            }}
          />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
