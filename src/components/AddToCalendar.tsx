"use client";

import { useState } from "react";
import { Calendar, CalendarPlus, Check, Copy } from "lucide-react";

interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
}

export function AddToCalendar({ event, className = "" }: { event: CalendarEvent; className?: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const icsUrl = `/api/calendar/ics?${new URLSearchParams({
    title: event.title,
    start: event.startDate.toISOString(),
    end: event.endDate.toISOString(),
    description: event.description || "",
    location: event.location || "",
  }).toString()}`;

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&${new URLSearchParams({
    text: event.title,
    dates: `${event.startDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${event.endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    details: event.description || "",
    location: event.location || "",
  }).toString()}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams({
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
    body: event.description || "",
    location: event.location || "",
  }).toString()}`;

  const office365Url = `https://outlook.office.com/calendar/0/deeplink/compose?${new URLSearchParams({
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
    body: event.description || "",
    location: event.location || "",
  }).toString()}`;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + icsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary flex items-center gap-2 text-sm"
      >
        <CalendarPlus className="w-4 h-4" />
        Add to Calendar
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 glass rounded-xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
            <div className="p-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1.5">
                Add to Calendar
              </div>

              <a
                href={googleUrl}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {/* Google Calendar SVG icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="3" width="22" height="20" rx="2" fill="#4285F4"/>
                  <rect x="1" y="3" width="22" height="5" rx="2" fill="#1967D2"/>
                  <rect x="5" y="1" width="2" height="5" rx="1" fill="#1967D2"/>
                  <rect x="17" y="1" width="2" height="5" rx="1" fill="#1967D2"/>
                  <rect x="6" y="10" width="4" height="3" rx="1" fill="white"/>
                  <rect x="14" y="10" width="4" height="3" rx="1" fill="white"/>
                  <rect x="10" y="14" width="4" height="3" rx="1" fill="white"/>
                </svg>
                Google Calendar
              </a>

              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {/* Outlook icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#0078D4"/>
                  <path d="M6 7h5l7 3.5v5L11 19H6V7z" fill="white" opacity="0.9"/>
                  <path d="M18 10.5v5L13 17v-5l5-1.5z" fill="white"/>
                </svg>
                Outlook (Personal)
              </a>

              <a
                href={office365Url}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {/* Microsoft 365 icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#D83B01"/>
                  <path d="M4 4h7v7H4V4z" fill="#F25022"/>
                  <path d="M13 4h7v7h-7V4z" fill="#7FBA00"/>
                  <path d="M4 13h7v7H4v-7z" fill="#00A4EF"/>
                  <path d="M13 13h7v7h-7v-7z" fill="#FFB900"/>
                </svg>
                Microsoft 365
              </a>

              <div className="border-t border-slate-200 dark:border-slate-700 my-1" />

              <a
                href={icsUrl}
                download
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {/* Apple Calendar icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="0.5"/>
                  <rect x="3" y="4" width="18" height="18" rx="2" fill="#FF3B30"/>
                  <rect x="3" y="4" width="18" height="5" rx="2" fill="#CC0000"/>
                  <line x1="7" y1="2" x2="7" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="17" y1="2" x2="17" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">17</text>
                </svg>
                Apple Calendar (.ICS)
              </a>

              <button
                onClick={copyLink}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-500" />}
                {copied ? "Link Copied!" : "Copy ICS Link"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
