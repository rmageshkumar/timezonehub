import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ClockHive - Beautiful Timezone Management for Remote Teams",
    template: "%s | ClockHive",
  },
  description:
    "Manage time zones for remote teams, developers, travelers, and global businesses. Compare cities, plan meetings, track world times, and schedule across timezones.",
  keywords: [
    "timezone", "world clock", "time converter", "meeting planner",
    "remote teams", "timezone management", "GMT", "UTC", "city time",
    "scrum poker", "planning poker", "ai scheduler", "clockhive",
  ],
  authors: [{ name: "ClockHive" }],
  creator: "ClockHive",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClockHive",
    title: "ClockHive - Beautiful Timezone Management",
    description: "The most beautiful timezone management platform for remote teams and global businesses. Compare times, plan meetings, and stay in sync.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClockHive - Beautiful Timezone Management",
    description: "Compare times, plan meetings, and stay in sync with the most intuitive timezone platform.",
    creator: "@clockhive",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
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
