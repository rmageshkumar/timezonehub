import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { WebSiteSchema } from "@/components/StructuredData";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clockhive.cc";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ClockHive - Beautiful Timezone Management for Remote Teams",
    template: "%s | ClockHive",
  },
  description:
    "ClockHive helps remote teams, developers, travelers, and global businesses manage time zones. Compare cities, plan meetings, track world times, and schedule across timezones.",
  keywords: [
    "timezone", "world clock", "time converter", "meeting planner",
    "remote teams", "timezone management", "GMT", "UTC", "city time",
    "scrum poker", "planning poker", "ai scheduler", "clockhive",
    "time zone converter", "world time clock", "time difference calculator",
    "DST calculator", "meeting time planner", "global team scheduler",
  ],
  authors: [{ name: "ClockHive", url: BASE_URL }],
  creator: "ClockHive",
  publisher: "ClockHive",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClockHive",
    url: BASE_URL,
    title: "ClockHive - Beautiful Timezone Management",
    description: "The most beautiful timezone management platform for remote teams and global businesses. Compare times, plan meetings, and stay in sync.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ClockHive - Beautiful Timezone Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@clockhive",
    creator: "@clockhive",
    title: "ClockHive - Beautiful Timezone Management",
    description: "Compare times, plan meetings, and stay in sync with the most intuitive timezone platform.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes after setting up Search Console
    // google: "your-google-verification-code",
  },
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
        <WebSiteSchema />
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
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
