import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose dark:prose-invert prose-slate">
          <h1>Terms of Service</h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By using ClockHive (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>

          <h2>2. Description of Service</h2>
          <p>ClockHive is a timezone management platform that provides tools for comparing timezones, scheduling meetings, converting times, and related features. The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.</p>

          <h2>3. User Accounts</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must provide accurate and complete registration information.</li>
            <li>You must be at least 13 years old to use the Service.</li>
            <li>You may not share your account or use another user&apos;s account.</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Send spam or unsolicited messages through the Service</li>
            <li>Scrape, data mine, or use automated tools to extract data</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>ClockHive, its logo, design, and code are the intellectual property of ClockHive. You may not copy, modify, or distribute any part of the Service without permission.</p>

          <h2>6. Limitation of Liability</h2>
          <p>ClockHive is provided for informational and productivity purposes. We are not liable for any damages resulting from the use or inability to use the Service, including but not limited to scheduling errors, missed meetings, or data loss.</p>

          <h2>7. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms. You may close your account at any time by contacting us.</p>

          <h2>8. Changes to Terms</h2>
          <p>We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>

          <h2>9. Contact</h2>
          <p>For questions about these terms, contact <a href="mailto:hello@clockhive.cc">hello@clockhive.cc</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
