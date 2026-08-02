"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lightbulb, Bug, Sparkles, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function FeedbackPage() {
  const [form, setForm] = useState({ type: "suggestion", title: "", content: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Feedback submitted!");
      } else {
        toast.error("Failed to submit");
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  const types = [
    { value: "suggestion", label: "Suggestion", icon: <Lightbulb className="w-4 h-4" /> },
    { value: "bug_report", label: "Bug Report", icon: <Bug className="w-4 h-4" /> },
    { value: "feature_request", label: "Feature Request", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Feedback</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Help us improve ClockHive</p>
          </div>

          {submitted ? (
            <div className="glass rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Thank You!</h2>
              <p className="text-slate-500">Your feedback helps us build a better product.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {types.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex items-center gap-1.5 justify-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        form.type === t.value
                          ? "bg-primary-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Brief summary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Details</label>
                <textarea rows={5} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field" placeholder="Describe your suggestion or issue..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
