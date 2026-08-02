import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose dark:prose-invert prose-slate">
          <h1>Cookie Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

          <h2>What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>

          <h2>Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left p-2">Cookie</th><th className="text-left p-2">Purpose</th><th className="text-left p-2">Duration</th></tr>
            </thead>
            <tbody>
              <tr><td className="p-2">next-auth.session-token</td><td className="p-2">Authentication session</td><td className="p-2">Session</td></tr>
              <tr><td className="p-2">next-auth.csrf-token</td><td className="p-2">Security (CSRF protection)</td><td className="p-2">Session</td></tr>
            </tbody>
          </table>

          <h3>Preference Cookies</h3>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left p-2">Cookie</th><th className="text-left p-2">Purpose</th><th className="text-left p-2">Duration</th></tr>
            </thead>
            <tbody>
              <tr><td className="p-2">theme</td><td className="p-2">Your dark/light mode preference</td><td className="p-2">Persistent</td></tr>
            </tbody>
          </table>

          <h2>Third-Party Cookies</h2>
          <p>We may use analytics services that set their own cookies. Currently, ClockHive does not use any third-party advertising cookies.</p>

          <h2>Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Note that disabling essential cookies may prevent you from signing in to ClockHive.</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          </ul>

          <h2>Updates</h2>
          <p>We may update this Cookie Policy from time to time. Check this page for the latest information.</p>

          <h2>Contact</h2>
          <p>Questions? <a href="mailto:hello@clockhive.cc">hello@clockhive.cc</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
