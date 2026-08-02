import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Find answers to common questions about ClockHive's timezone management tools, meeting planner, and more.",
};

const faqs = [
  {
    q: "What is ClockHive?",
    a: "ClockHive is a beautiful, all-in-one timezone management platform. It helps you compare world times, schedule meetings across time zones, convert times, and plan your global work — all in one place.",
  },
  {
    q: "Is ClockHive free?",
    a: "Yes! ClockHive is completely free to use. We believe timezone management should be accessible to everyone, whether you're a remote worker, freelancer, or part of a large distributed team.",
  },
  {
    q: "How does the meeting planner work?",
    a: "Our meeting planner lets you add multiple cities and see their overlapping working hours at a glance. Adjust the date and time with an interactive slider to find the perfect slot that works for everyone.",
  },
  {
    q: "How does the AI scheduler work?",
    a: "The AI scheduler scans 336 half-hour slots across 7 days and scores each based on business hours, holidays, DST transitions, and more. It ranks the best times and explains why each slot is recommended.",
  },
  {
    q: "Does ClockHive handle Daylight Saving Time (DST)?",
    a: "Absolutely. ClockHive automatically detects DST status for every timezone, shows current offset, and alerts you when DST transitions are imminent so you never miss a schedule change.",
  },
  {
    q: "What is Scrum Poker?",
    a: "Scrum Poker (aka Planning Poker) is an agile estimation tool. Create a room, invite your team with a code, and everyone votes on story points using Fibonacci cards. Results are revealed when the admin chooses.",
  },
  {
    q: "How many countries and cities are supported?",
    a: "ClockHive supports 126+ countries and 150+ cities with accurate timezone and DST data. We regularly update our database to keep information current.",
  },
  {
    q: "Can I save my favorite cities?",
    a: "Yes! After creating a free account, you can save your favorite cities and timezones for quick access from your dashboard.",
  },
  {
    q: "Do you have an API?",
    a: "We're working on a public API for developers. Stay tuned or contact us if you have specific needs.",
  },
  {
    q: "How do I report a bug or suggest a feature?",
    a: "We'd love to hear from you! Use our contact form or email us at hello@clockhive.cc. Your feedback helps us improve.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Everything you need to know about ClockHive
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="glass rounded-xl p-6 group cursor-pointer">
                <summary className="font-semibold text-slate-900 dark:text-slate-100 list-none flex items-center justify-between">
                  {faq.q}
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            Still have questions? <Link href="/contact" className="text-primary-500 hover:underline">Contact us</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
