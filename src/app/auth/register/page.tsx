"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Shield, RefreshCw, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const router = useRouter();

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch("/api/auth/captcha");
      const data = await res.json();
      setCaptchaQuestion(data.question);
      setCaptchaToken(data.token);
      setCaptchaAnswer("");
    } catch {
      // fallback captcha
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setCaptchaQuestion(`What is ${a} + ${b}?`);
      setCaptchaToken(btoa(`${a + b}`));
      setCaptchaAnswer("");
    }
    setCaptchaLoading(false);
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaAnswer.trim()) {
      setError("Please answer the captcha");
      setLoading(false);
      return;
    }

    try {
      // Register
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, captchaToken, captchaAnswer }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        toast.error(data.error || "Registration failed");
        fetchCaptcha(); // refresh captcha on failure
        setLoading(false);
        return;
      }

      // Show verification notice (email sending is logged on server)
      if (data.verificationUrl) {
        setVerificationUrl(data.verificationUrl);
        toast.success("Account created! Please check your email to verify.");
      } else {
        toast.success("Welcome to ClockHive!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ClockHive</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create your account</h2>
          <p className="text-sm text-slate-500 mb-6">Start managing timezones like a pro</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {verificationUrl ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Account created! A verification link has been generated.</span>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">📧 Verification Link (dev mode):</p>
                <a href={verificationUrl} className="text-blue-600 dark:text-blue-400 break-all hover:underline text-xs">{verificationUrl}</a>
              </div>
              <p className="text-xs text-slate-500">In production, this link would be sent via email.</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Security Check
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="input-field pl-10"
                    placeholder={captchaLoading ? "Loading..." : captchaQuestion}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={captchaLoading}
                  className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                  title="Refresh captcha"
                >
                  <RefreshCw className={`w-4 h-4 ${captchaLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          )}

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1">
              Sign in <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
