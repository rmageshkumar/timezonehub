import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (tursoUrl) {
    const libsql = createClient({ url: tursoUrl, authToken: tursoToken || undefined });
    return new PrismaClient({ adapter: new PrismaLibSQL(libsql) });
  }
  return new PrismaClient();
}

const prisma = createPrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==================== ADMIN USER ====================
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@clockhive.cc" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@clockhive.cc",
      password: adminPassword,
      role: "super_admin",
      status: "active",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ==================== DEMO USER ====================
  const userPassword = await bcrypt.hash("demo123", 12);
  await prisma.user.upsert({
    where: { email: "demo@clockhive.cc" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@clockhive.cc",
      password: userPassword,
      role: "user",
      status: "active",
    },
  });

  // ==================== COUNTRIES & CITIES ====================
  const countriesData = [
    {
      name: "United States",
      code: "US",
      flag: "🇺🇸",
      capital: "Washington, D.C.",
      continent: "North America",
      population: 331900000,
      timezoneCount: 9,
      displayOrder: 1,
      cities: [
        { name: "New York", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "JFK", latitude: 40.7128, longitude: -74.006, population: 8804190 },
        { name: "Los Angeles", timezone: "America/Los_Angeles", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "LAX", latitude: 34.0522, longitude: -118.2437, population: 3898747 },
        { name: "Chicago", timezone: "America/Chicago", gmtOffset: "-06:00", dstOffset: "-05:00", airportCode: "ORD", latitude: 41.8781, longitude: -87.6298, population: 2746388 },
        { name: "Denver", timezone: "America/Denver", gmtOffset: "-07:00", dstOffset: "-06:00", airportCode: "DEN", latitude: 39.7392, longitude: -104.9903, population: 715522 },
        { name: "Anchorage", timezone: "America/Anchorage", gmtOffset: "-09:00", dstOffset: "-08:00", airportCode: "ANC", latitude: 61.2181, longitude: -149.9003, population: 291247 },
        { name: "Honolulu", timezone: "Pacific/Honolulu", gmtOffset: "-10:00", dstOffset: null, airportCode: "HNL", latitude: 21.3069, longitude: -157.8583, population: 345064 },
      ],
    },
    {
      name: "United Kingdom",
      code: "GB",
      flag: "🇬🇧",
      capital: "London",
      continent: "Europe",
      population: 67330000,
      timezoneCount: 1,
      displayOrder: 2,
      cities: [
        { name: "London", timezone: "Europe/London", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "LHR", latitude: 51.5074, longitude: -0.1278, population: 8982000 },
        { name: "Manchester", timezone: "Europe/London", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "MAN", latitude: 53.4808, longitude: -2.2426, population: 553230 },
        { name: "Edinburgh", timezone: "Europe/London", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "EDI", latitude: 55.9533, longitude: -3.1883, population: 524930 },
      ],
    },
    {
      name: "India",
      code: "IN",
      flag: "🇮🇳",
      capital: "New Delhi",
      continent: "Asia",
      population: 1408000000,
      timezoneCount: 1,
      displayOrder: 3,
      cities: [
        { name: "Mumbai", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "BOM", latitude: 19.076, longitude: 72.8777, population: 20668000 },
        { name: "New Delhi", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "DEL", latitude: 28.6139, longitude: 77.209, population: 32941000 },
        { name: "Bengaluru", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "BLR", latitude: 12.9716, longitude: 77.5946, population: 13608000 },
        { name: "Chennai", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "MAA", latitude: 13.0827, longitude: 80.2707, population: 11503000 },
        { name: "Kolkata", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "CCU", latitude: 22.5726, longitude: 88.3639, population: 15134000 },
      ],
    },
    {
      name: "Australia",
      code: "AU",
      flag: "🇦🇺",
      capital: "Canberra",
      continent: "Oceania",
      population: 25690000,
      timezoneCount: 5,
      displayOrder: 4,
      cities: [
        { name: "Sydney", timezone: "Australia/Sydney", gmtOffset: "+10:00", dstOffset: "+11:00", airportCode: "SYD", latitude: -33.8688, longitude: 151.2093, population: 5312000 },
        { name: "Melbourne", timezone: "Australia/Melbourne", gmtOffset: "+10:00", dstOffset: "+11:00", airportCode: "MEL", latitude: -37.8136, longitude: 144.9631, population: 5078000 },
        { name: "Brisbane", timezone: "Australia/Brisbane", gmtOffset: "+10:00", dstOffset: null, airportCode: "BNE", latitude: -27.4698, longitude: 153.0251, population: 2568000 },
        { name: "Perth", timezone: "Australia/Perth", gmtOffset: "+08:00", dstOffset: null, airportCode: "PER", latitude: -31.9505, longitude: 115.8605, population: 2093000 },
        { name: "Adelaide", timezone: "Australia/Adelaide", gmtOffset: "+09:30", dstOffset: "+10:30", airportCode: "ADL", latitude: -34.9285, longitude: 138.6007, population: 1376000 },
      ],
    },
    {
      name: "Japan",
      code: "JP",
      flag: "🇯🇵",
      capital: "Tokyo",
      continent: "Asia",
      population: 125700000,
      timezoneCount: 1,
      displayOrder: 5,
      cities: [
        { name: "Tokyo", timezone: "Asia/Tokyo", gmtOffset: "+09:00", dstOffset: null, airportCode: "NRT", latitude: 35.6762, longitude: 139.6503, population: 37400000 },
        { name: "Osaka", timezone: "Asia/Tokyo", gmtOffset: "+09:00", dstOffset: null, airportCode: "KIX", latitude: 34.6937, longitude: 135.5023, population: 19110000 },
      ],
    },
    {
      name: "Germany",
      code: "DE",
      flag: "🇩🇪",
      capital: "Berlin",
      continent: "Europe",
      population: 83200000,
      timezoneCount: 1,
      displayOrder: 6,
      cities: [
        { name: "Berlin", timezone: "Europe/Berlin", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BER", latitude: 52.52, longitude: 13.405, population: 3645000 },
        { name: "Munich", timezone: "Europe/Berlin", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "MUC", latitude: 48.1351, longitude: 11.582, population: 1472000 },
      ],
    },
    {
      name: "France",
      code: "FR",
      flag: "🇫🇷",
      capital: "Paris",
      continent: "Europe",
      population: 67750000,
      timezoneCount: 1,
      displayOrder: 7,
      cities: [
        { name: "Paris", timezone: "Europe/Paris", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "CDG", latitude: 48.8566, longitude: 2.3522, population: 11027000 },
      ],
    },
    {
      name: "Canada",
      code: "CA",
      flag: "🇨🇦",
      capital: "Ottawa",
      continent: "North America",
      population: 38250000,
      timezoneCount: 6,
      displayOrder: 8,
      cities: [
        { name: "Toronto", timezone: "America/Toronto", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "YYZ", latitude: 43.6532, longitude: -79.3832, population: 6202000 },
        { name: "Vancouver", timezone: "America/Vancouver", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "YVR", latitude: 49.2827, longitude: -123.1207, population: 2606000 },
      ],
    },
    {
      name: "China",
      code: "CN",
      flag: "🇨🇳",
      capital: "Beijing",
      continent: "Asia",
      population: 1412000000,
      timezoneCount: 1,
      displayOrder: 9,
      cities: [
        { name: "Beijing", timezone: "Asia/Shanghai", gmtOffset: "+08:00", dstOffset: null, airportCode: "PEK", latitude: 39.9042, longitude: 116.4074, population: 21540000 },
        { name: "Shanghai", timezone: "Asia/Shanghai", gmtOffset: "+08:00", dstOffset: null, airportCode: "PVG", latitude: 31.2304, longitude: 121.4737, population: 27058000 },
      ],
    },
    {
      name: "Brazil",
      code: "BR",
      flag: "🇧🇷",
      capital: "Brasília",
      continent: "South America",
      population: 214300000,
      timezoneCount: 4,
      displayOrder: 10,
      cities: [
        { name: "São Paulo", timezone: "America/Sao_Paulo", gmtOffset: "-03:00", dstOffset: null, airportCode: "GRU", latitude: -23.5505, longitude: -46.6333, population: 22430000 },
        { name: "Rio de Janeiro", timezone: "America/Sao_Paulo", gmtOffset: "-03:00", dstOffset: null, airportCode: "GIG", latitude: -22.9068, longitude: -43.1729, population: 13630000 },
      ],
    },
    {
      name: "Singapore",
      code: "SG",
      flag: "🇸🇬",
      capital: "Singapore",
      continent: "Asia",
      population: 5454000,
      timezoneCount: 1,
      displayOrder: 11,
      cities: [
        { name: "Singapore", timezone: "Asia/Singapore", gmtOffset: "+08:00", dstOffset: null, airportCode: "SIN", latitude: 1.3521, longitude: 103.8198, population: 5454000 },
      ],
    },
    {
      name: "United Arab Emirates",
      code: "AE",
      flag: "🇦🇪",
      capital: "Abu Dhabi",
      continent: "Asia",
      population: 9890000,
      timezoneCount: 1,
      displayOrder: 12,
      cities: [
        { name: "Dubai", timezone: "Asia/Dubai", gmtOffset: "+04:00", dstOffset: null, airportCode: "DXB", latitude: 25.2048, longitude: 55.2708, population: 3331000 },
      ],
    },
    {
      name: "Russia",
      code: "RU",
      flag: "🇷🇺",
      capital: "Moscow",
      continent: "Europe/Asia",
      population: 144100000,
      timezoneCount: 11,
      displayOrder: 13,
      cities: [
        { name: "Moscow", timezone: "Europe/Moscow", gmtOffset: "+03:00", dstOffset: null, airportCode: "SVO", latitude: 55.7558, longitude: 37.6173, population: 12506000 },
      ],
    },
    {
      name: "South Korea",
      code: "KR",
      flag: "🇰🇷",
      capital: "Seoul",
      continent: "Asia",
      population: 51780000,
      timezoneCount: 1,
      displayOrder: 14,
      cities: [
        { name: "Seoul", timezone: "Asia/Seoul", gmtOffset: "+09:00", dstOffset: null, airportCode: "ICN", latitude: 37.5665, longitude: 126.978, population: 25620000 },
      ],
    },
    {
      name: "Mexico",
      code: "MX",
      flag: "🇲🇽",
      capital: "Mexico City",
      continent: "North America",
      population: 128900000,
      timezoneCount: 4,
      displayOrder: 15,
      cities: [
        { name: "Mexico City", timezone: "America/Mexico_City", gmtOffset: "-06:00", dstOffset: null, airportCode: "MEX", latitude: 19.4326, longitude: -99.1332, population: 22085000 },
      ],
    },
    {
      name: "Italy",
      code: "IT",
      flag: "🇮🇹",
      capital: "Rome",
      continent: "Europe",
      population: 58940000,
      timezoneCount: 1,
      displayOrder: 16,
      cities: [
        { name: "Rome", timezone: "Europe/Rome", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "FCO", latitude: 41.9028, longitude: 12.4964, population: 2873000 },
        { name: "Milan", timezone: "Europe/Rome", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "MXP", latitude: 45.4642, longitude: 9.19, population: 1371000 },
      ],
    },
    {
      name: "Spain",
      code: "ES",
      flag: "🇪🇸",
      capital: "Madrid",
      continent: "Europe",
      population: 47420000,
      timezoneCount: 1,
      displayOrder: 17,
      cities: [
        { name: "Madrid", timezone: "Europe/Madrid", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "MAD", latitude: 40.4168, longitude: -3.7038, population: 3305000 },
        { name: "Barcelona", timezone: "Europe/Madrid", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BCN", latitude: 41.3874, longitude: 2.1686, population: 1620000 },
      ],
    },
    {
      name: "Netherlands",
      code: "NL",
      flag: "🇳🇱",
      capital: "Amsterdam",
      continent: "Europe",
      population: 17530000,
      timezoneCount: 1,
      displayOrder: 18,
      cities: [
        { name: "Amsterdam", timezone: "Europe/Amsterdam", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "AMS", latitude: 52.3676, longitude: 4.9041, population: 872000 },
      ],
    },
    {
      name: "Switzerland",
      code: "CH",
      flag: "🇨🇭",
      capital: "Bern",
      continent: "Europe",
      population: 8703000,
      timezoneCount: 1,
      displayOrder: 19,
      cities: [
        { name: "Zurich", timezone: "Europe/Zurich", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "ZRH", latitude: 47.3769, longitude: 8.5417, population: 415000 },
        { name: "Geneva", timezone: "Europe/Zurich", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "GVA", latitude: 46.2044, longitude: 6.1432, population: 203000 },
      ],
    },
    {
      name: "Sweden",
      code: "SE",
      flag: "🇸🇪",
      capital: "Stockholm",
      continent: "Europe",
      population: 10420000,
      timezoneCount: 1,
      displayOrder: 20,
      cities: [
        { name: "Stockholm", timezone: "Europe/Stockholm", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "ARN", latitude: 59.3293, longitude: 18.0686, population: 975000 },
      ],
    },
    {
      name: "New Zealand",
      code: "NZ",
      flag: "🇳🇿",
      capital: "Wellington",
      continent: "Oceania",
      population: 5124000,
      timezoneCount: 1,
      displayOrder: 21,
      cities: [
        { name: "Auckland", timezone: "Pacific/Auckland", gmtOffset: "+12:00", dstOffset: "+13:00", airportCode: "AKL", latitude: -36.8509, longitude: 174.7645, population: 1657000 },
        { name: "Wellington", timezone: "Pacific/Auckland", gmtOffset: "+12:00", dstOffset: "+13:00", airportCode: "WLG", latitude: -41.2865, longitude: 174.7762, population: 212000 },
      ],
    },
    {
      name: "Ireland",
      code: "IE",
      flag: "🇮🇪",
      capital: "Dublin",
      continent: "Europe",
      population: 5011000,
      timezoneCount: 1,
      displayOrder: 22,
      cities: [
        { name: "Dublin", timezone: "Europe/Dublin", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "DUB", latitude: 53.3498, longitude: -6.2603, population: 1228000 },
      ],
    },
    {
      name: "South Africa",
      code: "ZA",
      flag: "🇿🇦",
      capital: "Pretoria",
      continent: "Africa",
      population: 59390000,
      timezoneCount: 1,
      displayOrder: 23,
      cities: [
        { name: "Johannesburg", timezone: "Africa/Johannesburg", gmtOffset: "+02:00", dstOffset: null, airportCode: "JNB", latitude: -26.2041, longitude: 28.0473, population: 5635000 },
        { name: "Cape Town", timezone: "Africa/Johannesburg", gmtOffset: "+02:00", dstOffset: null, airportCode: "CPT", latitude: -33.9249, longitude: 18.4241, population: 4618000 },
      ],
    },
    {
      name: "Turkey",
      code: "TR",
      flag: "🇹🇷",
      capital: "Ankara",
      continent: "Asia/Europe",
      population: 84780000,
      timezoneCount: 1,
      displayOrder: 24,
      cities: [
        { name: "Istanbul", timezone: "Europe/Istanbul", gmtOffset: "+03:00", dstOffset: null, airportCode: "IST", latitude: 41.0082, longitude: 28.9784, population: 15460000 },
      ],
    },
    {
      name: "Thailand",
      code: "TH",
      flag: "🇹🇭",
      capital: "Bangkok",
      continent: "Asia",
      population: 71600000,
      timezoneCount: 1,
      displayOrder: 25,
      cities: [
        { name: "Bangkok", timezone: "Asia/Bangkok", gmtOffset: "+07:00", dstOffset: null, airportCode: "BKK", latitude: 13.7563, longitude: 100.5018, population: 10539000 },
      ],
    },
    {
      name: "Egypt",
      code: "EG",
      flag: "🇪🇬",
      capital: "Cairo",
      continent: "Africa",
      population: 104300000,
      timezoneCount: 1,
      displayOrder: 26,
      cities: [
        { name: "Cairo", timezone: "Africa/Cairo", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "CAI", latitude: 30.0444, longitude: 31.2357, population: 21200000 },
      ],
    },
    {
      name: "Argentina",
      code: "AR",
      flag: "🇦🇷",
      capital: "Buenos Aires",
      continent: "South America",
      population: 45810000,
      timezoneCount: 1,
      displayOrder: 27,
      cities: [
        { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", gmtOffset: "-03:00", dstOffset: null, airportCode: "EZE", latitude: -34.6037, longitude: -58.3816, population: 15200000 },
      ],
    },
    {
      name: "Portugal", code: "PT", flag: "🇵🇹", capital: "Lisbon", continent: "Europe",
      population: 10330000, timezoneCount: 1, displayOrder: 28,
      cities: [
        { name: "Lisbon", timezone: "Europe/Lisbon", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "LIS", latitude: 38.7223, longitude: -9.1393, population: 504000 },
      ],
    },
    {
      name: "Poland", code: "PL", flag: "🇵🇱", capital: "Warsaw", continent: "Europe",
      population: 37750000, timezoneCount: 1, displayOrder: 29,
      cities: [
        { name: "Warsaw", timezone: "Europe/Warsaw", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "WAW", latitude: 52.2297, longitude: 21.0122, population: 1793000 },
      ],
    },
    {
      name: "Belgium", code: "BE", flag: "🇧🇪", capital: "Brussels", continent: "Europe",
      population: 11590000, timezoneCount: 1, displayOrder: 30,
      cities: [
        { name: "Brussels", timezone: "Europe/Brussels", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BRU", latitude: 50.8503, longitude: 4.3517, population: 1208000 },
      ],
    },
    {
      name: "Austria", code: "AT", flag: "🇦🇹", capital: "Vienna", continent: "Europe",
      population: 8956000, timezoneCount: 1, displayOrder: 31,
      cities: [
        { name: "Vienna", timezone: "Europe/Vienna", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "VIE", latitude: 48.2082, longitude: 16.3738, population: 1912000 },
      ],
    },
    {
      name: "Denmark", code: "DK", flag: "🇩🇰", capital: "Copenhagen", continent: "Europe",
      population: 5857000, timezoneCount: 1, displayOrder: 32,
      cities: [
        { name: "Copenhagen", timezone: "Europe/Copenhagen", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "CPH", latitude: 55.6761, longitude: 12.5683, population: 1345000 },
      ],
    },
    {
      name: "Finland", code: "FI", flag: "🇫🇮", capital: "Helsinki", continent: "Europe",
      population: 5541000, timezoneCount: 1, displayOrder: 33,
      cities: [
        { name: "Helsinki", timezone: "Europe/Helsinki", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "HEL", latitude: 60.1699, longitude: 24.9384, population: 1305000 },
      ],
    },
    {
      name: "Norway", code: "NO", flag: "🇳🇴", capital: "Oslo", continent: "Europe",
      population: 5421000, timezoneCount: 1, displayOrder: 34,
      cities: [
        { name: "Oslo", timezone: "Europe/Oslo", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "OSL", latitude: 59.9139, longitude: 10.7522, population: 1043000 },
      ],
    },
    {
      name: "Greece", code: "GR", flag: "🇬🇷", capital: "Athens", continent: "Europe",
      population: 10640000, timezoneCount: 1, displayOrder: 35,
      cities: [
        { name: "Athens", timezone: "Europe/Athens", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "ATH", latitude: 37.9838, longitude: 23.7275, population: 3154000 },
      ],
    },
    {
      name: "Czech Republic", code: "CZ", flag: "🇨🇿", capital: "Prague", continent: "Europe",
      population: 10700000, timezoneCount: 1, displayOrder: 36,
      cities: [
        { name: "Prague", timezone: "Europe/Prague", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "PRG", latitude: 50.0755, longitude: 14.4378, population: 1309000 },
      ],
    },
    {
      name: "Hungary", code: "HU", flag: "🇭🇺", capital: "Budapest", continent: "Europe",
      population: 9749000, timezoneCount: 1, displayOrder: 37,
      cities: [
        { name: "Budapest", timezone: "Europe/Budapest", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BUD", latitude: 47.4979, longitude: 19.0402, population: 1752000 },
      ],
    },
    {
      name: "Romania", code: "RO", flag: "🇷🇴", capital: "Bucharest", continent: "Europe",
      population: 19120000, timezoneCount: 1, displayOrder: 38,
      cities: [
        { name: "Bucharest", timezone: "Europe/Bucharest", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "OTP", latitude: 44.4268, longitude: 26.1025, population: 1835000 },
      ],
    },
    {
      name: "Ukraine", code: "UA", flag: "🇺🇦", capital: "Kyiv", continent: "Europe",
      population: 43790000, timezoneCount: 1, displayOrder: 39,
      cities: [
        { name: "Kyiv", timezone: "Europe/Kyiv", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "KBP", latitude: 50.4501, longitude: 30.5234, population: 2962000 },
      ],
    },
    {
      name: "Israel", code: "IL", flag: "🇮🇱", capital: "Jerusalem", continent: "Asia",
      population: 9364000, timezoneCount: 1, displayOrder: 40,
      cities: [
        { name: "Tel Aviv", timezone: "Asia/Jerusalem", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "TLV", latitude: 32.0853, longitude: 34.7818, population: 1388000 },
      ],
    },
    {
      name: "Saudi Arabia", code: "SA", flag: "🇸🇦", capital: "Riyadh", continent: "Asia",
      population: 35000000, timezoneCount: 1, displayOrder: 41,
      cities: [
        { name: "Riyadh", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "RUH", latitude: 24.7136, longitude: 46.6753, population: 7676000 },
        { name: "Jeddah", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "JED", latitude: 21.4858, longitude: 39.1925, population: 4600000 },
      ],
    },
    {
      name: "Qatar", code: "QA", flag: "🇶🇦", capital: "Doha", continent: "Asia",
      population: 2931000, timezoneCount: 1, displayOrder: 42,
      cities: [
        { name: "Doha", timezone: "Asia/Qatar", gmtOffset: "+03:00", dstOffset: null, airportCode: "DOH", latitude: 25.2854, longitude: 51.531, population: 1382000 },
      ],
    },
    {
      name: "Indonesia", code: "ID", flag: "🇮🇩", capital: "Jakarta", continent: "Asia",
      population: 273800000, timezoneCount: 3, displayOrder: 43,
      cities: [
        { name: "Jakarta", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "CGK", latitude: -6.2088, longitude: 106.8456, population: 10670000 },
        { name: "Bali", timezone: "Asia/Makassar", gmtOffset: "+08:00", dstOffset: null, airportCode: "DPS", latitude: -8.4095, longitude: 115.1889, population: 726000 },
      ],
    },
    {
      name: "Malaysia", code: "MY", flag: "🇲🇾", capital: "Kuala Lumpur", continent: "Asia",
      population: 32780000, timezoneCount: 1, displayOrder: 44,
      cities: [
        { name: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", gmtOffset: "+08:00", dstOffset: null, airportCode: "KUL", latitude: 3.139, longitude: 101.6869, population: 1768000 },
      ],
    },
    {
      name: "Vietnam", code: "VN", flag: "🇻🇳", capital: "Hanoi", continent: "Asia",
      population: 97470000, timezoneCount: 1, displayOrder: 45,
      cities: [
        { name: "Ho Chi Minh City", timezone: "Asia/Ho_Chi_Minh", gmtOffset: "+07:00", dstOffset: null, airportCode: "SGN", latitude: 10.8231, longitude: 106.6297, population: 8993000 },
        { name: "Hanoi", timezone: "Asia/Ho_Chi_Minh", gmtOffset: "+07:00", dstOffset: null, airportCode: "HAN", latitude: 21.0278, longitude: 105.8342, population: 8053000 },
      ],
    },
    {
      name: "Philippines", code: "PH", flag: "🇵🇭", capital: "Manila", continent: "Asia",
      population: 109600000, timezoneCount: 1, displayOrder: 46,
      cities: [
        { name: "Manila", timezone: "Asia/Manila", gmtOffset: "+08:00", dstOffset: null, airportCode: "MNL", latitude: 14.5995, longitude: 120.9842, population: 13923000 },
      ],
    },
    {
      name: "Pakistan", code: "PK", flag: "🇵🇰", capital: "Islamabad", continent: "Asia",
      population: 225200000, timezoneCount: 1, displayOrder: 47,
      cities: [
        { name: "Karachi", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "KHI", latitude: 24.8607, longitude: 67.0011, population: 16450000 },
      ],
    },
    {
      name: "Bangladesh", code: "BD", flag: "🇧🇩", capital: "Dhaka", continent: "Asia",
      population: 166300000, timezoneCount: 1, displayOrder: 48,
      cities: [
        { name: "Dhaka", timezone: "Asia/Dhaka", gmtOffset: "+06:00", dstOffset: null, airportCode: "DAC", latitude: 23.8103, longitude: 90.4125, population: 21740000 },
      ],
    },
    {
      name: "Nigeria", code: "NG", flag: "🇳🇬", capital: "Abuja", continent: "Africa",
      population: 211400000, timezoneCount: 1, displayOrder: 49,
      cities: [
        { name: "Lagos", timezone: "Africa/Lagos", gmtOffset: "+01:00", dstOffset: null, airportCode: "LOS", latitude: 6.5244, longitude: 3.3792, population: 14862000 },
      ],
    },
    {
      name: "Kenya", code: "KE", flag: "🇰🇪", capital: "Nairobi", continent: "Africa",
      population: 53770000, timezoneCount: 1, displayOrder: 50,
      cities: [
        { name: "Nairobi", timezone: "Africa/Nairobi", gmtOffset: "+03:00", dstOffset: null, airportCode: "NBO", latitude: -1.2921, longitude: 36.8219, population: 4397000 },
      ],
    },
    {
      name: "Morocco", code: "MA", flag: "🇲🇦", capital: "Rabat", continent: "Africa",
      population: 36910000, timezoneCount: 1, displayOrder: 51,
      cities: [
        { name: "Casablanca", timezone: "Africa/Casablanca", gmtOffset: "+01:00", dstOffset: null, airportCode: "CMN", latitude: 33.5731, longitude: -7.5898, population: 3359000 },
      ],
    },
    {
      name: "Ghana", code: "GH", flag: "🇬🇭", capital: "Accra", continent: "Africa",
      population: 31070000, timezoneCount: 1, displayOrder: 52,
      cities: [
        { name: "Accra", timezone: "Africa/Accra", gmtOffset: "+00:00", dstOffset: null, airportCode: "ACC", latitude: 5.6037, longitude: -0.187, population: 2388000 },
      ],
    },
    {
      name: "Ethiopia", code: "ET", flag: "🇪🇹", capital: "Addis Ababa", continent: "Africa",
      population: 115000000, timezoneCount: 1, displayOrder: 53,
      cities: [
        { name: "Addis Ababa", timezone: "Africa/Addis_Ababa", gmtOffset: "+03:00", dstOffset: null, airportCode: "ADD", latitude: 9.032, longitude: 38.7469, population: 4794000 },
      ],
    },
    {
      name: "Colombia", code: "CO", flag: "🇨🇴", capital: "Bogotá", continent: "South America",
      population: 50880000, timezoneCount: 1, displayOrder: 54,
      cities: [
        { name: "Bogotá", timezone: "America/Bogota", gmtOffset: "-05:00", dstOffset: null, airportCode: "BOG", latitude: 4.711, longitude: -74.0721, population: 10700000 },
      ],
    },
    {
      name: "Chile", code: "CL", flag: "🇨🇱", capital: "Santiago", continent: "South America",
      population: 19120000, timezoneCount: 1, displayOrder: 55,
      cities: [
        { name: "Santiago", timezone: "America/Santiago", gmtOffset: "-04:00", dstOffset: "-03:00", airportCode: "SCL", latitude: -33.4489, longitude: -70.6693, population: 6837000 },
      ],
    },
    {
      name: "Peru", code: "PE", flag: "🇵🇪", capital: "Lima", continent: "South America",
      population: 32970000, timezoneCount: 1, displayOrder: 56,
      cities: [
        { name: "Lima", timezone: "America/Lima", gmtOffset: "-05:00", dstOffset: null, airportCode: "LIM", latitude: -12.0464, longitude: -77.0428, population: 10674000 },
      ],
    },
    {
      name: "Taiwan", code: "TW", flag: "🇹🇼", capital: "Taipei", continent: "Asia",
      population: 23890000, timezoneCount: 1, displayOrder: 57,
      cities: [
        { name: "Taipei", timezone: "Asia/Taipei", gmtOffset: "+08:00", dstOffset: null, airportCode: "TPE", latitude: 25.033, longitude: 121.5654, population: 2646000 },
      ],
    },
    {
      name: "Hong Kong", code: "HK", flag: "🇭🇰", capital: "Hong Kong", continent: "Asia",
      population: 7482000, timezoneCount: 1, displayOrder: 58,
      cities: [
        { name: "Hong Kong", timezone: "Asia/Hong_Kong", gmtOffset: "+08:00", dstOffset: null, airportCode: "HKG", latitude: 22.3193, longitude: 114.1694, population: 7482000 },
      ],
    },
    // ========== MORE EUROPE ==========
    { name: "Bulgaria", code: "BG", flag: "🇧🇬", capital: "Sofia", continent: "Europe", population: 6878000, timezoneCount: 1, displayOrder: 59, cities: [{ name: "Sofia", timezone: "Europe/Sofia", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "SOF", latitude: 42.6977, longitude: 23.3219, population: 1242000 }] },
    { name: "Croatia", code: "HR", flag: "🇭🇷", capital: "Zagreb", continent: "Europe", population: 3899000, timezoneCount: 1, displayOrder: 60, cities: [{ name: "Zagreb", timezone: "Europe/Zagreb", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "ZAG", latitude: 45.815, longitude: 15.9819, population: 806000 }] },
    { name: "Slovakia", code: "SK", flag: "🇸🇰", capital: "Bratislava", continent: "Europe", population: 5459000, timezoneCount: 1, displayOrder: 61, cities: [{ name: "Bratislava", timezone: "Europe/Bratislava", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BTS", latitude: 48.1486, longitude: 17.1077, population: 432000 }] },
    { name: "Slovenia", code: "SI", flag: "🇸🇮", capital: "Ljubljana", continent: "Europe", population: 2108000, timezoneCount: 1, displayOrder: 62, cities: [{ name: "Ljubljana", timezone: "Europe/Ljubljana", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "LJU", latitude: 46.0569, longitude: 14.5058, population: 292000 }] },
    { name: "Serbia", code: "RS", flag: "🇷🇸", capital: "Belgrade", continent: "Europe", population: 6871000, timezoneCount: 1, displayOrder: 63, cities: [{ name: "Belgrade", timezone: "Europe/Belgrade", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BEG", latitude: 44.7866, longitude: 20.4489, population: 1374000 }] },
    { name: "Lithuania", code: "LT", flag: "🇱🇹", capital: "Vilnius", continent: "Europe", population: 2795000, timezoneCount: 1, displayOrder: 64, cities: [{ name: "Vilnius", timezone: "Europe/Vilnius", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "VNO", latitude: 54.6872, longitude: 25.2797, population: 539000 }] },
    { name: "Latvia", code: "LV", flag: "🇱🇻", capital: "Riga", continent: "Europe", population: 1884000, timezoneCount: 1, displayOrder: 65, cities: [{ name: "Riga", timezone: "Europe/Riga", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "RIX", latitude: 56.9496, longitude: 24.1052, population: 627000 }] },
    { name: "Estonia", code: "EE", flag: "🇪🇪", capital: "Tallinn", continent: "Europe", population: 1331000, timezoneCount: 1, displayOrder: 66, cities: [{ name: "Tallinn", timezone: "Europe/Tallinn", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "TLL", latitude: 59.437, longitude: 24.7536, population: 438000 }] },
    { name: "Iceland", code: "IS", flag: "🇮🇸", capital: "Reykjavik", continent: "Europe", population: 366000, timezoneCount: 1, displayOrder: 67, cities: [{ name: "Reykjavik", timezone: "Atlantic/Reykjavik", gmtOffset: "+00:00", dstOffset: null, airportCode: "KEF", latitude: 64.1466, longitude: -21.9426, population: 232000 }] },
    { name: "Luxembourg", code: "LU", flag: "🇱🇺", capital: "Luxembourg City", continent: "Europe", population: 634000, timezoneCount: 1, displayOrder: 68, cities: [{ name: "Luxembourg", timezone: "Europe/Luxembourg", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "LUX", latitude: 49.6117, longitude: 6.13, population: 124000 }] },
    { name: "Malta", code: "MT", flag: "🇲🇹", capital: "Valletta", continent: "Europe", population: 516000, timezoneCount: 1, displayOrder: 69, cities: [{ name: "Valletta", timezone: "Europe/Malta", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "MLA", latitude: 35.8989, longitude: 14.5146, population: 6444 }] },
    { name: "Cyprus", code: "CY", flag: "🇨🇾", capital: "Nicosia", continent: "Europe", population: 1207000, timezoneCount: 1, displayOrder: 70, cities: [{ name: "Nicosia", timezone: "Asia/Nicosia", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "LCA", latitude: 35.1856, longitude: 33.3823, population: 200000 }] },
    { name: "Monaco", code: "MC", flag: "🇲🇨", capital: "Monaco", continent: "Europe", population: 39244, timezoneCount: 1, displayOrder: 71, cities: [{ name: "Monaco", timezone: "Europe/Monaco", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: null, latitude: 43.7384, longitude: 7.4246, population: 39244 }] },
    // ========== MORE ASIA ==========
    { name: "Nepal", code: "NP", flag: "🇳🇵", capital: "Kathmandu", continent: "Asia", population: 29140000, timezoneCount: 1, displayOrder: 72, cities: [{ name: "Kathmandu", timezone: "Asia/Kathmandu", gmtOffset: "+05:45", dstOffset: null, airportCode: "KTM", latitude: 27.7172, longitude: 85.324, population: 1442000 }] },
    { name: "Sri Lanka", code: "LK", flag: "🇱🇰", capital: "Colombo", continent: "Asia", population: 21920000, timezoneCount: 1, displayOrder: 73, cities: [{ name: "Colombo", timezone: "Asia/Colombo", gmtOffset: "+05:30", dstOffset: null, airportCode: "CMB", latitude: 6.9271, longitude: 79.8612, population: 648000 }] },
    { name: "Myanmar", code: "MM", flag: "🇲🇲", capital: "Naypyidaw", continent: "Asia", population: 54410000, timezoneCount: 1, displayOrder: 74, cities: [{ name: "Yangon", timezone: "Asia/Yangon", gmtOffset: "+06:30", dstOffset: null, airportCode: "RGN", latitude: 16.8409, longitude: 96.1735, population: 5211000 }] },
    { name: "Cambodia", code: "KH", flag: "🇰🇭", capital: "Phnom Penh", continent: "Asia", population: 16720000, timezoneCount: 1, displayOrder: 75, cities: [{ name: "Phnom Penh", timezone: "Asia/Phnom_Penh", gmtOffset: "+07:00", dstOffset: null, airportCode: "PNH", latitude: 11.5564, longitude: 104.9282, population: 2129000 }] },
    { name: "Laos", code: "LA", flag: "🇱🇦", capital: "Vientiane", continent: "Asia", population: 7276000, timezoneCount: 1, displayOrder: 76, cities: [{ name: "Vientiane", timezone: "Asia/Vientiane", gmtOffset: "+07:00", dstOffset: null, airportCode: "VTE", latitude: 17.9757, longitude: 102.6331, population: 820000 }] },
    { name: "Mongolia", code: "MN", flag: "🇲🇳", capital: "Ulaanbaatar", continent: "Asia", population: 3278000, timezoneCount: 2, displayOrder: 77, cities: [{ name: "Ulaanbaatar", timezone: "Asia/Ulaanbaatar", gmtOffset: "+08:00", dstOffset: null, airportCode: "UBN", latitude: 47.9181, longitude: 106.9176, population: 1493000 }] },
    { name: "Kazakhstan", code: "KZ", flag: "🇰🇿", capital: "Astana", continent: "Asia", population: 18750000, timezoneCount: 2, displayOrder: 78, cities: [{ name: "Almaty", timezone: "Asia/Almaty", gmtOffset: "+05:00", dstOffset: null, airportCode: "ALA", latitude: 43.222, longitude: 76.8512, population: 2040000 }] },
    { name: "Uzbekistan", code: "UZ", flag: "🇺🇿", capital: "Tashkent", continent: "Asia", population: 34230000, timezoneCount: 1, displayOrder: 79, cities: [{ name: "Tashkent", timezone: "Asia/Tashkent", gmtOffset: "+05:00", dstOffset: null, airportCode: "TAS", latitude: 41.2995, longitude: 69.2401, population: 2571000 }] },
    { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", capital: "Baku", continent: "Asia", population: 10140000, timezoneCount: 1, displayOrder: 80, cities: [{ name: "Baku", timezone: "Asia/Baku", gmtOffset: "+04:00", dstOffset: null, airportCode: "GYD", latitude: 40.4093, longitude: 49.8671, population: 2374000 }] },
    { name: "Georgia", code: "GE", flag: "🇬🇪", capital: "Tbilisi", continent: "Asia", population: 3729000, timezoneCount: 1, displayOrder: 81, cities: [{ name: "Tbilisi", timezone: "Asia/Tbilisi", gmtOffset: "+04:00", dstOffset: null, airportCode: "TBS", latitude: 41.7151, longitude: 44.8271, population: 1154000 }] },
    { name: "Armenia", code: "AM", flag: "🇦🇲", capital: "Yerevan", continent: "Asia", population: 2963000, timezoneCount: 1, displayOrder: 82, cities: [{ name: "Yerevan", timezone: "Asia/Yerevan", gmtOffset: "+04:00", dstOffset: null, airportCode: "EVN", latitude: 40.1792, longitude: 44.4991, population: 1075000 }] },
    { name: "Kuwait", code: "KW", flag: "🇰🇼", capital: "Kuwait City", continent: "Asia", population: 4271000, timezoneCount: 1, displayOrder: 83, cities: [{ name: "Kuwait City", timezone: "Asia/Kuwait", gmtOffset: "+03:00", dstOffset: null, airportCode: "KWI", latitude: 29.3759, longitude: 47.9774, population: 3000000 }] },
    { name: "Bahrain", code: "BH", flag: "🇧🇭", capital: "Manama", continent: "Asia", population: 1702000, timezoneCount: 1, displayOrder: 84, cities: [{ name: "Manama", timezone: "Asia/Bahrain", gmtOffset: "+03:00", dstOffset: null, airportCode: "BAH", latitude: 26.2235, longitude: 50.5876, population: 632000 }] },
    { name: "Oman", code: "OM", flag: "🇴🇲", capital: "Muscat", continent: "Asia", population: 5107000, timezoneCount: 1, displayOrder: 85, cities: [{ name: "Muscat", timezone: "Asia/Muscat", gmtOffset: "+04:00", dstOffset: null, airportCode: "MCT", latitude: 23.588, longitude: 58.3829, population: 1310000 }] },
    { name: "Jordan", code: "JO", flag: "🇯🇴", capital: "Amman", continent: "Asia", population: 10200000, timezoneCount: 1, displayOrder: 86, cities: [{ name: "Amman", timezone: "Asia/Amman", gmtOffset: "+03:00", dstOffset: null, airportCode: "AMM", latitude: 31.9454, longitude: 35.9284, population: 4060000 }] },
    { name: "Lebanon", code: "LB", flag: "🇱🇧", capital: "Beirut", continent: "Asia", population: 6825000, timezoneCount: 1, displayOrder: 87, cities: [{ name: "Beirut", timezone: "Asia/Beirut", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "BEY", latitude: 33.8938, longitude: 35.5018, population: 2385000 }] },
    { name: "Iraq", code: "IQ", flag: "🇮🇶", capital: "Baghdad", continent: "Asia", population: 40220000, timezoneCount: 1, displayOrder: 88, cities: [{ name: "Baghdad", timezone: "Asia/Baghdad", gmtOffset: "+03:00", dstOffset: null, airportCode: "BGW", latitude: 33.3152, longitude: 44.3661, population: 7216000 }] },
    { name: "Iran", code: "IR", flag: "🇮🇷", capital: "Tehran", continent: "Asia", population: 83990000, timezoneCount: 1, displayOrder: 89, cities: [{ name: "Tehran", timezone: "Asia/Tehran", gmtOffset: "+03:30", dstOffset: "+04:30", airportCode: "IKA", latitude: 35.6892, longitude: 51.389, population: 9414000 }] },
    { name: "Afghanistan", code: "AF", flag: "🇦🇫", capital: "Kabul", continent: "Asia", population: 38930000, timezoneCount: 1, displayOrder: 90, cities: [{ name: "Kabul", timezone: "Asia/Kabul", gmtOffset: "+04:30", dstOffset: null, airportCode: "KBL", latitude: 34.5553, longitude: 69.2075, population: 4434000 }] },
    { name: "Maldives", code: "MV", flag: "🇲🇻", capital: "Malé", continent: "Asia", population: 540000, timezoneCount: 1, displayOrder: 91, cities: [{ name: "Malé", timezone: "Indian/Maldives", gmtOffset: "+05:00", dstOffset: null, airportCode: "MLE", latitude: 4.1755, longitude: 73.5093, population: 227000 }] },
    { name: "Brunei", code: "BN", flag: "🇧🇳", capital: "Bandar Seri Begawan", continent: "Asia", population: 437000, timezoneCount: 1, displayOrder: 92, cities: [{ name: "Bandar Seri Begawan", timezone: "Asia/Brunei", gmtOffset: "+08:00", dstOffset: null, airportCode: "BWN", latitude: 4.9031, longitude: 114.9398, population: 100000 }] },
    // ========== MORE AFRICA ==========
    { name: "Tunisia", code: "TN", flag: "🇹🇳", capital: "Tunis", continent: "Africa", population: 11820000, timezoneCount: 1, displayOrder: 93, cities: [{ name: "Tunis", timezone: "Africa/Tunis", gmtOffset: "+01:00", dstOffset: null, airportCode: "TUN", latitude: 36.8065, longitude: 10.1815, population: 638000 }] },
    { name: "Algeria", code: "DZ", flag: "🇩🇿", capital: "Algiers", continent: "Africa", population: 43850000, timezoneCount: 1, displayOrder: 94, cities: [{ name: "Algiers", timezone: "Africa/Algiers", gmtOffset: "+01:00", dstOffset: null, airportCode: "ALG", latitude: 36.7538, longitude: 3.0588, population: 3416000 }] },
    { name: "Senegal", code: "SN", flag: "🇸🇳", capital: "Dakar", continent: "Africa", population: 16740000, timezoneCount: 1, displayOrder: 95, cities: [{ name: "Dakar", timezone: "Africa/Dakar", gmtOffset: "+00:00", dstOffset: null, airportCode: "DSS", latitude: 14.7167, longitude: -17.4677, population: 1146000 }] },
    { name: "Ivory Coast", code: "CI", flag: "🇨🇮", capital: "Yamoussoukro", continent: "Africa", population: 26380000, timezoneCount: 1, displayOrder: 96, cities: [{ name: "Abidjan", timezone: "Africa/Abidjan", gmtOffset: "+00:00", dstOffset: null, airportCode: "ABJ", latitude: 5.36, longitude: -4.0083, population: 4980000 }] },
    { name: "Tanzania", code: "TZ", flag: "🇹🇿", capital: "Dodoma", continent: "Africa", population: 59730000, timezoneCount: 1, displayOrder: 97, cities: [{ name: "Dar es Salaam", timezone: "Africa/Dar_es_Salaam", gmtOffset: "+03:00", dstOffset: null, airportCode: "DAR", latitude: -6.7924, longitude: 39.2083, population: 6048000 }] },
    { name: "Uganda", code: "UG", flag: "🇺🇬", capital: "Kampala", continent: "Africa", population: 45740000, timezoneCount: 1, displayOrder: 98, cities: [{ name: "Kampala", timezone: "Africa/Kampala", gmtOffset: "+03:00", dstOffset: null, airportCode: "EBB", latitude: 0.3476, longitude: 32.5825, population: 1659000 }] },
    { name: "Rwanda", code: "RW", flag: "🇷🇼", capital: "Kigali", continent: "Africa", population: 12950000, timezoneCount: 1, displayOrder: 99, cities: [{ name: "Kigali", timezone: "Africa/Kigali", gmtOffset: "+02:00", dstOffset: null, airportCode: "KGL", latitude: -1.9441, longitude: 30.0619, population: 1132000 }] },
    { name: "Angola", code: "AO", flag: "🇦🇴", capital: "Luanda", continent: "Africa", population: 32870000, timezoneCount: 1, displayOrder: 100, cities: [{ name: "Luanda", timezone: "Africa/Luanda", gmtOffset: "+01:00", dstOffset: null, airportCode: "LAD", latitude: -8.839, longitude: 13.2894, population: 8417000 }] },
    { name: "Zimbabwe", code: "ZW", flag: "🇿🇼", capital: "Harare", continent: "Africa", population: 14860000, timezoneCount: 1, displayOrder: 101, cities: [{ name: "Harare", timezone: "Africa/Harare", gmtOffset: "+02:00", dstOffset: null, airportCode: "HRE", latitude: -17.8252, longitude: 31.0335, population: 1542000 }] },
    { name: "Mauritius", code: "MU", flag: "🇲🇺", capital: "Port Louis", continent: "Africa", population: 1266000, timezoneCount: 1, displayOrder: 102, cities: [{ name: "Port Louis", timezone: "Indian/Mauritius", gmtOffset: "+04:00", dstOffset: null, airportCode: "MRU", latitude: -20.1609, longitude: 57.5012, population: 149000 }] },
    { name: "Seychelles", code: "SC", flag: "🇸🇨", capital: "Victoria", continent: "Africa", population: 98462, timezoneCount: 1, displayOrder: 103, cities: [{ name: "Victoria", timezone: "Indian/Mahe", gmtOffset: "+04:00", dstOffset: null, airportCode: "SEZ", latitude: -4.6191, longitude: 55.4513, population: 26450 }] },
    { name: "Botswana", code: "BW", flag: "🇧🇼", capital: "Gaborone", continent: "Africa", population: 2352000, timezoneCount: 1, displayOrder: 104, cities: [{ name: "Gaborone", timezone: "Africa/Gaborone", gmtOffset: "+02:00", dstOffset: null, airportCode: "GBE", latitude: -24.6282, longitude: 25.9231, population: 231000 }] },
    { name: "Namibia", code: "NA", flag: "🇳🇦", capital: "Windhoek", continent: "Africa", population: 2541000, timezoneCount: 1, displayOrder: 105, cities: [{ name: "Windhoek", timezone: "Africa/Windhoek", gmtOffset: "+02:00", dstOffset: null, airportCode: "WDH", latitude: -22.5609, longitude: 17.0658, population: 431000 }] },
    { name: "Zambia", code: "ZM", flag: "🇿🇲", capital: "Lusaka", continent: "Africa", population: 18380000, timezoneCount: 1, displayOrder: 106, cities: [{ name: "Lusaka", timezone: "Africa/Lusaka", gmtOffset: "+02:00", dstOffset: null, airportCode: "LUN", latitude: -15.3875, longitude: 28.3228, population: 2526000 }] },
    { name: "Madagascar", code: "MG", flag: "🇲🇬", capital: "Antananarivo", continent: "Africa", population: 27690000, timezoneCount: 1, displayOrder: 107, cities: [{ name: "Antananarivo", timezone: "Indian/Antananarivo", gmtOffset: "+03:00", dstOffset: null, airportCode: "TNR", latitude: -18.8792, longitude: 47.5079, population: 2610000 }] },
    { name: "Mozambique", code: "MZ", flag: "🇲🇿", capital: "Maputo", continent: "Africa", population: 31260000, timezoneCount: 1, displayOrder: 108, cities: [{ name: "Maputo", timezone: "Africa/Maputo", gmtOffset: "+02:00", dstOffset: null, airportCode: "MPM", latitude: -25.9692, longitude: 32.5732, population: 1192000 }] },
    { name: "Sudan", code: "SD", flag: "🇸🇩", capital: "Khartoum", continent: "Africa", population: 43850000, timezoneCount: 1, displayOrder: 109, cities: [{ name: "Khartoum", timezone: "Africa/Khartoum", gmtOffset: "+02:00", dstOffset: null, airportCode: "KRT", latitude: 15.5007, longitude: 32.5599, population: 5534000 }] },
    { name: "Libya", code: "LY", flag: "🇱🇾", capital: "Tripoli", continent: "Africa", population: 6871000, timezoneCount: 1, displayOrder: 110, cities: [{ name: "Tripoli", timezone: "Africa/Tripoli", gmtOffset: "+02:00", dstOffset: null, airportCode: "MJI", latitude: 32.8872, longitude: 13.1913, population: 1170000 }] },
    // ========== MORE AMERICAS ==========
    { name: "Costa Rica", code: "CR", flag: "🇨🇷", capital: "San José", continent: "North America", population: 5094000, timezoneCount: 1, displayOrder: 111, cities: [{ name: "San José", timezone: "America/Costa_Rica", gmtOffset: "-06:00", dstOffset: null, airportCode: "SJO", latitude: 9.9281, longitude: -84.0907, population: 335000 }] },
    { name: "Panama", code: "PA", flag: "🇵🇦", capital: "Panama City", continent: "North America", population: 4314000, timezoneCount: 1, displayOrder: 112, cities: [{ name: "Panama City", timezone: "America/Panama", gmtOffset: "-05:00", dstOffset: null, airportCode: "PTY", latitude: 8.9824, longitude: -79.5199, population: 880000 }] },
    { name: "Cuba", code: "CU", flag: "🇨🇺", capital: "Havana", continent: "North America", population: 11330000, timezoneCount: 1, displayOrder: 113, cities: [{ name: "Havana", timezone: "America/Havana", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "HAV", latitude: 23.1136, longitude: -82.3666, population: 2138000 }] },
    { name: "Dominican Republic", code: "DO", flag: "🇩🇴", capital: "Santo Domingo", continent: "North America", population: 10850000, timezoneCount: 1, displayOrder: 114, cities: [{ name: "Santo Domingo", timezone: "America/Santo_Domingo", gmtOffset: "-04:00", dstOffset: null, airportCode: "SDQ", latitude: 18.4861, longitude: -69.9312, population: 2202000 }] },
    { name: "Jamaica", code: "JM", flag: "🇯🇲", capital: "Kingston", continent: "North America", population: 2961000, timezoneCount: 1, displayOrder: 115, cities: [{ name: "Kingston", timezone: "America/Jamaica", gmtOffset: "-05:00", dstOffset: null, airportCode: "KIN", latitude: 17.9712, longitude: -76.7928, population: 662000 }] },
    { name: "Guatemala", code: "GT", flag: "🇬🇹", capital: "Guatemala City", continent: "North America", population: 17920000, timezoneCount: 1, displayOrder: 116, cities: [{ name: "Guatemala City", timezone: "America/Guatemala", gmtOffset: "-06:00", dstOffset: null, airportCode: "GUA", latitude: 14.6349, longitude: -90.5069, population: 2934000 }] },
    { name: "Ecuador", code: "EC", flag: "🇪🇨", capital: "Quito", continent: "South America", population: 17640000, timezoneCount: 1, displayOrder: 117, cities: [{ name: "Quito", timezone: "America/Guayaquil", gmtOffset: "-05:00", dstOffset: null, airportCode: "UIO", latitude: -0.1807, longitude: -78.4678, population: 2011000 }] },
    { name: "Uruguay", code: "UY", flag: "🇺🇾", capital: "Montevideo", continent: "South America", population: 3474000, timezoneCount: 1, displayOrder: 118, cities: [{ name: "Montevideo", timezone: "America/Montevideo", gmtOffset: "-03:00", dstOffset: null, airportCode: "MVD", latitude: -34.9011, longitude: -56.1645, population: 1381000 }] },
    { name: "Paraguay", code: "PY", flag: "🇵🇾", capital: "Asunción", continent: "South America", population: 7133000, timezoneCount: 1, displayOrder: 119, cities: [{ name: "Asunción", timezone: "America/Asuncion", gmtOffset: "-04:00", dstOffset: "-03:00", airportCode: "ASU", latitude: -25.2637, longitude: -57.5759, population: 2300000 }] },
    { name: "Bolivia", code: "BO", flag: "🇧🇴", capital: "La Paz", continent: "South America", population: 11670000, timezoneCount: 1, displayOrder: 120, cities: [{ name: "La Paz", timezone: "America/La_Paz", gmtOffset: "-04:00", dstOffset: null, airportCode: "LPB", latitude: -16.5, longitude: -68.15, population: 1800000 }] },
    { name: "Venezuela", code: "VE", flag: "🇻🇪", capital: "Caracas", continent: "South America", population: 28440000, timezoneCount: 1, displayOrder: 121, cities: [{ name: "Caracas", timezone: "America/Caracas", gmtOffset: "-04:00", dstOffset: null, airportCode: "CCS", latitude: 10.4806, longitude: -66.9036, population: 2089000 }] },
    // ========== MORE OCEANIA ==========
    { name: "Fiji", code: "FJ", flag: "🇫🇯", capital: "Suva", continent: "Oceania", population: 896000, timezoneCount: 1, displayOrder: 122, cities: [{ name: "Suva", timezone: "Pacific/Fiji", gmtOffset: "+12:00", dstOffset: "+13:00", airportCode: "SUV", latitude: -18.1416, longitude: 178.4419, population: 93970 }] },
    { name: "Papua New Guinea", code: "PG", flag: "🇵🇬", capital: "Port Moresby", continent: "Oceania", population: 8947000, timezoneCount: 2, displayOrder: 123, cities: [{ name: "Port Moresby", timezone: "Pacific/Port_Moresby", gmtOffset: "+10:00", dstOffset: null, airportCode: "POM", latitude: -9.4438, longitude: 147.1803, population: 383000 }] },
    { name: "Samoa", code: "WS", flag: "🇼🇸", capital: "Apia", continent: "Oceania", population: 198000, timezoneCount: 1, displayOrder: 124, cities: [{ name: "Apia", timezone: "Pacific/Apia", gmtOffset: "+13:00", dstOffset: null, airportCode: "APW", latitude: -13.8333, longitude: -171.75, population: 36600 }] },
    { name: "Vanuatu", code: "VU", flag: "🇻🇺", capital: "Port Vila", continent: "Oceania", population: 307000, timezoneCount: 1, displayOrder: 125, cities: [{ name: "Port Vila", timezone: "Pacific/Efate", gmtOffset: "+11:00", dstOffset: null, airportCode: "VLI", latitude: -17.7333, longitude: 168.3167, population: 51630 }] },
    { name: "Solomon Islands", code: "SB", flag: "🇸🇧", capital: "Honiara", continent: "Oceania", population: 686000, timezoneCount: 1, displayOrder: 126, cities: [{ name: "Honiara", timezone: "Pacific/Guadalcanal", gmtOffset: "+11:00", dstOffset: null, airportCode: "HIR", latitude: -9.4333, longitude: 159.95, population: 92193 }] },
  ];

  for (const countryData of countriesData) {
    const { cities, ...countryFields } = countryData;
    const country = await prisma.country.upsert({
      where: { code: countryFields.code },
      update: { timezoneCount: countryFields.timezoneCount },
      create: countryFields,
    });

    for (const cityData of cities) {
      await prisma.city.upsert({
        where: {
          name_countryId: { name: cityData.name, countryId: country.id },
        },
        update: {},
        create: {
          ...cityData,
          countryId: country.id,
        },
      });
    }
    console.log(`✅ ${country.flag} ${country.name} seeded with ${cities.length} cities`);
  }

  // ==================== TIMEZONES ====================
  const timezones = [
    { name: "Pacific/Midway", offset: "-11:00", abbr: "SST" },
    { name: "Pacific/Honolulu", offset: "-10:00", abbr: "HST" },
    { name: "Pacific/Gambier", offset: "-09:00", abbr: "GAMT" },
    { name: "America/Anchorage", offset: "-09:00", abbr: "AKST" },
    { name: "America/Los_Angeles", offset: "-08:00", abbr: "PST" },
    { name: "America/Denver", offset: "-07:00", abbr: "MST" },
    { name: "America/Chicago", offset: "-06:00", abbr: "CST" },
    { name: "America/New_York", offset: "-05:00", abbr: "EST" },
    { name: "America/Halifax", offset: "-04:00", abbr: "AST" },
    { name: "America/Sao_Paulo", offset: "-03:00", abbr: "BRT" },
    { name: "Atlantic/South_Georgia", offset: "-02:00", abbr: "GST" },
    { name: "Atlantic/Azores", offset: "-01:00", abbr: "AZOT" },
    { name: "Europe/London", offset: "+00:00", abbr: "GMT" },
    { name: "Europe/Paris", offset: "+01:00", abbr: "CET" },
    { name: "Europe/Helsinki", offset: "+02:00", abbr: "EET" },
    { name: "Europe/Moscow", offset: "+03:00", abbr: "MSK" },
    { name: "Asia/Dubai", offset: "+04:00", abbr: "GST" },
    { name: "Asia/Karachi", offset: "+05:00", abbr: "PKT" },
    { name: "Asia/Kolkata", offset: "+05:30", abbr: "IST" },
    { name: "Asia/Dhaka", offset: "+06:00", abbr: "BST" },
    { name: "Asia/Bangkok", offset: "+07:00", abbr: "ICT" },
    { name: "Asia/Shanghai", offset: "+08:00", abbr: "CST" },
    { name: "Asia/Tokyo", offset: "+09:00", abbr: "JST" },
    { name: "Australia/Sydney", offset: "+10:00", abbr: "AEST" },
    { name: "Pacific/Norfolk", offset: "+11:00", abbr: "NFT" },
    { name: "Pacific/Auckland", offset: "+12:00", abbr: "NZST" },
    { name: "Pacific/Tongatapu", offset: "+13:00", abbr: "TOT" },
    { name: "Pacific/Kiritimati", offset: "+14:00", abbr: "LINT" },
  ];

  for (const tz of timezones) {
    await prisma.timezone.upsert({
      where: { name: tz.name },
      update: {},
      create: tz,
    });
  }
  console.log(`✅ ${timezones.length} timezones seeded`);

  // ==================== SETTINGS ====================
  const defaultSettings = [
    { key: "app_name", value: '"ClockHive"', group: "general" },
    { key: "app_description", value: '"The most beautiful timezone management platform"', group: "general" },
    { key: "timezone", value: '"UTC"', group: "general" },
    { key: "language", value: '"en"', group: "general" },
    { key: "currency", value: '"USD"', group: "general" },
    { key: "date_format", value: '"MM/DD/YYYY"', group: "general" },
    { key: "maintenance_mode", value: "false", group: "general" },
    { key: "terms_url", value: '"/terms"', group: "general" },
    { key: "privacy_url", value: '"/privacy"', group: "general" },
    { key: "cookie_url", value: '"/cookies"', group: "general" },
    { key: "google_analytics_id", value: '""', group: "integrations" },
    { key: "adsense_publisher_id", value: '""', group: "ads" },
    { key: "mailchimp_api_key", value: '""', group: "email" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ ${defaultSettings.length} settings seeded`);

  // ==================== HOMEPAGE SECTIONS ====================
  const sections = [
    { section: "hero_banner", enabled: true, order: 1 },
    { section: "search", enabled: true, order: 2 },
    { section: "timeline", enabled: true, order: 3 },
    { section: "meeting_planner", enabled: true, order: 4 },
    { section: "featured_countries", enabled: true, order: 5 },
    { section: "news", enabled: false, order: 6 },
    { section: "ads", enabled: true, order: 7 },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { section: section.section },
      update: {},
      create: section,
    });
  }
  console.log(`✅ Homepage sections seeded`);

  // ==================== SAMPLE ADS ====================
  await prisma.advertisement.create({
    data: {
      name: "Sample Header Banner",
      type: "html",
      placement: "header_banner",
      content: '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:15px;text-align:center;border-radius:8px;font-weight:bold;">🌟 Your Ad Here - 728x90 Leaderboard</div>',
      priority: 1,
      weight: 1,
      status: "active",
    },
  });

  // ==================== SAMPLE BLOG POST ====================
  await prisma.blogCategory.upsert({
    where: { slug: "timezone-tips" },
    update: {},
    create: { name: "Timezone Tips", slug: "timezone-tips", description: "Tips for managing time zones" },
  });

  await prisma.blogPost.upsert({
    where: { slug: "why-remote-teams-need-timezone-tool" },
    update: {},
    create: {
      title: "Why Every Remote Team Needs a Timezone Management Tool",
      slug: "why-remote-teams-need-timezone-tool",
      excerpt: "Managing time zones across distributed teams is one of the biggest challenges in remote work. Here's why a dedicated tool matters.",
      content: `<p>In today's distributed work environment, teams are spread across the globe. Coordinating meetings, deadlines, and collaboration across time zones has become a critical skill.</p>
<p>A good timezone management tool helps you:</p>
<ul>
<li>Quickly find overlapping working hours</li>
<li>Avoid scheduling meetings outside someone's work hours</li>
<li>Plan project timelines with timezone awareness</li>
</ul>`,
      status: "published",
      publishedAt: new Date(),
      categoryId: (await prisma.blogCategory.findUnique({ where: { slug: "timezone-tips" } }))!.id,
      seoTitle: "Why Remote Teams Need Timezone Management | ClockHive",
      seoDescription: "Learn why timezone management is essential for remote teams and how to pick the right tool.",
    },
  });
  console.log("✅ Sample blog post created");

  // ==================== THEME ====================
  await prisma.themeConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      primaryColor: "#3b82f6",
      accentColor: "#d946ef",
      fontFamily: "Inter",
      borderRadius: "0.5rem",
    },
  });

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin login: admin@clockhive.cc / admin123");
  console.log("📧 Demo login:  demo@clockhive.cc / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
