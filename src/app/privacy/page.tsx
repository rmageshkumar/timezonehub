import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose dark:prose-invert prose-slate">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

          <h2>1. Information We Collect</h2>
          <p>When you use ClockHive, we may collect:</p>
          <ul>
            <li><strong>Account information:</strong> Name, email address, and password when you register.</li>
            <li><strong>Usage data:</strong> Pages visited, features used, and timezone searches performed.</li>
            <li><strong>Favorites & preferences:</strong> Cities and timezones you save, theme preferences, and settings.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain the ClockHive service</li>
            <li>To personalize your timezone management experience</li>
            <li>To improve our platform based on usage patterns</li>
            <li>To communicate important updates about the service</li>
          </ul>

          <h2>3. Data Storage & Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use Turso (libSQL) for database storage. Passwords are hashed using bcrypt. We implement appropriate security measures to protect your personal information.</p>

          <h2>4. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We may also use analytics cookies to understand how our platform is used. See our <a href="/cookies">Cookie Policy</a> for details.</p>

          <h2>5. Third-Party Services</h2>
          <p>ClockHive may integrate with third-party services such as analytics providers. These services have their own privacy policies.</p>

          <h2>6. Your Rights</h2>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Export your data</li>
            <li>Close your account at any time</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:hello@clockhive.cc">hello@clockhive.cc</a>.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify registered users of significant changes via email.</p>

          <h2>8. Contact</h2>
          <p>If you have questions about this policy, reach out at <a href="mailto:hello@clockhive.cc">hello@clockhive.cc</a> or use our <a href="/contact">contact form</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
