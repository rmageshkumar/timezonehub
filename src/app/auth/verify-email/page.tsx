"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(`Email ${data.email} verified successfully!`);
          setTimeout(() => router.push("/auth/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token, router]);

  return (
    <div className="glass rounded-2xl p-8">
      {status === "loading" && (
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 mx-auto text-primary-500 animate-spin" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Verifying your email...</h2>
          <p className="text-sm text-slate-500">Please wait while we confirm your email address.</p>
        </div>
      )}
      {status === "success" && (
        <div className="space-y-4">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Email Verified!</h2>
          <p className="text-sm text-slate-500">{message}</p>
          <p className="text-xs text-slate-400">Redirecting to login...</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2 mt-2">
            Sign In Now
          </Link>
        </div>
      )}
      {status === "error" && (
        <div className="space-y-4">
          <XCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Verification Failed</h2>
          <p className="text-sm text-slate-500">{message}</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2 mt-2">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ClockHive</span>
        </Link>
        <Suspense fallback={
          <div className="glass rounded-2xl p-8">
            <Loader2 className="w-12 h-12 mx-auto text-primary-500 animate-spin" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4">Loading...</h2>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
