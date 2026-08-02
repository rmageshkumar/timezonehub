"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const CONSENT_COOKIE = "clockhive_consent";
const COOKIE_EXPIRY_DAYS = 365;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax;Secure`;
}

function updateGtagConsent(consent: "granted" | "denied") {
  if (window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: consent,
      ad_user_data: consent,
      ad_personalization: consent,
      analytics_storage: consent,
    });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if consent already given
    if (getCookie(CONSENT_COOKIE)) return;

    // Set default consent (denied until user accepts)
    if (window.gtag) {
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }

    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    updateGtagConsent("granted");
    setCookie(CONSENT_COOKIE, "all", COOKIE_EXPIRY_DAYS);
    setVisible(false);
  };

  const acceptEssential = () => {
    // Analytics only, no ads
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
      });
    }
    setCookie(CONSENT_COOKIE, "essential", COOKIE_EXPIRY_DAYS);
    setVisible(false);
  };

  const rejectAll = () => {
    // Keep all denied but record the choice
    setCookie(CONSENT_COOKIE, "rejected", COOKIE_EXPIRY_DAYS);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom">
      <div className="max-w-4xl mx-auto glass rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Cookie Preferences</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              We use cookies to enhance your experience, analyze site traffic, and support our free tools. 
              By clicking &quot;Accept All&quot;, you consent to our use of cookies. 
              See our <a href="/cookies" className="text-primary-500 hover:underline">Cookie Policy</a> and{" "}
              <a href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</a> for details.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={acceptAll} className="px-5 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                Accept All
              </button>
              <button onClick={acceptEssential} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Essential Only
              </button>
              <button onClick={rejectAll} className="px-5 py-2 text-slate-500 dark:text-slate-400 rounded-lg text-sm hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Reject All
              </button>
            </div>
          </div>
          <button onClick={rejectAll} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
