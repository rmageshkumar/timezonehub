// Timezone & City data access layer
import { prisma } from "@/lib/prisma";

export type CityWithCountry = Awaited<ReturnType<typeof getCities>>[0];
export type CountryWithCities = Awaited<ReturnType<typeof getCountries>>[0];

export async function getCountries(options?: {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
}) {
  const { search, limit = 50, offset = 0 } = options || {};
  return prisma.country.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { code: { contains: search.toUpperCase() } },
            ],
          }
        : {}),
    },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
        take: 10,
      },
      _count: { select: { cities: true } },
    },
    orderBy: { displayOrder: "asc" },
    take: limit,
    skip: offset,
  });
}

export async function getCountryByCode(code: string) {
  return prisma.country.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
      },
    },
  });
}

export async function getCountryById(id: string) {
  return prisma.country.findUnique({
    where: { id },
    include: {
      cities: {
        where: { isActive: true },
        orderBy: { population: "desc" },
      },
    },
  });
}

export async function getCities(options?: {
  search?: string;
  countryId?: string;
  limit?: number;
  offset?: number;
}) {
  const { search, countryId, limit = 50, offset = 0 } = options || {};
  return prisma.city.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { timezone: { contains: search } },
              { airportCode: { contains: search.toUpperCase() } },
              { aliases: { contains: search.toLowerCase() } },
              { country: { name: { contains: search } } },
              { country: { code: { contains: search.toUpperCase() } } },
            ],
          }
        : {}),
      ...(countryId ? { countryId } : {}),
    },
    include: {
      country: true,
    },
    orderBy: { population: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getCityById(id: string) {
  return prisma.city.findUnique({
    where: { id },
    include: { country: true },
  });
}

export async function searchAll(query: string) {
  if (!query || query.length < 1) return { countries: [], cities: [], timezones: [] };

  const [countries, cities, timezones] = await Promise.all([
    prisma.country.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { code: { contains: query.toUpperCase() } },
        ],
      },
      take: 5,
    }),
    prisma.city.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { timezone: { contains: query } },
          { airportCode: { contains: query.toUpperCase() } },
          { aliases: { contains: query.toLowerCase() } },
        ],
      },
      include: { country: true },
      take: 10,
    }),
    prisma.timezone.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { abbr: { contains: query.toUpperCase() } },
          { offset: { contains: query } },
        ],
      },
      take: 5,
    }),
  ]);

  return { countries, cities, timezones };
}

export async function getTimezoneInfo(timezone: string) {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      weekday: "long",
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value || "";

    return {
      date: `${get("weekday")}, ${get("month")} ${get("day")}, ${get("year")}`,
      time: `${get("hour")}:${get("minute")}:${get("second")} ${get("dayPeriod")}`,
      timezoneName: get("timeZoneName"),
      isDaytime: isDaytimeForTZ(now, timezone),
      isWeekend: isWeekendForTZ(now, timezone),
      isBusinessHours: isBusinessHoursForTZ(now, timezone),
    };
  } catch {
    return null;
  }
}

function isDaytimeForTZ(date: Date, tz: string): boolean {
  try {
    const hour = parseInt(
      date.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: tz })
    );
    return hour >= 6 && hour < 18;
  } catch {
    return true;
  }
}

function isWeekendForTZ(date: Date, tz: string): boolean {
  try {
    const day = date.toLocaleString("en-US", { weekday: "short", timeZone: tz });
    return day === "Sat" || day === "Sun";
  } catch {
    return false;
  }
}

function isBusinessHoursForTZ(date: Date, tz: string): boolean {
  try {
    const hour = parseInt(
      date.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: tz })
    );
    return hour >= 9 && hour < 17;
  } catch {
    return false;
  }
}

export async function getActiveAds(placement: string, country?: string) {
  const now = new Date();
  return prisma.advertisement.findMany({
    where: {
      placement,
      status: "active",
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
      ],
    },
    orderBy: [{ priority: "desc" }, { weight: "desc" }],
  });
}

export async function recordAnalyticsEvent(data: {
  type: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  ip?: string;
  country?: string;
  device?: string;
  browser?: string;
  referrer?: string;
}) {
  try {
    await prisma.analyticsEvent.create({ data });
  } catch {
    // silently fail for analytics
  }
}
