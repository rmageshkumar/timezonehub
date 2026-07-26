"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, MapPin, Trash2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface SavedMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  cities: string;
  notes: string;
}

export default function SchedulePage() {
  const { data: session } = useSession();
  const [meetings, setMeetings] = useState<SavedMeeting[]>([]);

  useEffect(() => {
    // Load saved meetings from localStorage
    try {
      const saved = localStorage.getItem("tz_saved_meetings");
      if (saved) setMeetings(JSON.parse(saved));
    } catch {}
  }, []);

  const removeMeeting = (id: string) => {
    const updated = meetings.filter((m) => m.id !== id);
    setMeetings(updated);
    localStorage.setItem("tz_saved_meetings", JSON.stringify(updated));
    toast.success("Meeting removed");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                <Calendar className="w-7 h-7 inline mr-2 text-primary-500" />
                My Schedule
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Your saved meetings and scheduled calls
              </p>
            </div>
            <Link href="/ai-scheduler" className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Schedule New Meeting
            </Link>
          </div>

          {meetings.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-500 dark:text-slate-400 mb-2">No saved meetings yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Use the AI Scheduler to find the best meeting times, then save them here with your calendar.
              </p>
              <Link href="/ai-scheduler" className="btn-primary inline-flex items-center gap-2">
                Go to AI Scheduler <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="glass rounded-2xl p-5 card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                        {meeting.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" /> {meeting.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> {meeting.time}
                        </span>
                        {meeting.cities && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" /> {meeting.cities}
                          </span>
                        )}
                      </div>
                      {meeting.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          {meeting.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeMeeting(meeting.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
