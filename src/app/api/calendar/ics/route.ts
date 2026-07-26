import { NextRequest, NextResponse } from "next/server";

/**
 * Generate an ICS (iCalendar) file for adding events to Google Calendar, Outlook, etc.
 * GET /api/calendar/ics?title=...&start=...&end=...&description=...&location=...&timezone=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Meeting";
  const startStr = searchParams.get("start"); // ISO 8601 string
  const endStr = searchParams.get("end");
  const description = searchParams.get("description") || "";
  const location = searchParams.get("location") || "";
  const timezone = searchParams.get("timezone") || "UTC";

  if (!startStr || !endStr) {
    return NextResponse.json({ error: "start and end are required" }, { status: 400 });
  }

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Invalid date format. Use ISO 8601." }, { status: 400 });
  }

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const now = formatICSDate(new Date());
  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}@timezonehub.com`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TimezoneHub//Timezone Management Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `DTSTAMP:${now}`,
    `UID:${uid}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    location ? `LOCATION:${escapeICS(location)}` : "",
    `URL:https://timezonehub.com`,
    `ORGANIZER;CN=TimezoneHub:mailto:hello@timezonehub.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((line) => line !== "")
    .join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${sanitizeFilename(title)}.ics"`,
    },
  });
}

function escapeICS(text: string): string {
  return text.replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n");
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_").slice(0, 50);
}
