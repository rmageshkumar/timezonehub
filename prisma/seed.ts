import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (tursoUrl) {
    return new PrismaClient({ adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken || undefined }) });
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
    // ========== MORE EUROPE ==========
    { name: "Belarus", code: "BY", flag: "🇧🇾", capital: "Minsk", continent: "Europe", population: 9349000, timezoneCount: 1, displayOrder: 127, cities: [{ name: "Minsk", timezone: "Europe/Minsk", gmtOffset: "+03:00", dstOffset: null, airportCode: "MSQ", latitude: 53.9006, longitude: 27.559, population: 1982000 }] },
    { name: "Moldova", code: "MD", flag: "🇲🇩", capital: "Chișinău", continent: "Europe", population: 2597000, timezoneCount: 1, displayOrder: 128, cities: [{ name: "Chișinău", timezone: "Europe/Chisinau", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "KIV", latitude: 47.0105, longitude: 28.8638, population: 639000 }] },
    { name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦", capital: "Sarajevo", continent: "Europe", population: 3281000, timezoneCount: 1, displayOrder: 129, cities: [{ name: "Sarajevo", timezone: "Europe/Sarajevo", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "SJJ", latitude: 43.8563, longitude: 18.4131, population: 343000 }] },
    { name: "Albania", code: "AL", flag: "🇦🇱", capital: "Tirana", continent: "Europe", population: 2812000, timezoneCount: 1, displayOrder: 130, cities: [{ name: "Tirana", timezone: "Europe/Tirane", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "TIA", latitude: 41.3275, longitude: 19.8187, population: 503000 }] },
    { name: "North Macedonia", code: "MK", flag: "🇲🇰", capital: "Skopje", continent: "Europe", population: 2077000, timezoneCount: 1, displayOrder: 131, cities: [{ name: "Skopje", timezone: "Europe/Skopje", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "SKP", latitude: 41.9973, longitude: 21.428, population: 544000 }] },
    { name: "Montenegro", code: "ME", flag: "🇲🇪", capital: "Podgorica", continent: "Europe", population: 620000, timezoneCount: 1, displayOrder: 132, cities: [{ name: "Podgorica", timezone: "Europe/Podgorica", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "TGD", latitude: 42.4304, longitude: 19.2594, population: 187000 }] },
    { name: "Kosovo", code: "XK", flag: "🇽🇰", capital: "Pristina", continent: "Europe", population: 1798000, timezoneCount: 1, displayOrder: 133, cities: [{ name: "Pristina", timezone: "Europe/Belgrade", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "PRN", latitude: 42.6629, longitude: 21.1655, population: 210000 }] },
    { name: "Andorra", code: "AD", flag: "🇦🇩", capital: "Andorra la Vella", continent: "Europe", population: 77400, timezoneCount: 1, displayOrder: 134, cities: [{ name: "Andorra la Vella", timezone: "Europe/Andorra", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: null, latitude: 42.5063, longitude: 1.5218, population: 22886 }] },
    { name: "Liechtenstein", code: "LI", flag: "🇱🇮", capital: "Vaduz", continent: "Europe", population: 38896, timezoneCount: 1, displayOrder: 135, cities: [{ name: "Vaduz", timezone: "Europe/Vaduz", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: null, latitude: 47.141, longitude: 9.5215, population: 5696 }] },
    { name: "San Marino", code: "SM", flag: "🇸🇲", capital: "San Marino", continent: "Europe", population: 33909, timezoneCount: 1, displayOrder: 136, cities: [{ name: "San Marino", timezone: "Europe/San_Marino", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: null, latitude: 43.9424, longitude: 12.4578, population: 4500 }] },
    // ========== MORE ASIA ==========
    { name: "Syria", code: "SY", flag: "🇸🇾", capital: "Damascus", continent: "Asia", population: 17500000, timezoneCount: 1, displayOrder: 137, cities: [{ name: "Damascus", timezone: "Asia/Damascus", gmtOffset: "+03:00", dstOffset: null, airportCode: "DAM", latitude: 33.5138, longitude: 36.2765, population: 2574000 }] },
    { name: "Yemen", code: "YE", flag: "🇾🇪", capital: "Sana'a", continent: "Asia", population: 29830000, timezoneCount: 1, displayOrder: 138, cities: [{ name: "Sana'a", timezone: "Asia/Aden", gmtOffset: "+03:00", dstOffset: null, airportCode: "SAH", latitude: 15.3694, longitude: 44.191, population: 2957000 }] },
    { name: "Tajikistan", code: "TJ", flag: "🇹🇯", capital: "Dushanbe", continent: "Asia", population: 9538000, timezoneCount: 1, displayOrder: 139, cities: [{ name: "Dushanbe", timezone: "Asia/Dushanbe", gmtOffset: "+05:00", dstOffset: null, airportCode: "DYU", latitude: 38.5598, longitude: 68.787, population: 863000 }] },
    { name: "Kyrgyzstan", code: "KG", flag: "🇰🇬", capital: "Bishkek", continent: "Asia", population: 6524000, timezoneCount: 1, displayOrder: 140, cities: [{ name: "Bishkek", timezone: "Asia/Bishkek", gmtOffset: "+06:00", dstOffset: null, airportCode: "FRU", latitude: 42.8746, longitude: 74.5698, population: 1054000 }] },
    { name: "Turkmenistan", code: "TM", flag: "🇹🇲", capital: "Ashgabat", continent: "Asia", population: 6031000, timezoneCount: 1, displayOrder: 141, cities: [{ name: "Ashgabat", timezone: "Asia/Ashgabat", gmtOffset: "+05:00", dstOffset: null, airportCode: "ASB", latitude: 37.9601, longitude: 58.3261, population: 1032000 }] },
    { name: "Bhutan", code: "BT", flag: "🇧🇹", capital: "Thimphu", continent: "Asia", population: 771000, timezoneCount: 1, displayOrder: 142, cities: [{ name: "Thimphu", timezone: "Asia/Thimphu", gmtOffset: "+06:00", dstOffset: null, airportCode: "PBH", latitude: 27.4712, longitude: 89.6339, population: 114000 }] },
    { name: "East Timor", code: "TL", flag: "🇹🇱", capital: "Dili", continent: "Asia", population: 1318000, timezoneCount: 1, displayOrder: 143, cities: [{ name: "Dili", timezone: "Asia/Dili", gmtOffset: "+09:00", dstOffset: null, airportCode: "DIL", latitude: -8.5569, longitude: 125.5603, population: 277000 }] },
    { name: "Palestine", code: "PS", flag: "🇵🇸", capital: "Ramallah", continent: "Asia", population: 5100000, timezoneCount: 1, displayOrder: 144, cities: [{ name: "Gaza", timezone: "Asia/Gaza", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: null, latitude: 31.5017, longitude: 34.4668, population: 590000 }] },
    { name: "North Korea", code: "KP", flag: "🇰🇵", capital: "Pyongyang", continent: "Asia", population: 25780000, timezoneCount: 1, displayOrder: 145, cities: [{ name: "Pyongyang", timezone: "Asia/Pyongyang", gmtOffset: "+09:00", dstOffset: null, airportCode: "FNJ", latitude: 39.0392, longitude: 125.7625, population: 3100000 }] },
    // ========== MORE AMERICAS ==========
    { name: "Honduras", code: "HN", flag: "🇭🇳", capital: "Tegucigalpa", continent: "North America", population: 9905000, timezoneCount: 1, displayOrder: 146, cities: [{ name: "Tegucigalpa", timezone: "America/Tegucigalpa", gmtOffset: "-06:00", dstOffset: null, airportCode: "TGU", latitude: 14.0723, longitude: -87.1921, population: 1277000 }] },
    { name: "El Salvador", code: "SV", flag: "🇸🇻", capital: "San Salvador", continent: "North America", population: 6486000, timezoneCount: 1, displayOrder: 147, cities: [{ name: "San Salvador", timezone: "America/El_Salvador", gmtOffset: "-06:00", dstOffset: null, airportCode: "SAL", latitude: 13.6929, longitude: -89.2182, population: 1108000 }] },
    { name: "Nicaragua", code: "NI", flag: "🇳🇮", capital: "Managua", continent: "North America", population: 6625000, timezoneCount: 1, displayOrder: 148, cities: [{ name: "Managua", timezone: "America/Managua", gmtOffset: "-06:00", dstOffset: null, airportCode: "MGA", latitude: 12.1364, longitude: -86.2514, population: 1048000 }] },
    { name: "Belize", code: "BZ", flag: "🇧🇿", capital: "Belmopan", continent: "North America", population: 419000, timezoneCount: 1, displayOrder: 149, cities: [{ name: "Belize City", timezone: "America/Belize", gmtOffset: "-06:00", dstOffset: null, airportCode: "BZE", latitude: 17.5046, longitude: -88.1962, population: 67400 }] },
    { name: "Haiti", code: "HT", flag: "🇭🇹", capital: "Port-au-Prince", continent: "North America", population: 11400000, timezoneCount: 1, displayOrder: 150, cities: [{ name: "Port-au-Prince", timezone: "America/Port-au-Prince", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "PAP", latitude: 18.5944, longitude: -72.3074, population: 1237000 }] },
    { name: "Bahamas", code: "BS", flag: "🇧🇸", capital: "Nassau", continent: "North America", population: 393000, timezoneCount: 1, displayOrder: 151, cities: [{ name: "Nassau", timezone: "America/Nassau", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "NAS", latitude: 25.0343, longitude: -77.3963, population: 274000 }] },
    { name: "Trinidad and Tobago", code: "TT", flag: "🇹🇹", capital: "Port of Spain", continent: "North America", population: 1399000, timezoneCount: 1, displayOrder: 152, cities: [{ name: "Port of Spain", timezone: "America/Port_of_Spain", gmtOffset: "-04:00", dstOffset: null, airportCode: "POS", latitude: 10.6603, longitude: -61.5086, population: 37000 }] },
    { name: "Barbados", code: "BB", flag: "🇧🇧", capital: "Bridgetown", continent: "North America", population: 287000, timezoneCount: 1, displayOrder: 153, cities: [{ name: "Bridgetown", timezone: "America/Barbados", gmtOffset: "-04:00", dstOffset: null, airportCode: "BGI", latitude: 13.1132, longitude: -59.5988, population: 110000 }] },
    { name: "Guyana", code: "GY", flag: "🇬🇾", capital: "Georgetown", continent: "South America", population: 786000, timezoneCount: 1, displayOrder: 154, cities: [{ name: "Georgetown", timezone: "America/Guyana", gmtOffset: "-04:00", dstOffset: null, airportCode: "GEO", latitude: 6.8013, longitude: -58.1551, population: 235000 }] },
    { name: "Suriname", code: "SR", flag: "🇸🇷", capital: "Paramaribo", continent: "South America", population: 586000, timezoneCount: 1, displayOrder: 155, cities: [{ name: "Paramaribo", timezone: "America/Paramaribo", gmtOffset: "-03:00", dstOffset: null, airportCode: "PBM", latitude: 5.8664, longitude: -55.1668, population: 240000 }] },
    // ========== MORE AFRICA ==========
    { name: "Cameroon", code: "CM", flag: "🇨🇲", capital: "Yaoundé", continent: "Africa", population: 26550000, timezoneCount: 1, displayOrder: 156, cities: [{ name: "Douala", timezone: "Africa/Douala", gmtOffset: "+01:00", dstOffset: null, airportCode: "DLA", latitude: 4.0511, longitude: 9.7679, population: 3368000 }] },
    { name: "Burkina Faso", code: "BF", flag: "🇧🇫", capital: "Ouagadougou", continent: "Africa", population: 20900000, timezoneCount: 1, displayOrder: 157, cities: [{ name: "Ouagadougou", timezone: "Africa/Ouagadougou", gmtOffset: "+00:00", dstOffset: null, airportCode: "OUA", latitude: 12.3714, longitude: -1.5197, population: 2682000 }] },
    { name: "Mali", code: "ML", flag: "🇲🇱", capital: "Bamako", continent: "Africa", population: 20250000, timezoneCount: 1, displayOrder: 158, cities: [{ name: "Bamako", timezone: "Africa/Bamako", gmtOffset: "+00:00", dstOffset: null, airportCode: "BKO", latitude: 12.6392, longitude: -8.0029, population: 2713000 }] },
    { name: "Guinea", code: "GN", flag: "🇬🇳", capital: "Conakry", continent: "Africa", population: 13130000, timezoneCount: 1, displayOrder: 159, cities: [{ name: "Conakry", timezone: "Africa/Conakry", gmtOffset: "+00:00", dstOffset: null, airportCode: "CKY", latitude: 9.6412, longitude: -13.5784, population: 1667000 }] },
    { name: "Benin", code: "BJ", flag: "🇧🇯", capital: "Porto-Novo", continent: "Africa", population: 12120000, timezoneCount: 1, displayOrder: 160, cities: [{ name: "Cotonou", timezone: "Africa/Porto-Novo", gmtOffset: "+01:00", dstOffset: null, airportCode: "COO", latitude: 6.3703, longitude: 2.3912, population: 763000 }] },
    { name: "Niger", code: "NE", flag: "🇳🇪", capital: "Niamey", continent: "Africa", population: 24210000, timezoneCount: 1, displayOrder: 161, cities: [{ name: "Niamey", timezone: "Africa/Niamey", gmtOffset: "+01:00", dstOffset: null, airportCode: "NIM", latitude: 13.5127, longitude: 2.1126, population: 1334000 }] },
    { name: "Sierra Leone", code: "SL", flag: "🇸🇱", capital: "Freetown", continent: "Africa", population: 7976000, timezoneCount: 1, displayOrder: 162, cities: [{ name: "Freetown", timezone: "Africa/Freetown", gmtOffset: "+00:00", dstOffset: null, airportCode: "FNA", latitude: 8.484, longitude: -13.2299, population: 1056000 }] },
    { name: "Liberia", code: "LR", flag: "🇱🇷", capital: "Monrovia", continent: "Africa", population: 5058000, timezoneCount: 1, displayOrder: 163, cities: [{ name: "Monrovia", timezone: "Africa/Monrovia", gmtOffset: "+00:00", dstOffset: null, airportCode: "ROB", latitude: 6.3004, longitude: -10.7969, population: 1537000 }] },
    { name: "Togo", code: "TG", flag: "🇹🇬", capital: "Lomé", continent: "Africa", population: 8279000, timezoneCount: 1, displayOrder: 164, cities: [{ name: "Lomé", timezone: "Africa/Lome", gmtOffset: "+00:00", dstOffset: null, airportCode: "LFW", latitude: 6.1375, longitude: 1.2123, population: 947000 }] },
    { name: "Republic of the Congo", code: "CG", flag: "🇨🇬", capital: "Brazzaville", continent: "Africa", population: 5518000, timezoneCount: 1, displayOrder: 165, cities: [{ name: "Brazzaville", timezone: "Africa/Brazzaville", gmtOffset: "+01:00", dstOffset: null, airportCode: "BZV", latitude: -4.2634, longitude: 15.2429, population: 1827000 }] },
    { name: "DR Congo", code: "CD", flag: "🇨🇩", capital: "Kinshasa", continent: "Africa", population: 89560000, timezoneCount: 2, displayOrder: 166, cities: [{ name: "Kinshasa", timezone: "Africa/Kinshasa", gmtOffset: "+01:00", dstOffset: null, airportCode: "FIH", latitude: -4.4419, longitude: 15.2663, population: 14565000 }] },
    { name: "Malawi", code: "MW", flag: "🇲🇼", capital: "Lilongwe", continent: "Africa", population: 19130000, timezoneCount: 1, displayOrder: 167, cities: [{ name: "Lilongwe", timezone: "Africa/Blantyre", gmtOffset: "+02:00", dstOffset: null, airportCode: "LLW", latitude: -13.9626, longitude: 33.7741, population: 989000 }] },
    { name: "Burundi", code: "BI", flag: "🇧🇮", capital: "Gitega", continent: "Africa", population: 11890000, timezoneCount: 1, displayOrder: 168, cities: [{ name: "Bujumbura", timezone: "Africa/Bujumbura", gmtOffset: "+02:00", dstOffset: null, airportCode: "BJM", latitude: -3.3614, longitude: 29.3599, population: 1001000 }] },
    { name: "Somalia", code: "SO", flag: "🇸🇴", capital: "Mogadishu", continent: "Africa", population: 15890000, timezoneCount: 1, displayOrder: 169, cities: [{ name: "Mogadishu", timezone: "Africa/Mogadishu", gmtOffset: "+03:00", dstOffset: null, airportCode: "MGQ", latitude: 2.0371, longitude: 45.3438, population: 2500000 }] },
    { name: "Mauritania", code: "MR", flag: "🇲🇷", capital: "Nouakchott", continent: "Africa", population: 4650000, timezoneCount: 1, displayOrder: 170, cities: [{ name: "Nouakchott", timezone: "Africa/Nouakchott", gmtOffset: "+00:00", dstOffset: null, airportCode: "NKC", latitude: 18.0735, longitude: -15.9582, population: 958000 }] },
    { name: "Gabon", code: "GA", flag: "🇬🇦", capital: "Libreville", continent: "Africa", population: 2226000, timezoneCount: 1, displayOrder: 171, cities: [{ name: "Libreville", timezone: "Africa/Libreville", gmtOffset: "+01:00", dstOffset: null, airportCode: "LBV", latitude: 0.4162, longitude: 9.4673, population: 797000 }] },
    { name: "Eswatini", code: "SZ", flag: "🇸🇿", capital: "Mbabane", continent: "Africa", population: 1160000, timezoneCount: 1, displayOrder: 172, cities: [{ name: "Mbabane", timezone: "Africa/Mbabane", gmtOffset: "+02:00", dstOffset: null, airportCode: "MTS", latitude: -26.3054, longitude: 31.1367, population: 76000 }] },
    { name: "Lesotho", code: "LS", flag: "🇱🇸", capital: "Maseru", continent: "Africa", population: 2142000, timezoneCount: 1, displayOrder: 173, cities: [{ name: "Maseru", timezone: "Africa/Maseru", gmtOffset: "+02:00", dstOffset: null, airportCode: "MSU", latitude: -29.3151, longitude: 27.4863, population: 330000 }] },
    { name: "Equatorial Guinea", code: "GQ", flag: "🇬🇶", capital: "Malabo", continent: "Africa", population: 1403000, timezoneCount: 1, displayOrder: 174, cities: [{ name: "Malabo", timezone: "Africa/Malabo", gmtOffset: "+01:00", dstOffset: null, airportCode: "SSG", latitude: 3.7504, longitude: 8.7833, population: 297000 }] },
    { name: "Eritrea", code: "ER", flag: "🇪🇷", capital: "Asmara", continent: "Africa", population: 3550000, timezoneCount: 1, displayOrder: 175, cities: [{ name: "Asmara", timezone: "Africa/Asmara", gmtOffset: "+03:00", dstOffset: null, airportCode: "ASM", latitude: 15.3229, longitude: 38.9251, population: 963000 }] },
    { name: "South Sudan", code: "SS", flag: "🇸🇸", capital: "Juba", continent: "Africa", population: 11190000, timezoneCount: 1, displayOrder: 176, cities: [{ name: "Juba", timezone: "Africa/Juba", gmtOffset: "+02:00", dstOffset: null, airportCode: "JUB", latitude: 4.8517, longitude: 31.5825, population: 525000 }] },
    { name: "Chad", code: "TD", flag: "🇹🇩", capital: "N'Djamena", continent: "Africa", population: 16430000, timezoneCount: 1, displayOrder: 177, cities: [{ name: "N'Djamena", timezone: "Africa/Ndjamena", gmtOffset: "+01:00", dstOffset: null, airportCode: "NDJ", latitude: 12.1348, longitude: 15.0557, population: 1425000 }] },
    { name: "Central African Republic", code: "CF", flag: "🇨🇫", capital: "Bangui", continent: "Africa", population: 4830000, timezoneCount: 1, displayOrder: 178, cities: [{ name: "Bangui", timezone: "Africa/Bangui", gmtOffset: "+01:00", dstOffset: null, airportCode: "BGF", latitude: 4.3947, longitude: 18.5582, population: 889000 }] },
    // ========== MORE OCEANIA ==========
    { name: "Tonga", code: "TO", flag: "🇹🇴", capital: "Nukuʻalofa", continent: "Oceania", population: 100000, timezoneCount: 1, displayOrder: 179, cities: [{ name: "Nukuʻalofa", timezone: "Pacific/Tongatapu", gmtOffset: "+13:00", dstOffset: null, airportCode: "TBU", latitude: -21.1394, longitude: -175.2049, population: 24500 }] },
    { name: "Kiribati", code: "KI", flag: "🇰🇮", capital: "Tarawa", continent: "Oceania", population: 119000, timezoneCount: 3, displayOrder: 180, cities: [{ name: "Tarawa", timezone: "Pacific/Tarawa", gmtOffset: "+12:00", dstOffset: null, airportCode: "TRW", latitude: 1.328, longitude: 172.976, population: 63000 }] },
    { name: "Micronesia", code: "FM", flag: "🇫🇲", capital: "Palikir", continent: "Oceania", population: 113000, timezoneCount: 2, displayOrder: 181, cities: [{ name: "Palikir", timezone: "Pacific/Pohnpei", gmtOffset: "+11:00", dstOffset: null, airportCode: "PNI", latitude: 6.9147, longitude: 158.161, population: 6227 }] },
    { name: "Palau", code: "PW", flag: "🇵🇼", capital: "Ngerulmud", continent: "Oceania", population: 18000, timezoneCount: 1, displayOrder: 182, cities: [{ name: "Koror", timezone: "Pacific/Palau", gmtOffset: "+09:00", dstOffset: null, airportCode: "ROR", latitude: 7.3419, longitude: 134.4793, population: 11444 }] },
    { name: "Marshall Islands", code: "MH", flag: "🇲🇭", capital: "Majuro", continent: "Oceania", population: 59000, timezoneCount: 1, displayOrder: 183, cities: [{ name: "Majuro", timezone: "Pacific/Majuro", gmtOffset: "+12:00", dstOffset: null, airportCode: "MAJ", latitude: 7.1164, longitude: 171.1854, population: 27800 }] },
    { name: "Nauru", code: "NR", flag: "🇳🇷", capital: "Yaren", continent: "Oceania", population: 10834, timezoneCount: 1, displayOrder: 184, cities: [{ name: "Yaren", timezone: "Pacific/Nauru", gmtOffset: "+12:00", dstOffset: null, airportCode: "INU", latitude: -0.5477, longitude: 166.9209, population: 747 }] },
    // ========== MORE MAJOR CITIES FOR EXISTING COUNTRIES ==========
    // US West: San Francisco, Seattle
    { name: "United States", code: "US", flag: "🇺🇸", capital: "Washington, D.C.", continent: "North America", population: 331900000, timezoneCount: 9, displayOrder: 1, cities: [
      { name: "San Francisco", timezone: "America/Los_Angeles", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "SFO", latitude: 37.7749, longitude: -122.4194, population: 808437 },
      { name: "Seattle", timezone: "America/Los_Angeles", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "SEA", latitude: 47.6062, longitude: -122.3321, population: 737015 },
      { name: "Houston", timezone: "America/Chicago", gmtOffset: "-06:00", dstOffset: "-05:00", airportCode: "IAH", latitude: 29.7604, longitude: -95.3698, population: 2304580 },
      { name: "Phoenix", timezone: "America/Phoenix", gmtOffset: "-07:00", dstOffset: null, airportCode: "PHX", latitude: 33.4484, longitude: -112.074, population: 1608139 },
      { name: "Miami", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "MIA", latitude: 25.7617, longitude: -80.1918, population: 442241 },
      { name: "Washington DC", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "DCA", latitude: 38.9072, longitude: -77.0369, population: 689545 },
      { name: "Boston", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "BOS", latitude: 42.3601, longitude: -71.0589, population: 675647 },
      { name: "Dallas", timezone: "America/Chicago", gmtOffset: "-06:00", dstOffset: "-05:00", airportCode: "DFW", latitude: 32.7767, longitude: -96.797, population: 1304379 },
    ]},
    // India: Hyderabad, Ahmedabad, Pune
    { name: "India", code: "IN", flag: "🇮🇳", capital: "New Delhi", continent: "Asia", population: 1408000000, timezoneCount: 1, displayOrder: 3, cities: [
      { name: "Hyderabad", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "HYD", latitude: 17.385, longitude: 78.4867, population: 10106000 },
      { name: "Ahmedabad", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "AMD", latitude: 23.0225, longitude: 72.5714, population: 8483000 },
      { name: "Pune", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "PNQ", latitude: 18.5204, longitude: 73.8567, population: 6745000 },
      { name: "Jaipur", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "JAI", latitude: 26.9124, longitude: 75.7873, population: 3894000 },
    ]},
    // China: Shenzhen, Guangzhou, Chengdu
    { name: "China", code: "CN", flag: "🇨🇳", capital: "Beijing", continent: "Asia", population: 1412000000, timezoneCount: 1, displayOrder: 9, cities: [
      { name: "Shenzhen", timezone: "Asia/Shanghai", gmtOffset: "+08:00", dstOffset: null, airportCode: "SZX", latitude: 22.5431, longitude: 114.0579, population: 17560000 },
      { name: "Guangzhou", timezone: "Asia/Shanghai", gmtOffset: "+08:00", dstOffset: null, airportCode: "CAN", latitude: 23.1291, longitude: 113.2644, population: 18676000 },
      { name: "Chengdu", timezone: "Asia/Shanghai", gmtOffset: "+08:00", dstOffset: null, airportCode: "CTU", latitude: 30.5728, longitude: 104.0668, population: 16330000 },
    ]},
    // Japan: Kyoto, Yokohama
    { name: "Japan", code: "JP", flag: "🇯🇵", capital: "Tokyo", continent: "Asia", population: 125700000, timezoneCount: 1, displayOrder: 5, cities: [
      { name: "Kyoto", timezone: "Asia/Tokyo", gmtOffset: "+09:00", dstOffset: null, airportCode: "KIX", latitude: 35.0116, longitude: 135.7681, population: 1475000 },
      { name: "Yokohama", timezone: "Asia/Tokyo", gmtOffset: "+09:00", dstOffset: null, airportCode: "HND", latitude: 35.4437, longitude: 139.638, population: 3726000 },
      { name: "Sapporo", timezone: "Asia/Tokyo", gmtOffset: "+09:00", dstOffset: null, airportCode: "CTS", latitude: 43.0618, longitude: 141.3545, population: 1958000 },
    ]},
    // Germany: Hamburg, Frankfurt
    { name: "Germany", code: "DE", flag: "🇩🇪", capital: "Berlin", continent: "Europe", population: 83200000, timezoneCount: 1, displayOrder: 6, cities: [
      { name: "Hamburg", timezone: "Europe/Berlin", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "HAM", latitude: 53.5511, longitude: 9.9937, population: 1841000 },
      { name: "Frankfurt", timezone: "Europe/Berlin", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "FRA", latitude: 50.1109, longitude: 8.6821, population: 753000 },
      { name: "Cologne", timezone: "Europe/Berlin", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "CGN", latitude: 50.9375, longitude: 6.9603, population: 1086000 },
    ]},
    // Canada: Montreal, Calgary
    { name: "Canada", code: "CA", flag: "🇨🇦", capital: "Ottawa", continent: "North America", population: 38250000, timezoneCount: 6, displayOrder: 8, cities: [
      { name: "Montreal", timezone: "America/Toronto", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "YUL", latitude: 45.5017, longitude: -73.5673, population: 1762000 },
      { name: "Calgary", timezone: "America/Edmonton", gmtOffset: "-07:00", dstOffset: "-06:00", airportCode: "YYC", latitude: 51.0447, longitude: -114.0719, population: 1336000 },
      { name: "Ottawa", timezone: "America/Toronto", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "YOW", latitude: 45.4215, longitude: -75.6972, population: 989000 },
    ]},
    // Australia: Canberra, Darwin, Hobart
    { name: "Australia", code: "AU", flag: "🇦🇺", capital: "Canberra", continent: "Oceania", population: 25690000, timezoneCount: 5, displayOrder: 4, cities: [
      { name: "Canberra", timezone: "Australia/Sydney", gmtOffset: "+10:00", dstOffset: "+11:00", airportCode: "CBR", latitude: -35.2809, longitude: 149.13, population: 431000 },
      { name: "Darwin", timezone: "Australia/Darwin", gmtOffset: "+09:30", dstOffset: null, airportCode: "DRW", latitude: -12.4634, longitude: 130.8456, population: 147000 },
      { name: "Hobart", timezone: "Australia/Hobart", gmtOffset: "+10:00", dstOffset: "+11:00", airportCode: "HBA", latitude: -42.8826, longitude: 147.3257, population: 240000 },
      { name: "Gold Coast", timezone: "Australia/Brisbane", gmtOffset: "+10:00", dstOffset: null, airportCode: "OOL", latitude: -28.0167, longitude: 153.4, population: 679000 },
    ]},
    // Brazil: Brasília, Salvador
    { name: "Brazil", code: "BR", flag: "🇧🇷", capital: "Brasília", continent: "South America", population: 214300000, timezoneCount: 4, displayOrder: 10, cities: [
      { name: "Brasília", timezone: "America/Sao_Paulo", gmtOffset: "-03:00", dstOffset: null, airportCode: "BSB", latitude: -15.7975, longitude: -47.8919, population: 4559000 },
      { name: "Salvador", timezone: "America/Bahia", gmtOffset: "-03:00", dstOffset: null, airportCode: "SSA", latitude: -12.9714, longitude: -38.5014, population: 4167000 },
    ]},
    // Russia: Saint Petersburg
    { name: "Russia", code: "RU", flag: "🇷🇺", capital: "Moscow", continent: "Europe/Asia", population: 144100000, timezoneCount: 11, displayOrder: 13, cities: [
      { name: "Saint Petersburg", timezone: "Europe/Moscow", gmtOffset: "+03:00", dstOffset: null, airportCode: "LED", latitude: 59.9343, longitude: 30.3351, population: 5384000 },
      { name: "Novosibirsk", timezone: "Asia/Novosibirsk", gmtOffset: "+07:00", dstOffset: null, airportCode: "OVB", latitude: 55.0084, longitude: 82.9357, population: 1626000 },
      { name: "Vladivostok", timezone: "Asia/Vladivostok", gmtOffset: "+10:00", dstOffset: null, airportCode: "VVO", latitude: 43.1155, longitude: 131.8855, population: 606000 },
    ]},
    // Mexico: Cancún, Guadalajara, Monterrey
    { name: "Mexico", code: "MX", flag: "🇲🇽", capital: "Mexico City", continent: "North America", population: 128900000, timezoneCount: 4, displayOrder: 15, cities: [
      { name: "Cancún", timezone: "America/Cancun", gmtOffset: "-05:00", dstOffset: null, airportCode: "CUN", latitude: 21.1619, longitude: -86.8515, population: 888000 },
      { name: "Guadalajara", timezone: "America/Mexico_City", gmtOffset: "-06:00", dstOffset: null, airportCode: "GDL", latitude: 20.6597, longitude: -103.3496, population: 1525000 },
      { name: "Monterrey", timezone: "America/Monterrey", gmtOffset: "-06:00", dstOffset: null, airportCode: "MTY", latitude: 25.6866, longitude: -100.3161, population: 1135000 },
    ]},
    // Italy: Venice, Florence, Naples
    { name: "Italy", code: "IT", flag: "🇮🇹", capital: "Rome", continent: "Europe", population: 58940000, timezoneCount: 1, displayOrder: 16, cities: [
      { name: "Venice", timezone: "Europe/Rome", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "VCE", latitude: 45.4408, longitude: 12.3155, population: 261000 },
      { name: "Florence", timezone: "Europe/Rome", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "FLR", latitude: 43.7696, longitude: 11.2558, population: 383000 },
      { name: "Naples", timezone: "Europe/Rome", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "NAP", latitude: 40.8518, longitude: 14.2681, population: 962000 },
    ]},
    // Spain: Valencia, Seville
    { name: "Spain", code: "ES", flag: "🇪🇸", capital: "Madrid", continent: "Europe", population: 47420000, timezoneCount: 1, displayOrder: 17, cities: [
      { name: "Valencia", timezone: "Europe/Madrid", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "VLC", latitude: 39.4699, longitude: -0.3763, population: 791000 },
      { name: "Seville", timezone: "Europe/Madrid", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "SVQ", latitude: 37.3891, longitude: -5.9845, population: 688000 },
    ]},
    // Turkey: Ankara, Antalya
    { name: "Turkey", code: "TR", flag: "🇹🇷", capital: "Ankara", continent: "Asia/Europe", population: 84780000, timezoneCount: 1, displayOrder: 24, cities: [
      { name: "Ankara", timezone: "Europe/Istanbul", gmtOffset: "+03:00", dstOffset: null, airportCode: "ESB", latitude: 39.9334, longitude: 32.8597, population: 5639000 },
      { name: "Antalya", timezone: "Europe/Istanbul", gmtOffset: "+03:00", dstOffset: null, airportCode: "AYT", latitude: 36.8969, longitude: 30.7133, population: 2619000 },
      { name: "Izmir", timezone: "Europe/Istanbul", gmtOffset: "+03:00", dstOffset: null, airportCode: "ADB", latitude: 38.4192, longitude: 27.1287, population: 3056000 },
    ]},
    // South Africa: Durban, Pretoria
    { name: "South Africa", code: "ZA", flag: "🇿🇦", capital: "Pretoria", continent: "Africa", population: 59390000, timezoneCount: 1, displayOrder: 23, cities: [
      { name: "Durban", timezone: "Africa/Johannesburg", gmtOffset: "+02:00", dstOffset: null, airportCode: "DUR", latitude: -29.8587, longitude: 31.0218, population: 3720000 },
      { name: "Pretoria", timezone: "Africa/Johannesburg", gmtOffset: "+02:00", dstOffset: null, airportCode: "PRY", latitude: -25.7479, longitude: 28.2293, population: 2740000 },
    ]},
    // Nigeria: Abuja
    { name: "Nigeria", code: "NG", flag: "🇳🇬", capital: "Abuja", continent: "Africa", population: 211400000, timezoneCount: 1, displayOrder: 49, cities: [
      { name: "Abuja", timezone: "Africa/Lagos", gmtOffset: "+01:00", dstOffset: null, airportCode: "ABV", latitude: 9.0765, longitude: 7.3986, population: 3695000 },
    ]},
    // South Korea: Busan
    { name: "South Korea", code: "KR", flag: "🇰🇷", capital: "Seoul", continent: "Asia", population: 51780000, timezoneCount: 1, displayOrder: 14, cities: [
      { name: "Busan", timezone: "Asia/Seoul", gmtOffset: "+09:00", dstOffset: null, airportCode: "PUS", latitude: 35.1796, longitude: 129.0756, population: 3411000 },
      { name: "Incheon", timezone: "Asia/Seoul", gmtOffset: "+09:00", dstOffset: null, airportCode: "ICN", latitude: 37.4563, longitude: 126.7052, population: 2923000 },
    ]},
    // UK: Birmingham, Glasgow
    { name: "United Kingdom", code: "GB", flag: "🇬🇧", capital: "London", continent: "Europe", population: 67330000, timezoneCount: 1, displayOrder: 2, cities: [
      { name: "Birmingham", timezone: "Europe/London", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "BHX", latitude: 52.4862, longitude: -1.8904, population: 1141000 },
      { name: "Glasgow", timezone: "Europe/London", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "GLA", latitude: 55.8642, longitude: -4.2518, population: 631000 },
      { name: "Liverpool", timezone: "Europe/London", gmtOffset: "+00:00", dstOffset: "+01:00", airportCode: "LPL", latitude: 53.4084, longitude: -2.9916, population: 864000 },
    ]},
    // France: Lyon, Marseille
    { name: "France", code: "FR", flag: "🇫🇷", capital: "Paris", continent: "Europe", population: 67750000, timezoneCount: 1, displayOrder: 7, cities: [
      { name: "Lyon", timezone: "Europe/Paris", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "LYS", latitude: 45.764, longitude: 4.8357, population: 1706000 },
      { name: "Marseille", timezone: "Europe/Paris", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "MRS", latitude: 43.2965, longitude: 5.3698, population: 1616000 },
      { name: "Nice", timezone: "Europe/Paris", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "NCE", latitude: 43.7102, longitude: 7.262, population: 343000 },
    ]},
    // UAE: Abu Dhabi
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", capital: "Abu Dhabi", continent: "Asia", population: 9890000, timezoneCount: 1, displayOrder: 12, cities: [
      { name: "Abu Dhabi", timezone: "Asia/Dubai", gmtOffset: "+04:00", dstOffset: null, airportCode: "AUH", latitude: 24.4539, longitude: 54.3773, population: 1512000 },
    ]},
    // Saudi Arabia: Mecca, Medina
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", capital: "Riyadh", continent: "Asia", population: 35000000, timezoneCount: 1, displayOrder: 41, cities: [
      { name: "Mecca", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "JED", latitude: 21.3891, longitude: 39.8579, population: 2042000 },
      { name: "Medina", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "MED", latitude: 24.5247, longitude: 39.5692, population: 1488000 },
    ]},
    // Indonesia: Surabaya, Bandung
    { name: "Indonesia", code: "ID", flag: "🇮🇩", capital: "Jakarta", continent: "Asia", population: 273800000, timezoneCount: 3, displayOrder: 43, cities: [
      { name: "Surabaya", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "SUB", latitude: -7.2575, longitude: 112.7521, population: 2972000 },
      { name: "Bandung", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "BDO", latitude: -6.9175, longitude: 107.6191, population: 2575000 },
    ]},
    // Switzerland: Basel, Bern
    { name: "Switzerland", code: "CH", flag: "🇨🇭", capital: "Bern", continent: "Europe", population: 8703000, timezoneCount: 1, displayOrder: 19, cities: [
      { name: "Basel", timezone: "Europe/Zurich", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BSL", latitude: 47.5596, longitude: 7.5886, population: 177000 },
      { name: "Bern", timezone: "Europe/Zurich", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "BRN", latitude: 46.948, longitude: 7.4474, population: 133000 },
    ]},
    // Egypt: Alexandria
    { name: "Egypt", code: "EG", flag: "🇪🇬", capital: "Cairo", continent: "Africa", population: 104300000, timezoneCount: 1, displayOrder: 26, cities: [
      { name: "Alexandria", timezone: "Africa/Cairo", gmtOffset: "+02:00", dstOffset: "+03:00", airportCode: "HBE", latitude: 31.2001, longitude: 29.9187, population: 5200000 },
    ]},
    // Pakistan: Lahore, Islamabad
    { name: "Pakistan", code: "PK", flag: "🇵🇰", capital: "Islamabad", continent: "Asia", population: 225200000, timezoneCount: 1, displayOrder: 47, cities: [
      { name: "Lahore", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "LHE", latitude: 31.5204, longitude: 74.3587, population: 13188000 },
      { name: "Islamabad", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "ISB", latitude: 33.6844, longitude: 73.0479, population: 1232000 },
    ]},
    // Bangladesh: Chittagong
    { name: "Bangladesh", code: "BD", flag: "🇧🇩", capital: "Dhaka", continent: "Asia", population: 166300000, timezoneCount: 1, displayOrder: 48, cities: [
      { name: "Chittagong", timezone: "Asia/Dhaka", gmtOffset: "+06:00", dstOffset: null, airportCode: "CGP", latitude: 22.3569, longitude: 91.7832, population: 4847000 },
    ]},
    // Argentina: Córdoba, Mendoza
    { name: "Argentina", code: "AR", flag: "🇦🇷", capital: "Buenos Aires", continent: "South America", population: 45810000, timezoneCount: 1, displayOrder: 27, cities: [
      { name: "Córdoba", timezone: "America/Argentina/Cordoba", gmtOffset: "-03:00", dstOffset: null, airportCode: "COR", latitude: -31.4201, longitude: -64.1888, population: 1550000 },
      { name: "Mendoza", timezone: "America/Argentina/Mendoza", gmtOffset: "-03:00", dstOffset: null, airportCode: "MDZ", latitude: -32.8895, longitude: -68.8458, population: 1150000 },
    ]},
    // Thailand: Chiang Mai, Phuket
    { name: "Thailand", code: "TH", flag: "🇹🇭", capital: "Bangkok", continent: "Asia", population: 71600000, timezoneCount: 1, displayOrder: 25, cities: [
      { name: "Chiang Mai", timezone: "Asia/Bangkok", gmtOffset: "+07:00", dstOffset: null, airportCode: "CNX", latitude: 18.7883, longitude: 98.9853, population: 127000 },
      { name: "Phuket", timezone: "Asia/Bangkok", gmtOffset: "+07:00", dstOffset: null, airportCode: "HKT", latitude: 7.8804, longitude: 98.3923, population: 79200 },
    ]},
    // Vietnam: Da Nang
    { name: "Vietnam", code: "VN", flag: "🇻🇳", capital: "Hanoi", continent: "Asia", population: 97470000, timezoneCount: 1, displayOrder: 45, cities: [
      { name: "Da Nang", timezone: "Asia/Ho_Chi_Minh", gmtOffset: "+07:00", dstOffset: null, airportCode: "DAD", latitude: 16.0544, longitude: 108.2022, population: 1138000 },
    ]},
    // Philippines: Cebu, Davao
    { name: "Philippines", code: "PH", flag: "🇵🇭", capital: "Manila", continent: "Asia", population: 109600000, timezoneCount: 1, displayOrder: 46, cities: [
      { name: "Cebu City", timezone: "Asia/Manila", gmtOffset: "+08:00", dstOffset: null, airportCode: "CEB", latitude: 10.3157, longitude: 123.8854, population: 964000 },
      { name: "Davao", timezone: "Asia/Manila", gmtOffset: "+08:00", dstOffset: null, airportCode: "DVO", latitude: 7.1907, longitude: 125.4553, population: 1776000 },
    ]},
    // Netherlands: Rotterdam, The Hague
    { name: "Netherlands", code: "NL", flag: "🇳🇱", capital: "Amsterdam", continent: "Europe", population: 17530000, timezoneCount: 1, displayOrder: 18, cities: [
      { name: "Rotterdam", timezone: "Europe/Amsterdam", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "RTM", latitude: 51.9229, longitude: 4.4632, population: 651000 },
      { name: "The Hague", timezone: "Europe/Amsterdam", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: null, latitude: 52.0705, longitude: 4.3007, population: 545000 },
    ]},
    // ========== MORE INDIA CITIES ==========
    { name: "India", code: "IN", flag: "🇮🇳", capital: "New Delhi", continent: "Asia", population: 1408000000, timezoneCount: 1, displayOrder: 3, cities: [
      { name: "Surat", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "STV", latitude: 21.1702, longitude: 72.8311, population: 6961000 },
      { name: "Lucknow", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "LKO", latitude: 26.8467, longitude: 80.9462, population: 3584000 },
      { name: "Kanpur", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "KNU", latitude: 26.4499, longitude: 80.3319, population: 3162000 },
      { name: "Nagpur", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "NAG", latitude: 21.1458, longitude: 79.0882, population: 2894000 },
      { name: "Indore", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "IDR", latitude: 22.7196, longitude: 75.8577, population: 2758000 },
      { name: "Patna", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "PAT", latitude: 25.5941, longitude: 85.1376, population: 2437000 },
      { name: "Bhopal", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "BHO", latitude: 23.2599, longitude: 77.4126, population: 2266000 },
      { name: "Vadodara", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "BDQ", latitude: 22.3072, longitude: 73.1812, population: 2167000 },
      { name: "Ludhiana", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "LUH", latitude: 30.901, longitude: 75.8573, population: 1897000 },
      { name: "Agra", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "AGR", latitude: 27.1767, longitude: 78.0081, population: 1775000 },
      { name: "Nashik", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "ISK", latitude: 19.9975, longitude: 73.7898, population: 1686000 },
      { name: "Coimbatore", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "CJB", latitude: 11.0168, longitude: 76.9558, population: 1601000 },
      { name: "Kochi", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "COK", latitude: 9.9312, longitude: 76.2673, population: 2120000 },
      { name: "Chandigarh", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "IXC", latitude: 30.7333, longitude: 76.7794, population: 1185000 },
      { name: "Varanasi", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "VNS", latitude: 25.3176, longitude: 83.0066, population: 1432000 },
      { name: "Guwahati", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "GAU", latitude: 26.1445, longitude: 91.7362, population: 1116000 },
      { name: "Visakhapatnam", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "VTZ", latitude: 17.6868, longitude: 83.2185, population: 2168000 },
      { name: "Thiruvananthapuram", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "TRV", latitude: 8.5241, longitude: 76.9366, population: 1687000 },
      { name: "Ranchi", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "IXR", latitude: 23.3441, longitude: 85.3096, population: 1310000 },
      { name: "Dehradun", timezone: "Asia/Kolkata", gmtOffset: "+05:30", dstOffset: null, airportCode: "DED", latitude: 30.3165, longitude: 78.0322, population: 917000 },
    ]},
    // ========== MORE MALAYSIA CITIES ==========
    { name: "Malaysia", code: "MY", flag: "🇲🇾", capital: "Kuala Lumpur", continent: "Asia", population: 32780000, timezoneCount: 1, displayOrder: 44, cities: [
      { name: "Penang", timezone: "Asia/Kuala_Lumpur", gmtOffset: "+08:00", dstOffset: null, airportCode: "PEN", latitude: 5.4141, longitude: 100.3288, population: 907000 },
      { name: "Johor Bahru", timezone: "Asia/Kuala_Lumpur", gmtOffset: "+08:00", dstOffset: null, airportCode: "JHB", latitude: 1.4927, longitude: 103.7414, population: 958000 },
      { name: "Kota Kinabalu", timezone: "Asia/Kuching", gmtOffset: "+08:00", dstOffset: null, airportCode: "BKI", latitude: 5.9804, longitude: 116.0735, population: 452000 },
      { name: "Kuching", timezone: "Asia/Kuching", gmtOffset: "+08:00", dstOffset: null, airportCode: "KCH", latitude: 1.5535, longitude: 110.3593, population: 570000 },
      { name: "Ipoh", timezone: "Asia/Kuala_Lumpur", gmtOffset: "+08:00", dstOffset: null, airportCode: "IPH", latitude: 4.5975, longitude: 101.0901, population: 840000 },
      { name: "Malacca", timezone: "Asia/Kuala_Lumpur", gmtOffset: "+08:00", dstOffset: null, airportCode: "MKZ", latitude: 2.1896, longitude: 102.2501, population: 579000 },
      { name: "Putrajaya", timezone: "Asia/Kuala_Lumpur", gmtOffset: "+08:00", dstOffset: null, airportCode: null, latitude: 2.9264, longitude: 101.6964, population: 109000 },
    ]},
    // ========== MORE INDONESIA CITIES ==========
    { name: "Indonesia", code: "ID", flag: "🇮🇩", capital: "Jakarta", continent: "Asia", population: 273800000, timezoneCount: 3, displayOrder: 43, cities: [
      { name: "Medan", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "KNO", latitude: 3.5952, longitude: 98.6722, population: 2274000 },
      { name: "Semarang", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "SRG", latitude: -6.9932, longitude: 110.4203, population: 1672000 },
      { name: "Makassar", timezone: "Asia/Makassar", gmtOffset: "+08:00", dstOffset: null, airportCode: "UPG", latitude: -5.1477, longitude: 119.4327, population: 1472000 },
      { name: "Batam", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "BTH", latitude: 1.1301, longitude: 104.0527, population: 1391000 },
      { name: "Yogyakarta", timezone: "Asia/Jakarta", gmtOffset: "+07:00", dstOffset: null, airportCode: "YIA", latitude: -7.7956, longitude: 110.3695, population: 422000 },
    ]},
    // ========== MORE SINGAPORE DISTRICTS (city-state) ==========
    // Singapore is a city-state; the main entry covers it fully.
    // ========== MORE SRI LANKA CITIES ==========
    { name: "Sri Lanka", code: "LK", flag: "🇱🇰", capital: "Colombo", continent: "Asia", population: 21920000, timezoneCount: 1, displayOrder: 73, cities: [
      { name: "Kandy", timezone: "Asia/Colombo", gmtOffset: "+05:30", dstOffset: null, airportCode: null, latitude: 7.2906, longitude: 80.6337, population: 125000 },
      { name: "Galle", timezone: "Asia/Colombo", gmtOffset: "+05:30", dstOffset: null, airportCode: null, latitude: 6.0535, longitude: 80.221, population: 99000 },
      { name: "Jaffna", timezone: "Asia/Colombo", gmtOffset: "+05:30", dstOffset: null, airportCode: "JAF", latitude: 9.6615, longitude: 80.0255, population: 88000 },
    ]},
    // ========== MORE UAE CITIES ==========
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", capital: "Abu Dhabi", continent: "Asia", population: 9890000, timezoneCount: 1, displayOrder: 12, cities: [
      { name: "Sharjah", timezone: "Asia/Dubai", gmtOffset: "+04:00", dstOffset: null, airportCode: "SHJ", latitude: 25.3463, longitude: 55.4209, population: 1685000 },
      { name: "Ajman", timezone: "Asia/Dubai", gmtOffset: "+04:00", dstOffset: null, airportCode: null, latitude: 25.4052, longitude: 55.5136, population: 504000 },
    ]},
    // ========== MORE PAKISTAN CITIES ==========
    { name: "Pakistan", code: "PK", flag: "🇵🇰", capital: "Islamabad", continent: "Asia", population: 225200000, timezoneCount: 1, displayOrder: 47, cities: [
      { name: "Faisalabad", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "LYP", latitude: 31.4504, longitude: 73.135, population: 3674000 },
      { name: "Rawalpindi", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "RWP", latitude: 33.5651, longitude: 73.0169, population: 2402000 },
      { name: "Multan", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "MUX", latitude: 30.1575, longitude: 71.5249, population: 2051000 },
      { name: "Peshawar", timezone: "Asia/Karachi", gmtOffset: "+05:00", dstOffset: null, airportCode: "PEW", latitude: 34.0151, longitude: 71.5249, population: 2112000 },
    ]},
    // ========== MORE NEPAL CITIES ==========
    { name: "Nepal", code: "NP", flag: "🇳🇵", capital: "Kathmandu", continent: "Asia", population: 29140000, timezoneCount: 1, displayOrder: 72, cities: [
      { name: "Pokhara", timezone: "Asia/Kathmandu", gmtOffset: "+05:45", dstOffset: null, airportCode: "PKR", latitude: 28.2096, longitude: 83.9856, population: 200000 },
    ]},
    // ========== MORE BANGLADESH CITIES ==========
    { name: "Bangladesh", code: "BD", flag: "🇧🇩", capital: "Dhaka", continent: "Asia", population: 166300000, timezoneCount: 1, displayOrder: 48, cities: [
      { name: "Sylhet", timezone: "Asia/Dhaka", gmtOffset: "+06:00", dstOffset: null, airportCode: "ZYL", latitude: 24.8949, longitude: 91.8687, population: 964000 },
      { name: "Khulna", timezone: "Asia/Dhaka", gmtOffset: "+06:00", dstOffset: null, airportCode: null, latitude: 22.8456, longitude: 89.5403, population: 931000 },
      { name: "Rajshahi", timezone: "Asia/Dhaka", gmtOffset: "+06:00", dstOffset: null, airportCode: "RJH", latitude: 24.374, longitude: 88.6011, population: 875000 },
    ]},
    // ========== MORE THAILAND CITIES ==========
    { name: "Thailand", code: "TH", flag: "🇹🇭", capital: "Bangkok", continent: "Asia", population: 71600000, timezoneCount: 1, displayOrder: 25, cities: [
      { name: "Pattaya", timezone: "Asia/Bangkok", gmtOffset: "+07:00", dstOffset: null, airportCode: "UTP", latitude: 12.9236, longitude: 100.8825, population: 119000 },
      { name: "Krabi", timezone: "Asia/Bangkok", gmtOffset: "+07:00", dstOffset: null, airportCode: "KBV", latitude: 8.0863, longitude: 98.9063, population: 32000 },
    ]},
    // ========== MORE PHILIPPINES CITIES ==========
    { name: "Philippines", code: "PH", flag: "🇵🇭", capital: "Manila", continent: "Asia", population: 109600000, timezoneCount: 1, displayOrder: 46, cities: [
      { name: "Quezon City", timezone: "Asia/Manila", gmtOffset: "+08:00", dstOffset: null, airportCode: "MNL", latitude: 14.676, longitude: 121.0437, population: 2960000 },
      { name: "Makati", timezone: "Asia/Manila", gmtOffset: "+08:00", dstOffset: null, airportCode: "MNL", latitude: 14.5547, longitude: 121.0244, population: 582000 },
      { name: "Baguio", timezone: "Asia/Manila", gmtOffset: "+08:00", dstOffset: null, airportCode: null, latitude: 16.4023, longitude: 120.596, population: 366000 },
    ]},
    // ========== MORE VIETNAM CITIES ==========
    { name: "Vietnam", code: "VN", flag: "🇻🇳", capital: "Hanoi", continent: "Asia", population: 97470000, timezoneCount: 1, displayOrder: 45, cities: [
      { name: "Hai Phong", timezone: "Asia/Ho_Chi_Minh", gmtOffset: "+07:00", dstOffset: null, airportCode: "HPH", latitude: 20.8449, longitude: 106.6881, population: 2103000 },
      { name: "Nha Trang", timezone: "Asia/Ho_Chi_Minh", gmtOffset: "+07:00", dstOffset: null, airportCode: "CXR", latitude: 12.2388, longitude: 109.1967, population: 535000 },
    ]},
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

  // ==================== BLOG CATEGORIES & POSTS ====================
  console.log("📝 Seeding blog posts...");

  // Categories
  const blogCategories = [
    { name: "Remote Work", slug: "remote-work", description: "Tips and strategies for managing distributed teams across time zones" },
    { name: "Timezone Guides", slug: "timezone-guides", description: "Comprehensive guides to understanding time zones, DST, and global time" },
    { name: "Productivity", slug: "productivity", description: "How to stay productive when working across multiple time zones" },
    { name: "Travel Tips", slug: "travel-tips", description: "Timezone tips for travelers and digital nomads" },
    { name: "Developer Tools", slug: "developer-tools", description: "Timezone APIs, libraries, and tools for developers" },
    { name: "Business", slug: "business", description: "Timezone strategies for global business operations" },
  ];

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }
  console.log(`✅ ${blogCategories.length} blog categories created`);

  const blogPosts = [
    // ===== TIMEZONE GUIDES =====
    {
      slug: "best-time-to-schedule-meetings-india-us",
      categorySlug: "timezone-guides",
      title: "Best Time to Schedule Meetings Between India and the US (IST to EST/PST)",
      excerpt: "Finding overlapping working hours between India (IST) and the United States (EST/PST) is one of the biggest challenges for remote teams. Here's the definitive guide.",
      tags: ["India", "USA", "IST", "EST", "PST", "meeting scheduling", "remote work"],
      seoTitle: "Best Time for India-US Meetings: IST to EST/PST Guide | ClockHive",
      seoDescription: "Learn the best overlapping hours for scheduling meetings between India (IST) and the US (EST, CST, MST, PST). Complete guide with time zone charts.",
      content: `<h2>The India-US Time Zone Challenge</h2>
<p>India operates on a single time zone — <strong>IST (UTC+5:30)</strong>. The United States spans <strong>four main time zones</strong>: Eastern (EST/UTC-5), Central (CST/UTC-6), Mountain (MST/UTC-7), and Pacific (PST/UTC-8).</p>
<p>This creates a <strong>10.5 to 13.5 hour difference</strong>, making it notoriously difficult to find overlapping working hours.</p>

<h3>Best Meeting Windows (India ↔ US)</h3>
<table>
<tr><th>US Time Zone</th><th>Best Window for India</th><th>Best Window for US</th><th>Overlap Quality</th></tr>
<tr><td>Eastern (EST)</td><td>7:00 PM – 10:30 PM IST</td><td>8:30 AM – 12:00 PM EST</td><td>⭐⭐⭐ Good</td></tr>
<tr><td>Central (CST)</td><td>7:30 PM – 11:00 PM IST</td><td>8:00 AM – 11:30 AM CST</td><td>⭐⭐⭐ Good</td></tr>
<tr><td>Mountain (MST)</td><td>8:00 PM – 11:30 PM IST</td><td>7:30 AM – 11:00 AM MST</td><td>⭐⭐ Fair</td></tr>
<tr><td>Pacific (PST)</td><td>8:30 PM – 12:00 AM IST</td><td>7:00 AM – 10:30 AM PST</td><td>⭐ Tough</td></tr>
</table>

<h3>Pro Tips for India-US Teams</h3>
<ul>
<li><strong>Rotate meeting times</strong> — Don't always make one team sacrifice their evening or early morning.</li>
<li><strong>Record meetings</strong> — The team member who can't attend live can watch later.</li>
<li><strong>Use async communication</strong> — Loom videos, detailed Slack/Teams updates reduce meeting dependency.</li>
<li><strong>Tuesday-Thursday sweet spot</strong> — Avoid Mondays (US team catching up) and Fridays (India team winding down).</li>
</ul>`,
    },
    {
      slug: "understanding-daylight-saving-time-dst",
      categorySlug: "timezone-guides",
      title: "Understanding Daylight Saving Time (DST): When, Why, and How It Affects You",
      excerpt: "Daylight Saving Time affects over 70 countries. Learn when clocks change, why DST exists, and how to avoid scheduling disasters.",
      tags: ["DST", "daylight saving", "time change", "summer time", "clock change"],
      seoTitle: "Daylight Saving Time (DST) Explained: Dates, History & Impact | ClockHive",
      seoDescription: "Complete guide to Daylight Saving Time. Learn when clocks spring forward and fall back, which countries observe DST, and how to handle time changes.",
      content: `<h2>What Is Daylight Saving Time?</h2>
<p>Daylight Saving Time (DST) is the practice of advancing clocks by one hour during summer months to extend evening daylight. Over <strong>70 countries</strong> observe DST, affecting more than <strong>1 billion people</strong>.</p>

<h3>DST Dates by Region (2026)</h3>
<table>
<tr><th>Region</th><th>Spring Forward</th><th>Fall Back</th></tr>
<tr><td>United States & Canada</td><td>March 8, 2026</td><td>November 1, 2026</td></tr>
<tr><td>United Kingdom & EU</td><td>March 29, 2026</td><td>October 25, 2026</td></tr>
<tr><td>Australia (AEDT)</td><td>October 4, 2026</td><td>April 5, 2026</td></tr>
<tr><td>New Zealand</td><td>September 27, 2026</td><td>April 5, 2026</td></tr>
<tr><td>Chile</td><td>September 6, 2026</td><td>April 5, 2026</td></tr>
</table>

<h3>Countries That DON'T Observe DST</h3>
<p>Most countries near the equator don't need DST since daylight hours are consistent year-round. Major countries without DST include:</p>
<ul>
<li><strong>India</strong> — Single timezone, no DST</li>
<li><strong>China</strong> — Single timezone (CST), no DST</li>
<li><strong>Japan</strong> — No DST since 1952</li>
<li><strong>Singapore, Malaysia, Indonesia</strong> — Near equator</li>
<li><strong>Most of Africa and South America</strong></li>
</ul>

<h3>How DST Breaks Meeting Schedules</h3>
<p>When the US "springs forward" but Europe hasn't yet, meetings that worked last week are suddenly off by an hour. <strong>Always check DST transition dates</strong> when scheduling recurring international meetings.</p>`,
    },
    {
      slug: "why-time-zones-are-confusing",
      categorySlug: "timezone-guides",
      title: "Why Time Zones Are Confusing (And How to Finally Get Them Right)",
      excerpt: "From 30-minute offsets to countries ignoring their own zones — time zones are full of surprises. Here's why they're so confusing.",
      tags: ["timezone basics", "UTC", "GMT", "timezone offset", "world time"],
      seoTitle: "Why Time Zones Are So Confusing: UTC, GMT, Offsets Explained | ClockHive",
      seoDescription: "Time zones are confusing for good reason. Learn about UTC vs GMT, weird offsets, and why China has one time zone but spans five.",
      content: `<h2>The World Has 38 Time Zones (Not 24)</h2>
<p>If you think there are 24 time zones (one for each hour), you'd be wrong. There are actually <strong>38 time zones</strong> because many countries use <strong>30-minute or 45-minute offsets</strong>.</p>

<h3>Weird Time Zone Offsets</h3>
<ul>
<li><strong>India: UTC+5:30</strong> — A single 30-minute offset for the entire country</li>
<li><strong>Nepal: UTC+5:45</strong> — The world's only 45-minute offset</li>
<li><strong>Iran: UTC+3:30</strong> — With DST, it becomes UTC+4:30</li>
<li><strong>Myanmar: UTC+6:30</strong> — Another 30-minute offset</li>
<li><strong>Newfoundland (Canada): UTC-3:30</strong> — Yes, Canada has a half-hour zone too</li>
</ul>

<h3>UTC vs GMT: What's the Difference?</h3>
<p><strong>GMT</strong> (Greenwich Mean Time) is a time zone. <strong>UTC</strong> (Coordinated Universal Time) is a time standard. They happen to show the same time, but UTC is the scientific standard used worldwide.</p>

<h3>China: One Country, One Time Zone (But Should Be Five)</h3>
<p>China spans roughly <strong>five geographic time zones</strong> but uses a single zone — <strong>China Standard Time (UTC+8)</strong>. In western China (Xinjiang), the sun rises at 10 AM in winter!</p>

<h3>How to Never Get Time Zones Wrong</h3>
<ol>
<li><strong>Always use IANA timezone names</strong> (e.g., "America/New_York", not "EST") — they include DST rules automatically.</li>
<li><strong>Store times in UTC</strong> and convert to local time for display.</li>
<li><strong>Use a reliable timezone tool</strong> — ClockHive handles all the complexity for you.</li>
</ol>`,
    },
    // ===== REMOTE WORK =====
    {
      slug: "managing-remote-teams-across-time-zones",
      categorySlug: "remote-work",
      title: "Managing Remote Teams Across Time Zones: The Complete Playbook",
      excerpt: "Leading a distributed team across multiple time zones? Here's how the best remote managers keep their teams aligned and productive.",
      tags: ["remote work", "team management", "async communication", "distributed teams", "global teams"],
      seoTitle: "How to Manage Remote Teams Across Time Zones | ClockHive",
      seoDescription: "Complete guide to managing distributed teams across time zones. Async communication, meeting strategies, and tools for remote team success.",
      content: `<h2>The Rise of Async-First Teams</h2>
<p>The most successful distributed companies — GitLab, Buffer, Zapier — operate <strong>async-first</strong>. This means they default to written communication and minimize synchronous meetings.</p>

<h3>Core Principles</h3>
<ol>
<li><strong>Document everything</strong> — If it's not written down, it didn't happen.</li>
<li><strong>Default to async</strong> — Before scheduling a meeting, ask: "Can this be a document?"</li>
<li><strong>Overlapping hours are sacred</strong> — Protect the 2-4 hours of overlap for collaboration.</li>
<li><strong>Record all meetings</strong> — Team members in different time zones can watch later.</li>
</ol>

<h3>Tools for Async Communication</h3>
<ul>
<li><strong>Slack/Teams</strong> — For quick questions and updates (set Do Not Disturb hours!)</li>
<li><strong>Notion/Confluence</strong> — For long-form documentation and project plans</li>
<li><strong>Loom</strong> — For async video updates instead of status meetings</li>
<li><strong>ClockHive</strong> — For checking team members' local times before messaging</li>
</ul>`,
    },
    {
      slug: "global-team-meeting-scheduling-guide",
      categorySlug: "remote-work",
      title: "How to Schedule Meetings That Work for Every Time Zone",
      excerpt: "Stop playing email ping-pong to find a meeting time. Use this proven framework to schedule across time zones in one try.",
      tags: ["meeting scheduling", "calendar", "timezone converter", "world clock", "global teams"],
      seoTitle: "How to Schedule Meetings Across Time Zones | ClockHive",
      seoDescription: "Stop the back-and-forth. Learn the 3-step framework for scheduling meetings that work for teams in any time zone.",
      content: `<h2>The 3-Step Meeting Scheduling Framework</h2>

<h3>Step 1: Find Overlapping Working Hours</h3>
<p>Use ClockHive's <strong>Meeting Planner</strong> to add all team locations. The visual timeline shows exactly when everyone is available at a glance.</p>

<h3>Step 2: Use the "Least Pain" Principle</h3>
<p>Rotate the inconvenient time slots. If this meeting is early for the US team, make the next one early for the Asia team. Keep a rotation schedule.</p>

<h3>Step 3: Share a Comparison Link</h3>
<p>Don't just send a time — send a <strong>ClockHive compare link</strong> so everyone sees the meeting time in their local zone. No more "wait, is that 2 PM my time or yours?"</p>

<h3>Meeting Cadence by Time Zone Spread</h3>
<table>
<tr><th>Time Zone Spread</th><th>Meeting Cadence</th><th>Strategy</th></tr>
<tr><td>1-3 hours</td><td>Daily standups</td><td>Easy overlap — schedule anytime</td></tr>
<tr><td>4-6 hours</td><td>2-3x per week</td><td>Plan around core overlap hours</td></tr>
<tr><td>7-9 hours</td><td>1-2x per week</td><td>Rotate times, record everything</td></tr>
<tr><td>10-12+ hours</td><td>Weekly or biweekly</td><td>Primarily async with occasional sync</td></tr>
</table>`,
    },
    {
      slug: "timezone-etiquette-remote-work",
      categorySlug: "remote-work",
      title: "Timezone Etiquette: 10 Rules Every Remote Worker Should Follow",
      excerpt: "Good timezone manners make remote teams happier. Here are 10 etiquette rules that every distributed team member should know.",
      tags: ["etiquette", "remote work", "communication", "work culture"],
      seoTitle: "Timezone Etiquette: 10 Rules for Remote Workers | ClockHive",
      seoDescription: "Master timezone etiquette with these 10 essential rules. From scheduling messages to respecting weekends, be a better remote teammate.",
      content: `<h2>10 Timezone Etiquette Rules</h2>
<ol>
<li><strong>Check their local time before messaging</strong> — Don't Slack someone at 2 AM their time unless it's truly urgent.</li>
<li><strong>Schedule messages for their morning</strong> — Use Slack's scheduled send feature.</li>
<li><strong>Always include timezone in meeting invites</strong> — Say "2 PM EST / 11 AM PST / 7 PM GMT".</li>
<li><strong>Rotate meeting times</strong> — Don't always make one timezone suffer.</li>
<li><strong>Respect weekends and holidays</strong> — Different countries = different weekends and public holidays.</li>
<li><strong>Set your working hours in your calendar</strong> — Let tools auto-detect your availability.</li>
<li><strong>Use a shared world clock</strong> — ClockHive on your team's dashboard.</li>
<li><strong>Be explicit about deadlines</strong> — "Friday EOD" means different things in different zones.</li>
<li><strong>Don't apologize for your time zone</strong> — "Sorry for the early/late reply" shouldn't be needed in async teams.</li>
<li><strong>Assume good intent</strong> — A delayed response usually means they're sleeping, not ignoring you.</li>
</ol>`,
    },
    // ===== TRAVEL TIPS =====
    {
      slug: "surviving-jet-lag-science-backed-tips",
      categorySlug: "travel-tips",
      title: "How to Beat Jet Lag: Science-Backed Tips for Long-Haul Travelers",
      excerpt: "Jet lag can ruin the first 2-3 days of any trip. Use these research-backed strategies to adjust faster to new time zones.",
      tags: ["jet lag", "travel", "circadian rhythm", "sleep", "timezone adjustment"],
      seoTitle: "How to Beat Jet Lag: 12 Science-Backed Tips | ClockHive",
      seoDescription: "Beat jet lag fast with these 12 science-backed strategies. Learn how light exposure, meal timing, and melatonin help you adjust to new time zones.",
      content: `<h2>Why Jet Lag Happens</h2>
<p>Your body's internal clock (circadian rhythm) can only adjust about <strong>1-1.5 hours per day</strong>. Flying from New York to Tokyo (13-hour difference) means you'll need about a week to fully adjust naturally.</p>

<h3>12 Science-Backed Jet Lag Tips</h3>
<ol>
<li><strong>Shift your schedule before you fly</strong> — Start adjusting bedtime 2-3 days before departure.</li>
<li><strong>Light exposure is your #1 tool</strong> — Morning light advances your clock, evening light delays it.</li>
<li><strong>Melatonin (0.5-3mg)</strong> — Take it at your target bedtime at the destination, not during the flight.</li>
<li><strong>Hydrate aggressively</strong> — Dehydration worsens jet lag symptoms.</li>
<li><strong>Avoid alcohol and caffeine on the flight</strong> — Both disrupt sleep quality.</li>
<li><strong>Eat on the destination schedule</strong> — Even if you're not hungry, eat meals at local times.</li>
<li><strong>Exercise in the morning</strong> — A morning run or walk helps reset your internal clock.</li>
<li><strong>Don't nap more than 20 minutes</strong> — Long naps confuse your body clock.</li>
<li><strong>Use the Timeshifter app</strong> — NASA-backed algorithm for personalized jet lag plans.</li>
<li><strong>Fly east? Seek morning light. Fly west? Seek evening light.</strong></li>
<li><strong>Book flights strategically</strong> — Arriving in the evening lets you go straight to sleep.</li>
<li><strong>Give yourself grace</strong> — It takes 1 day per time zone crossed to fully adjust.</li>
</ol>`,
    },
    {
      slug: "digital-nomad-timezone-strategy",
      categorySlug: "travel-tips",
      title: "Digital Nomad Timezone Strategy: How to Work From Anywhere",
      excerpt: "Working as a digital nomad means constantly changing time zones. Here's how to stay productive while traveling the world.",
      tags: ["digital nomad", "travel", "remote work", "freelancing", "world clock"],
      seoTitle: "Digital Nomad Timezone Strategy Guide | ClockHive",
      seoDescription: "How digital nomads manage time zones while traveling. Tips for client communication, scheduling, and staying productive from anywhere.",
      content: `<h2>The Digital Nomad Timezone Challenge</h2>
<p>You're in Bali (UTC+8) but your client is in New York (UTC-5). That's a <strong>13-hour difference</strong>. Here's how to make it work.</p>

<h3>Choose Your Base Strategically</h3>
<ul>
<li><strong>Americas clients?</strong> — Work from Latin America (similar time zones).</li>
<li><strong>European clients?</strong> — Work from Europe, Africa, or the Middle East.</li>
<li><strong>Asian/Australian clients?</strong> — Work from Southeast Asia or Oceania.</li>
<li><strong>Multiple time zones?</strong> — Pick a middle ground (e.g., Lisbon for US+EU overlap).</li>
</ul>

<h3>Best Nomad Hubs by Timezone Overlap</h3>
<table>
<tr><th>Your Clients</th><th>Best Nomad Base</th><th>Why</th></tr>
<tr><td>US East Coast</td><td>Mexico City, Medellín, Buenos Aires</td><td>0-2 hour difference</td></tr>
<tr><td>US West Coast</td><td>Bali, Thailand (work nights)</td><td>12-15 hour difference</td></tr>
<tr><td>Europe</td><td>Lisbon, Barcelona, Cape Town</td><td>0-2 hour difference</td></tr>
<tr><td>Mix of US + Europe</td><td>Lisbon, Canary Islands</td><td>4-5 hours from each</td></tr>
</table>`,
    },
    {
      slug: "timezone-pair-converter-guide",
      categorySlug: "timezone-guides",
      title: "How to Convert Between Any Two Time Zones Instantly",
      excerpt: "From EST to IST, PST to GMT, or CET to JST — learn the fastest ways to convert time between any two time zones.",
      tags: ["timezone converter", "EST to IST", "PST to GMT", "CET to JST", "UTC converter"],
      seoTitle: "Time Zone Converter: Convert Between Any Two Zones | ClockHive",
      seoDescription: "Convert time between any two time zones instantly. EST to IST, PST to GMT, CET to JST — free timezone converter with DST support.",
      content: `<h2>Common Timezone Conversions</h2>

<h3>EST to IST (Eastern US to India)</h3>
<p>EST is <strong>10.5 hours behind</strong> IST. When it's 9 AM EST, it's 7:30 PM IST. The best meeting window is 7-10 AM EST (5:30-8:30 PM IST).</p>

<h3>PST to GMT (Pacific US to UK)</h3>
<p>PST is <strong>8 hours behind</strong> GMT. A 9 AM PST meeting is 5 PM GMT — perfect for US-UK collaboration.</p>

<h3>CET to JST (Europe to Japan)</h3>
<p>CET is <strong>8 hours behind</strong> JST. Early morning CET (7-9 AM) overlaps with late afternoon JST (3-5 PM).</p>

<h3>AEST to EST (Australia to Eastern US)</h3>
<p>AEST is <strong>14 hours ahead</strong> of EST (during US winter). Evening AEST (6-9 PM) overlaps with early morning EST (4-7 AM) — tough for both sides.</p>

<p><strong>Pro tip:</strong> Use ClockHive's <a href="/converter">Time Converter</a> to convert between any two zones with automatic DST handling.</p>`,
    },
    // ===== PRODUCTIVITY =====
    {
      slug: "async-communication-vs-sync-meetings",
      categorySlug: "productivity",
      title: "Async vs Sync: When to Meet and When to Write It Down",
      excerpt: "Not everything needs a meeting. Learn when async communication is better and when you truly need to sync up in real time.",
      tags: ["async communication", "meetings", "productivity", "remote work"],
      seoTitle: "Async vs Sync Communication: When to Meet vs Write | ClockHive",
      seoDescription: "Should this be a meeting or a document? Decision framework for async vs sync communication in remote and distributed teams.",
      content: `<h2>The Async-First Decision Framework</h2>
<p>Before scheduling any meeting, run through these questions:</p>
<ol>
<li><strong>Is this sharing information?</strong> → Write a document.</li>
<li><strong>Is this gathering feedback?</strong> → Use async comments on the document.</li>
<li><strong>Is this brainstorming?</strong> → Start async (each person adds ideas), then a short sync to converge.</li>
<li><strong>Is this a difficult conversation?</strong> → Sync meeting. Don't have hard conversations over text.</li>
<li><strong>Is this team bonding?</strong> → Sync meeting. You can't build culture purely async.</li>
</ol>

<h3>When Async Wins</h3>
<ul>
<li>Status updates (replace standup meetings)</li>
<li>Project proposals and RFCs</li>
<li>Code reviews</li>
<li>Announcements</li>
<li>Documentation</li>
</ul>

<h3>When Sync Is Necessary</h3>
<ul>
<li>Performance reviews and 1:1s</li>
<li>Crisis/incident response</li>
<li>Complex decision-making with tradeoffs</li>
<li>Team social events</li>
<li>Onboarding new team members</li>
</ul>`,
    },
    {
      slug: "time-blocking-across-time-zones",
      categorySlug: "productivity",
      title: "Time Blocking Across Time Zones: A System for Global Teams",
      excerpt: "Time blocking is powerful, but it gets complicated when your team spans 5+ time zones. Here's a system that actually works.",
      tags: ["time blocking", "productivity", "deep work", "remote work", "calendar management"],
      seoTitle: "Time Blocking Across Time Zones: Complete System | ClockHive",
      seoDescription: "Master time blocking when your team spans multiple time zones. Coordinate deep work, meetings, and async collaboration across the globe.",
      content: `<h2>The Color-Coded Calendar System</h2>
<p>Use three color blocks that work across time zones:</p>
<ul>
<li><strong>🟢 Green (Flexible)</strong> — Deep work, can be moved. Block 3-4 hour chunks.</li>
<li><strong>🟡 Yellow (Core Overlap)</strong> — The 2-4 hours where most team members overlap. Reserve for collaboration.</li>
<li><strong>🔴 Red (Fixed)</strong> — Recurring meetings, appointments. Don't move these.</li>
</ul>

<h3>Finding Your Deep Work Window</h3>
<p>Your best deep work happens when:</p>
<ol>
<li>It's during your natural energy peak (morning person or night owl?)</li>
<li>Your collaborators are NOT overlapping (no Slack pings)</li>
<li>You have at least 90 uninterrupted minutes</li>
</ol>

<h3>Communicating Your Blocks to the Team</h3>
<p>Share your typical schedule with the team. Example for IST:</p>
<blockquote>Deep Work: 10 AM – 1 PM IST | Core Overlap: 6 PM – 9 PM IST (for US team) | Fixed Meetings: Fridays 8 PM IST</blockquote>`,
    },
    // ===== DEVELOPER TOOLS =====
    {
      slug: "timezone-api-comparison-2026",
      categorySlug: "developer-tools",
      title: "Timezone API Comparison 2026: Which One Should You Use?",
      excerpt: "Comparing the top timezone APIs for developers — features, pricing, accuracy, and ease of use. Find the right one for your project.",
      tags: ["API", "developers", "timezone API", "REST", "programming"],
      seoTitle: "Best Timezone API 2026: Comparison & Guide | ClockHive",
      seoDescription: "Compare the top timezone APIs for 2026. Pricing, features, accuracy, and developer experience for building timezone-aware applications.",
      content: `<h2>What to Look for in a Timezone API</h2>
<ul>
<li><strong>IANA timezone support</strong> — Must use standard timezone names (e.g., "America/New_York")</li>
<li><strong>DST handling</strong> — Automatic daylight saving transitions</li>
<li><strong>UTC offset calculation</strong> — Current offset including DST</li>
<li><strong>Geolocation</strong> — Convert lat/lng to timezone</li>
<li><strong>Rate limits & pricing</strong> — Free tier availability</li>
</ul>

<h3>Top Timezone APIs Compared</h3>
<table>
<tr><th>API</th><th>Free Tier</th><th>Best For</th><th>Notable Feature</th></tr>
<tr><td>Google Time Zone API</td><td>$200 monthly credit</td><td>Enterprise apps</td><td>Highest accuracy, Google Maps integration</td></tr>
<tr><td>TimeZoneDB</td><td>1 request/sec free</td><td>Simple projects</td><td>Simple REST API, CSV downloads</td></tr>
<tr><td>Abstract API</td><td>1,000 req/month free</td><td>Startups</td><td>Clean JSON responses</td></tr>
<tr><td>World Time API</td><td>Unlimited free</td><td>Hobby projects</td><td>Simple, no auth required</td></tr>
<tr><td>IPGeolocation Timezone</td><td>1,000 req/day free</td><td>IP-based lookup</td><td>Timezone from IP address</td></tr>
</table>

<h3>Pro Tip: Use moment-timezone or date-fns-tz</h3>
<p>If you just need client-side conversion, use JavaScript libraries like <code>date-fns-tz</code> or <code>luxon</code> instead of an API. They use the browser's IANA timezone database.</p>`,
    },
    {
      slug: "handling-timezones-javascript-react",
      categorySlug: "developer-tools",
      title: "Handling Time Zones in JavaScript and React: The Right Way",
      excerpt: "Time zones in JavaScript are painful. Learn the right patterns for displaying, converting, and storing times in React apps.",
      tags: ["JavaScript", "React", "date-fns", "luxon", "programming", "frontend"],
      seoTitle: "Handling Time Zones in JavaScript & React | ClockHive",
      seoDescription: "The definitive guide to handling time zones in JavaScript and React. Avoid common pitfalls with dates, DST, and formatting across time zones.",
      content: `<h2>The Golden Rules of Time Zones in JavaScript</h2>
<ol>
<li><strong>Store in UTC, display in local</strong> — All dates in your database should be UTC.</li>
<li><strong>Use IANA timezone names</strong> — "America/New_York", not "EST" (which is ambiguous with DST).</li>
<li><strong>Never use moment.js</strong> — It's deprecated. Use <code>date-fns-tz</code>, <code>luxon</code>, or <code>Intl.DateTimeFormat</code>.</li>
</ol>

<h3>Quick Examples</h3>

<pre><code>// ✅ Convert UTC to a specific timezone
import { utcToZonedTime, format } from 'date-fns-tz';

const utcDate = new Date('2026-08-04T12:00:00Z');
const tokyoTime = utcToZonedTime(utcDate, 'Asia/Tokyo');
console.log(format(tokyoTime, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Tokyo' }));
// → "2026-08-04 21:00:00"

// ✅ Display in user's local timezone (browser)
const localTime = new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
});
</code></pre>

<h3>Common Mistakes to Avoid</h3>
<ul>
<li>❌ <code>new Date('2026-08-04')</code> — parsed as UTC, displayed as local. Confusing!</li>
<li>❌ Hardcoding offsets like <code>+05:30</code> — doesn't account for DST changes.</li>
<li>❌ Comparing dates as strings — use timestamps (milliseconds) instead.</li>
<li>✅ Use <code>date-fns-tz</code> or <code>luxon</code> for all timezone operations.</li>
</ul>`,
    },
    // ===== BUSINESS =====
    {
      slug: "global-business-hours-timezone-strategy",
      categorySlug: "business",
      title: "How Global Companies Handle Customer Support Across Time Zones",
      excerpt: "From follow-the-sun support to regional hubs — how the world's best companies provide 24/7 service across every time zone.",
      tags: ["customer support", "business", "global operations", "24/7 support"],
      seoTitle: "Global Customer Support Timezone Strategy | ClockHive",
      seoDescription: "How global companies structure customer support across time zones. Follow-the-sun model, regional hubs, and tools for 24/7 coverage.",
      content: `<h2>The Follow-the-Sun Model</h2>
<p>The most common approach for 24/7 support: teams in different time zones hand off tickets as their workday ends. A ticket started in Sydney is picked up by London, then handed to New York.</p>

<h3>Follow-the-Sun Handoff Zones</h3>
<table>
<tr><th>Region</th><th>Coverage (UTC)</th><th>Hub Cities</th></tr>
<tr><td>APAC</td><td>22:00 – 07:00 UTC</td><td>Sydney, Tokyo, Singapore, Bangalore</td></tr>
<tr><td>EMEA</td><td>07:00 – 16:00 UTC</td><td>London, Dublin, Berlin, Dubai</td></tr>
<tr><td>Americas</td><td>13:00 – 01:00 UTC</td><td>New York, Austin, São Paulo, Toronto</td></tr>
</table>

<h3>Key Practices for 24/7 Support Teams</h3>
<ul>
<li><strong>Detailed handoff notes</strong> — Template: "What happened, what's pending, what's next"</li>
<li><strong>Shared knowledge base</strong> — Every solution documented so any team can resolve</li>
<li><strong>Overlap periods</strong> — 1-2 hours of overlap between regions for knowledge transfer</li>
<li><strong>Regional SLAs</strong> — Different response time targets for different regions</li>
</ul>`,
    },
    {
      slug: "timezone-mistakes-costing-businesses-money",
      categorySlug: "business",
      title: "5 Timezone Mistakes That Are Costing Your Business Money",
      excerpt: "Missed deadlines, double-booked meetings, confused clients — timezone mistakes have real costs. Here's how to fix them.",
      tags: ["business", "productivity", "mistakes", "ROI", "timezone management"],
      seoTitle: "5 Timezone Mistakes Costing Businesses Money | ClockHive",
      seoDescription: "Timezone errors cost businesses productivity, client trust, and revenue. Learn the 5 most common mistakes and how to fix them.",
      content: `<h2>5 Costly Timezone Mistakes</h2>

<h3>1. The "9 AM Meeting" Without a Time Zone</h3>
<p><strong>Cost:</strong> Confused attendees, no-shows, rescheduling emails back and forth.<br/>
<strong>Fix:</strong> Always include the timezone. Better yet, send a ClockHive compare link so everyone sees it in their local time.</p>

<h3>2. Deadline Ambiguity ("EOD Friday")</h3>
<p><strong>Cost:</strong> Work delivered 12+ hours late because "Friday EOD" means different things.<br/>
<strong>Fix:</strong> Specify exact UTC time: "Due Friday 23:59 UTC".</p>

<h3>3. Forgetting Daylight Saving Transitions</h3>
<p><strong>Cost:</strong> Meetings shift by an hour for 1-3 weeks (US and Europe change clocks on different dates).<br/>
<strong>Fix:</strong> Use IANA timezone names that auto-handle DST. Check transition dates quarterly.</p>

<h3>4. Scheduling Across 12+ Hour Differences</h3>
<p><strong>Cost:</strong> One team always gets the terrible meeting time → burnout and resentment.<br/>
<strong>Fix:</strong> Rotate meeting times. Record all sessions. Default to async.</p>

<h3>5. Not Using Timezone Tools</h3>
<p><strong>Cost:</strong> Mental math errors, "I thought it was PM not AM", missed client calls.<br/>
<strong>Fix:</strong> Use ClockHive. It's free and eliminates all of these errors.</p>`,
    },
    {
      slug: "why-remote-teams-need-timezone-tool",
      categorySlug: "remote-work",
      title: "Why Every Remote Team Needs a Timezone Management Tool",
      excerpt: "Managing time zones across distributed teams is one of the biggest challenges in remote work. Here's why a dedicated tool matters.",
      tags: ["remote work", "tools", "productivity", "timezone management"],
      seoTitle: "Why Remote Teams Need Timezone Management | ClockHive",
      seoDescription: "Learn why timezone management is essential for remote teams and how to pick the right tool.",
      content: `<p>In today's distributed work environment, teams are spread across the globe. Coordinating meetings, deadlines, and collaboration across time zones has become a critical skill.</p>
<p>A good timezone management tool helps you:</p>
<ul>
<li>Quickly find overlapping working hours</li>
<li>Avoid scheduling meetings outside someone's work hours</li>
<li>Plan project timelines with timezone awareness</li>
<li>Share comparison links so everyone sees times in their local zone</li>
<li>Check if it's a reasonable hour before messaging teammates</li>
</ul>`,
    },
    {
      slug: "scrum-poker-distributed-teams-guide",
      categorySlug: "remote-work",
      title: "Scrum Poker for Distributed Teams: How to Run Remote Estimation Sessions",
      excerpt: "Planning poker doesn't stop being useful when your team goes remote. Here's how to run effective estimation sessions across time zones.",
      tags: ["scrum", "agile", "planning poker", "estimation", "remote teams"],
      seoTitle: "Scrum Poker for Distributed Teams | ClockHive",
      seoDescription: "How to run effective Scrum Poker / Planning Poker sessions with distributed teams. Tips for remote agile estimation across time zones.",
      content: `<h2>Why Scrum Poker Works for Remote Teams</h2>
<p>Scrum Poker (Planning Poker) prevents <strong>anchoring bias</strong> — when the first person to speak influences everyone else's estimate. Each person votes independently, then the results are revealed simultaneously.</p>

<h3>How to Run Remote Planning Poker</h3>
<ol>
<li><strong>Pick a time that works for the whole team</strong> — Use ClockHive's Meeting Planner.</li>
<li><strong>Share the backlog items in advance</strong> — Give everyone 24 hours to review.</li>
<li><strong>Use a digital tool</strong> — ClockHive's free Scrum Poker tool (no sign-up needed).</li>
<li><strong>Discuss outliers</strong> — If one person voted 3 and another voted 13, let them explain their reasoning.</li>
<li><strong>Re-vote until consensus</strong> — Usually takes 2-3 rounds per story.</li>
</ol>

<h3>Fibonacci vs T-Shirt Sizing</h3>
<ul>
<li><strong>Fibonacci (1,2,3,5,8,13,21)</strong> — Best for teams that need precise estimates.</li>
<li><strong>T-Shirt (XS,S,M,L,XL)</strong> — Best for high-level roadmap planning.</li>
<li><strong>Modified Fibonacci</strong> — Add 20, 40, 100 for very large items.</li>
</ul>`,
    },
    {
      slug: "ai-meeting-scheduler-timezone",
      categorySlug: "timezone-guides",
      title: "How AI Meeting Schedulers Handle Time Zones Automatically",
      excerpt: "AI-powered meeting schedulers are changing how we coordinate across time zones. Here's how they work and why they're worth using.",
      tags: ["AI", "meeting scheduler", "artificial intelligence", "automation", "productivity"],
      seoTitle: "AI Meeting Scheduler Timezone Automation | ClockHive",
      seoDescription: "How AI meeting schedulers automatically handle time zones to find the best meeting time. No more manual timezone math.",
      content: `<h2>How AI Schedulers Work</h2>
<p>AI meeting schedulers analyze <strong>hundreds of time slots</strong> across a date range and score each one based on multiple factors:</p>
<ol>
<li><strong>Business hours overlap</strong> — Are all participants within their working hours?</li>
<li><strong>DST awareness</strong> — Does the slot fall on a DST transition day?</li>
<li><strong>Public holidays</strong> — Is it a holiday in any participant's country?</li>
<li><strong>Time zone convenience</strong> — Balancing early/late slots fairly.</li>
<li><strong>Historical patterns</strong> — When has this team successfully met before?</li>
</ol>

<h3>ClockHive's AI Scheduler</h3>
<p>Our AI scans <strong>336 half-hour slots</strong> across 7 days and ranks the top 10 best times with explanations of why each slot was chosen. Try it at <a href="/ai-scheduler">clockhive.cc/ai-scheduler</a>.</p>`,
    },
    {
      slug: "utc-gmt-ist-est-pst-timezone-abbreviations-guide",
      categorySlug: "timezone-guides",
      title: "UTC, GMT, IST, EST, PST: Timezone Abbreviations Explained",
      excerpt: "Confused by UTC, GMT, IST, EST, PST, and all the other timezone abbreviations? Here's what each one means and when to use them.",
      tags: ["UTC", "GMT", "IST", "EST", "PST", "abbreviations", "timezone basics"],
      seoTitle: "Timezone Abbreviations: UTC, GMT, IST, EST, PST Explained | ClockHive",
      seoDescription: "Complete guide to timezone abbreviations. Learn what UTC, GMT, IST, EST, PST, CST, MST, CET, JST, AEST mean and when to use each.",
      content: `<h2>Common Timezone Abbreviations</h2>
<table>
<tr><th>Abbreviation</th><th>Full Name</th><th>UTC Offset</th><th>Region</th></tr>
<tr><td>UTC</td><td>Coordinated Universal Time</td><td>±0:00</td><td>Global standard</td></tr>
<tr><td>GMT</td><td>Greenwich Mean Time</td><td>±0:00</td><td>UK, Portugal, Iceland (winter)</td></tr>
<tr><td>IST</td><td>India Standard Time</td><td>+5:30</td><td>India, Sri Lanka</td></tr>
<tr><td>EST</td><td>Eastern Standard Time</td><td>-5:00</td><td>US East Coast (winter)</td></tr>
<tr><td>EDT</td><td>Eastern Daylight Time</td><td>-4:00</td><td>US East Coast (summer)</td></tr>
<tr><td>PST</td><td>Pacific Standard Time</td><td>-8:00</td><td>US West Coast (winter)</td></tr>
<tr><td>CST</td><td>Central Standard Time</td><td>-6:00</td><td>Central US, China Standard Time (+8:00!)</td></tr>
<tr><td>CET</td><td>Central European Time</td><td>+1:00</td><td>France, Germany, Italy, Spain (winter)</td></tr>
<tr><td>JST</td><td>Japan Standard Time</td><td>+9:00</td><td>Japan</td></tr>
<tr><td>AEST</td><td>Australian Eastern Standard Time</td><td>+10:00</td><td>Sydney, Melbourne, Brisbane</td></tr>
<tr><td>SGT</td><td>Singapore Time</td><td>+8:00</td><td>Singapore, Malaysia, Philippines</td></tr>
</table>

<h3>⚠️ Warning: Abbreviations Are Ambiguous</h3>
<p><strong>CST</strong> can mean Central Standard Time (UTC-6, US) OR China Standard Time (UTC+8). <strong>IST</strong> can mean India Standard Time OR Israel Standard Time. Always use <strong>IANA timezone names</strong> like "America/Chicago" or "Asia/Kolkata" for programming.</p>`,
    },
    {
      slug: "world-clock-apps-comparison-2026",
      categorySlug: "timezone-guides",
      title: "Best World Clock Apps 2026: Compare Features, Pricing, and Accuracy",
      excerpt: "Looking for a world clock app? We compare the top options for remote teams, travelers, and global businesses.",
      tags: ["world clock", "apps", "comparison", "tools", "timezone"],
      seoTitle: "Best World Clock Apps 2026: Feature Comparison | ClockHive",
      seoDescription: "Compare the best world clock apps for 2026. Features, pricing, and accuracy for remote teams, travelers, and global professionals.",
      content: `<h2>What Makes a Great World Clock App?</h2>
<ul>
<li><strong>Accurate timezone data</strong> — Must use IANA database with automatic DST updates</li>
<li><strong>Live updating times</strong> — No manual refresh needed</li>
<li><strong>City search</strong> — Quick lookup for any city worldwide</li>
<li><strong>Comparison view</strong> — See multiple cities side by side</li>
<li><strong>Business hours overlay</strong> — Know when it's working hours</li>
<li><strong>Free</strong> — Shouldn't cost money for basic features</li>
</ul>

<h3>Top World Clock Apps</h3>
<table>
<tr><th>App</th><th>Free?</th><th>Best For</th></tr>
<tr><td><strong>ClockHive</strong></td><td>✅ Yes</td><td>Remote teams, meeting planning, AI scheduling, Scrum Poker</td></tr>
<tr><td>TimeAndDate.com</td><td>✅ Yes</td><td>Quick lookups, DST info</td></tr>
<tr><td>Every Time Zone</td><td>✅ Yes</td><td>Simple slider-based comparison</td></tr>
<tr><td>World Time Buddy</td><td>✅ Yes (with ads)</td><td>Meeting scheduling with calendar view</td></tr>
<tr><td>Spacetime.am</td><td>✅ Yes</td><td>Slack integration for teams</td></tr>
</table>`,
    },
    {
      slug: "timezone-management-startup-founders",
      categorySlug: "business",
      title: "Timezone Management for Startup Founders: Scaling Globally From Day One",
      excerpt: "Startup founders building global teams need timezone strategies from the start. Here's how to scale without burning out your team.",
      tags: ["startup", "founders", "scaling", "global teams", "hiring"],
      seoTitle: "Timezone Management for Startup Founders | ClockHive",
      seoDescription: "How startup founders can build global teams with smart timezone strategies. Hire globally without the coordination nightmare.",
      content: `<h2>Build Timezone-Aware From Day One</h2>
<p>The best startups think globally from the start. But hiring across time zones without a strategy leads to chaos. Here's the playbook:</p>

<h3>1. Define Your "Async Window"</h3>
<p>Identify the 3-4 hour window where most of your team overlaps. Protect this window for collaboration — no deep work, no external meetings.</p>

<h3>2. Document Your Timezone Policy</h3>
<p>Write down and share: expected response times, core hours, meeting rotation rules, and holiday policies. New hires should read this on day one.</p>

<h3>3. Hire in Adjacent Time Zones First</h3>
<p>Your first 5 remote hires should be within 3-4 hours of your HQ timezone. Once processes are solid, expand to 6-8 hour differences.</p>

<h3>4. Invest in Async Infrastructure</h3>
<p>Notion, Loom, Slack — the tools that reduce meeting dependency. Every decision should have a written record.</p>`,
    },
  ];

  for (const post of blogPosts) {
    const category = await prisma.blogCategory.findUnique({ where: { slug: post.categorySlug } });
    if (!category) { console.log(`⚠️  Category not found: ${post.categorySlug}`); continue; }

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: JSON.stringify(post.tags),
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: JSON.stringify(post.tags),
        status: "published",
        publishedAt: new Date(),
        categoryId: category.id,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      },
    });
  }
  console.log(`✅ ${blogPosts.length} blog posts seeded`);

  // ==================== TOURIST ATTRACTIONS ====================
  console.log("🎡 Seeding tourist attractions...");

  const attractionsData: { cityName: string; countryCode: string; attractions: { name: string; category: string; description: string; distanceKm: number; travelTime: string; area: string; suggestedDay: number; displayOrder: number }[] }[] = [
    // TOKYO
    { cityName: "Tokyo", countryCode: "JP", attractions: [
      { name: "Imperial Palace", category: "Landmark", description: "The primary residence of the Emperor of Japan, surrounded by beautiful gardens and moats in the heart of Tokyo.", distanceKm: 1, travelTime: "10–15 min walk", area: "Chiyoda", suggestedDay: 1, displayOrder: 1 },
      { name: "Ginza", category: "Shopping", description: "Tokyo's most famous upscale shopping, dining, and entertainment district with flagship stores and luxury boutiques.", distanceKm: 1.5, travelTime: "5 min by train / 20 min walk", area: "Chuo", suggestedDay: 1, displayOrder: 2 },
      { name: "Tsukiji Outer Market", category: "Food", description: "Historic market area with hundreds of shops and restaurants selling fresh seafood, produce, and Japanese kitchenware.", distanceKm: 2.5, travelTime: "10 min by taxi/train", area: "Chuo", suggestedDay: 1, displayOrder: 3 },
      { name: "Akihabara", category: "Shopping", description: "Electric Town — the mecca for anime, manga, electronics, and gaming culture with countless shops and arcades.", distanceKm: 2.5, travelTime: "5 min by JR", area: "Chiyoda", suggestedDay: 2, displayOrder: 4 },
      { name: "Tokyo Tower", category: "Landmark", description: "Iconic 332m communications tower inspired by the Eiffel Tower, with observation decks offering panoramic city views.", distanceKm: 4, travelTime: "15 min by subway", area: "Minato", suggestedDay: 2, displayOrder: 5 },
      { name: "Ueno Park", category: "Park", description: "Sprawling public park home to museums, a zoo, temples, and the famous cherry blossom avenue in spring.", distanceKm: 4, travelTime: "10 min by JR", area: "Taito", suggestedDay: 2, displayOrder: 6 },
      { name: "Senso-ji", category: "Temple", description: "Tokyo's oldest Buddhist temple, featuring the iconic Kaminarimon gate and bustling Nakamise shopping street.", distanceKm: 5, travelTime: "15–20 min by metro", area: "Asakusa", suggestedDay: 3, displayOrder: 7 },
      { name: "Tokyo Skytree", category: "Landmark", description: "Japan's tallest structure at 634m with two observation decks, a shopping complex, and an aquarium at the base.", distanceKm: 6, travelTime: "20 min by metro", area: "Sumida", suggestedDay: 3, displayOrder: 8 },
      { name: "teamLab Planets", category: "Museum", description: "Immersive digital art museum where you walk through water and gardens merging technology with nature.", distanceKm: 5, travelTime: "20 min by train", area: "Toyosu", suggestedDay: 3, displayOrder: 9 },
      { name: "Shibuya Scramble Crossing", category: "Landmark", description: "The world's busiest pedestrian crossing with giant video screens, right next to the Hachiko statue.", distanceKm: 8, travelTime: "20–25 min by JR", area: "Shibuya", suggestedDay: 4, displayOrder: 10 },
      { name: "Meiji Jingu", category: "Temple", description: "Serene Shinto shrine surrounded by a 170-acre evergreen forest in the middle of Tokyo, dedicated to Emperor Meiji.", distanceKm: 9, travelTime: "25 min by train", area: "Shibuya", suggestedDay: 4, displayOrder: 11 },
      { name: "Shinjuku Gyoen", category: "Park", description: "One of Tokyo's most beautiful parks blending Japanese, French, and English garden styles — stunning in cherry blossom season.", distanceKm: 7, travelTime: "20 min by train", area: "Shinjuku", suggestedDay: 4, displayOrder: 12 },
      { name: "Kabukicho", category: "Entertainment", description: "Tokyo's largest entertainment and red-light district with neon lights, bars, robot restaurants, and nightlife.", distanceKm: 7, travelTime: "20 min by JR", area: "Shinjuku", suggestedDay: 5, displayOrder: 13 },
      { name: "Odaiba", category: "Entertainment", description: "Futuristic man-made island with shopping malls, a giant Gundam statue, hot springs, and Rainbow Bridge views.", distanceKm: 9, travelTime: "30–40 min by Yurikamome", area: "Minato", suggestedDay: 5, displayOrder: 14 },
    ]},
    // NEW DELHI
    { cityName: "New Delhi", countryCode: "IN", attractions: [
      { name: "India Gate", category: "Landmark", description: "Iconic 42m war memorial arch surrounded by lawns, a popular evening gathering spot for locals and tourists.", distanceKm: 0, travelTime: "Central landmark", area: "Central Delhi", suggestedDay: 1, displayOrder: 1 },
      { name: "Red Fort (Lal Qila)", category: "Landmark", description: "UNESCO World Heritage site — the 17th-century Mughal fort that served as the main residence of Mughal emperors for 200 years.", distanceKm: 4, travelTime: "15 min by metro", area: "Chandni Chowk", suggestedDay: 1, displayOrder: 2 },
      { name: "Jama Masjid", category: "Temple", description: "One of India's largest mosques, built by Shah Jahan, with a courtyard that can hold 25,000 worshippers.", distanceKm: 4.5, travelTime: "15 min by metro/rickshaw", area: "Chandni Chowk", suggestedDay: 1, displayOrder: 3 },
      { name: "Qutub Minar", category: "Landmark", description: "73m tall UNESCO-listed minaret built in 1193, the tallest brick minaret in the world with intricate carvings.", distanceKm: 15, travelTime: "35 min by metro", area: "Mehrauli", suggestedDay: 2, displayOrder: 4 },
      { name: "Humayun's Tomb", category: "Landmark", description: "Magnificent 16th-century Mughal garden-tomb, a UNESCO site and precursor to the Taj Mahal's architectural style.", distanceKm: 6, travelTime: "20 min by auto", area: "Nizamuddin", suggestedDay: 2, displayOrder: 5 },
      { name: "Lotus Temple", category: "Temple", description: "Stunning flower-shaped Bahá'í House of Worship with 27 marble petals, open to all faiths for meditation.", distanceKm: 8, travelTime: "25 min by metro", area: "Kalkaji", suggestedDay: 2, displayOrder: 6 },
      { name: "Akshardham Temple", category: "Temple", description: "One of the largest Hindu temples in the world, featuring stunning architecture, exhibitions, and a musical fountain show.", distanceKm: 8, travelTime: "25 min by metro", area: "East Delhi", suggestedDay: 3, displayOrder: 7 },
      { name: "Chandni Chowk", category: "Shopping", description: "Delhi's oldest and busiest market — a sensory explosion of street food, spices, jewelry, and textiles in narrow lanes.", distanceKm: 4, travelTime: "15 min by metro", area: "Old Delhi", suggestedDay: 3, displayOrder: 8 },
      { name: "Rashtrapati Bhavan", category: "Landmark", description: "The official residence of India's President with 340 rooms, Mughal Gardens, and the ceremonial Rajpath boulevard.", distanceKm: 2, travelTime: "10 min drive", area: "Central Delhi", suggestedDay: 1, displayOrder: 9 },
      { name: "Gurudwara Bangla Sahib", category: "Temple", description: "One of Delhi's most prominent Sikh temples with a golden dome, a sacred pool, and a community kitchen serving free meals.", distanceKm: 3, travelTime: "10 min by auto", area: "Connaught Place", suggestedDay: 1, displayOrder: 10 },
    ]},
    // LONDON
    { cityName: "London", countryCode: "GB", attractions: [
      { name: "Buckingham Palace", category: "Landmark", description: "The official residence of the British monarch, famous for the Changing of the Guard ceremony.", distanceKm: 1, travelTime: "15 min walk from Westminster", area: "Westminster", suggestedDay: 1, displayOrder: 1 },
      { name: "Big Ben & Houses of Parliament", category: "Landmark", description: "Iconic clock tower and Gothic parliament building on the Thames — London's most recognizable symbol.", distanceKm: 0, travelTime: "Central landmark", area: "Westminster", suggestedDay: 1, displayOrder: 2 },
      { name: "London Eye", category: "Landmark", description: "135m giant Ferris wheel offering 360° views across London skyline — best at sunset.", distanceKm: 0.5, travelTime: "5 min walk from Westminster", area: "South Bank", suggestedDay: 1, displayOrder: 3 },
      { name: "Tower of London", category: "Landmark", description: "Historic 11th-century castle housing the Crown Jewels, with Beefeater tours and raven legends.", distanceKm: 3.5, travelTime: "15 min by tube", area: "Tower Hill", suggestedDay: 2, displayOrder: 4 },
      { name: "Tower Bridge", category: "Landmark", description: "Victorian bascule bridge with glass-floored walkway 42m above the Thames.", distanceKm: 3.5, travelTime: "15 min by tube", area: "Tower Hill", suggestedDay: 2, displayOrder: 5 },
      { name: "British Museum", category: "Museum", description: "One of the world's greatest museums with 8 million works including the Rosetta Stone and Egyptian mummies.", distanceKm: 2, travelTime: "10 min by tube", area: "Bloomsbury", suggestedDay: 2, displayOrder: 6 },
      { name: "Trafalgar Square", category: "Landmark", description: "Iconic public square with Nelson's Column, lion statues, the National Gallery, and street performers.", distanceKm: 1, travelTime: "10 min walk from Westminster", area: "Charing Cross", suggestedDay: 1, displayOrder: 7 },
      { name: "Covent Garden", category: "Shopping", description: "Vibrant piazza with street performers, boutique shops, restaurants, and the Royal Opera House.", distanceKm: 1.5, travelTime: "5 min by tube", area: "Covent Garden", suggestedDay: 3, displayOrder: 8 },
      { name: "Hyde Park", category: "Park", description: "London's largest Royal Park at 350 acres, featuring the Serpentine lake, Speakers' Corner, and Kensington Gardens.", distanceKm: 3, travelTime: "10 min by tube", area: "Knightsbridge", suggestedDay: 3, displayOrder: 9 },
      { name: "Camden Market", category: "Shopping", description: "Eclectic market with over 1,000 stalls selling vintage fashion, street food, art, and crafts along the canal.", distanceKm: 4, travelTime: "15 min by tube", area: "Camden", suggestedDay: 3, displayOrder: 10 },
    ]},
    // PARIS
    { cityName: "Paris", countryCode: "FR", attractions: [
      { name: "Eiffel Tower", category: "Landmark", description: "The world's most visited monument — 330m iron lattice tower with restaurants and observation decks.", distanceKm: 3, travelTime: "15 min by metro", area: "7th Arrondissement", suggestedDay: 1, displayOrder: 1 },
      { name: "Louvre Museum", category: "Museum", description: "The world's largest art museum, home to the Mona Lisa, Venus de Milo, and the iconic glass pyramid.", distanceKm: 1, travelTime: "Central", area: "1st Arrondissement", suggestedDay: 1, displayOrder: 2 },
      { name: "Notre-Dame Cathedral", category: "Landmark", description: "Masterpiece of French Gothic architecture on the Île de la Cité, dating back to the 12th century.", distanceKm: 0.5, travelTime: "5 min walk from Louvre", area: "Île de la Cité", suggestedDay: 2, displayOrder: 3 },
      { name: "Sacré-Cœur Basilica", category: "Temple", description: "White-domed basilica atop Montmartre hill offering breathtaking panoramic views of Paris.", distanceKm: 4, travelTime: "20 min by metro", area: "Montmartre", suggestedDay: 2, displayOrder: 4 },
      { name: "Arc de Triomphe", category: "Landmark", description: "Monumental arch honoring French soldiers, with an observation deck at the top of the Champs-Élysées.", distanceKm: 4, travelTime: "15 min by metro", area: "8th Arrondissement", suggestedDay: 1, displayOrder: 5 },
      { name: "Champs-Élysées", category: "Shopping", description: "The most beautiful avenue in the world — luxury boutiques, cafés, and theaters stretching 1.9km.", distanceKm: 3, travelTime: "10 min by metro", area: "8th Arrondissement", suggestedDay: 1, displayOrder: 6 },
      { name: "Musée d'Orsay", category: "Museum", description: "Stunning Beaux-Arts railway station turned museum housing the world's largest Impressionist collection.", distanceKm: 1.5, travelTime: "10 min walk from Louvre", area: "7th Arrondissement", suggestedDay: 3, displayOrder: 7 },
      { name: "Palace of Versailles", category: "Landmark", description: "UNESCO World Heritage palace with the Hall of Mirrors and magnificent gardens — a day trip from Paris.", distanceKm: 22, travelTime: "35 min by RER train", area: "Versailles", suggestedDay: 4, displayOrder: 8 },
    ]},
    // NEW YORK
    { cityName: "New York", countryCode: "US", attractions: [
      { name: "Statue of Liberty", category: "Landmark", description: "Iconic symbol of freedom and democracy — take a ferry to Liberty Island and Ellis Island.", distanceKm: 8, travelTime: "25 min by ferry", area: "Liberty Island", suggestedDay: 1, displayOrder: 1 },
      { name: "Central Park", category: "Park", description: "843-acre urban oasis with lakes, meadows, a zoo, and the famous Bethesda Terrace and Fountain.", distanceKm: 4, travelTime: "15 min by subway", area: "Midtown/Uptown", suggestedDay: 1, displayOrder: 2 },
      { name: "Times Square", category: "Landmark", description: "The Crossroads of the World — neon-lit entertainment hub with Broadway theaters and giant digital billboards.", distanceKm: 0, travelTime: "Central landmark", area: "Midtown", suggestedDay: 1, displayOrder: 3 },
      { name: "Empire State Building", category: "Landmark", description: "Art Deco skyscraper with observation decks on the 86th and 102nd floors — stunning 360° views.", distanceKm: 1, travelTime: "5 min walk from Times Square", area: "Midtown", suggestedDay: 2, displayOrder: 4 },
      { name: "Brooklyn Bridge", category: "Landmark", description: "Historic 1883 suspension bridge — walk across for incredible Manhattan skyline views.", distanceKm: 5, travelTime: "15 min by subway", area: "Lower Manhattan", suggestedDay: 2, displayOrder: 5 },
      { name: "Metropolitan Museum of Art", category: "Museum", description: "One of the world's largest art museums with 2 million works spanning 5,000 years of culture.", distanceKm: 4, travelTime: "15 min by subway", area: "Upper East Side", suggestedDay: 2, displayOrder: 6 },
      { name: "Broadway", category: "Entertainment", description: "World-famous theater district with 41 professional theaters — catch a show in the evening.", distanceKm: 0.5, travelTime: "5 min walk from Times Square", area: "Theater District", suggestedDay: 3, displayOrder: 7 },
      { name: "One World Trade Center", category: "Landmark", description: "Tallest building in the Western Hemisphere with the 9/11 Memorial & Museum at its base.", distanceKm: 6, travelTime: "20 min by subway", area: "Financial District", suggestedDay: 3, displayOrder: 8 },
      { name: "High Line", category: "Park", description: "Elevated linear park built on a historic freight rail line with gardens, art, and Hudson River views.", distanceKm: 3, travelTime: "10 min by subway", area: "Chelsea", suggestedDay: 3, displayOrder: 9 },
      { name: "Wall Street", category: "Landmark", description: "Financial heart of America featuring the NYSE, Federal Hall, and the iconic Charging Bull statue.", distanceKm: 6, travelTime: "20 min by subway", area: "Financial District", suggestedDay: 3, displayOrder: 10 },
    ]},
    // DUBAI
    { cityName: "Dubai", countryCode: "AE", attractions: [
      { name: "Burj Khalifa", category: "Landmark", description: "The world's tallest building at 828m with observation decks on floors 124, 125, and 148.", distanceKm: 0, travelTime: "Central landmark", area: "Downtown Dubai", suggestedDay: 1, displayOrder: 1 },
      { name: "Dubai Mall", category: "Shopping", description: "One of the world's largest malls with 1,200+ stores, an aquarium, ice rink, and the Dubai Fountain.", distanceKm: 0.5, travelTime: "5 min walk from Burj Khalifa", area: "Downtown Dubai", suggestedDay: 1, displayOrder: 2 },
      { name: "Palm Jumeirah", category: "Landmark", description: "Iconic palm-shaped artificial island with luxury resorts, beaches, and Atlantis Aquaventure Waterpark.", distanceKm: 20, travelTime: "25 min by taxi/monorail", area: "Palm Jumeirah", suggestedDay: 2, displayOrder: 3 },
      { name: "Dubai Marina", category: "Entertainment", description: "Stunning waterfront district with skyscrapers, beachside dining, and yacht cruises.", distanceKm: 18, travelTime: "25 min by metro", area: "Dubai Marina", suggestedDay: 2, displayOrder: 4 },
      { name: "Gold Souk", category: "Shopping", description: "Traditional market in old Dubai with hundreds of jewelry shops and the world's largest gold ring.", distanceKm: 10, travelTime: "20 min by metro", area: "Deira", suggestedDay: 3, displayOrder: 5 },
      { name: "Dubai Creek", category: "Landmark", description: "Historic saltwater creek where Dubai began — take an abra ride across for 1 AED.", distanceKm: 10, travelTime: "20 min by metro", area: "Bur Dubai", suggestedDay: 3, displayOrder: 6 },
      { name: "Desert Safari", category: "Adventure", description: "Thrilling dune bashing, camel riding, sandboarding, and BBQ dinner in the Arabian desert.", distanceKm: 45, travelTime: "45 min drive", area: "Dubai Desert", suggestedDay: 4, displayOrder: 7 },
      { name: "Museum of the Future", category: "Museum", description: "Striking torus-shaped museum showcasing futuristic innovations with immersive experiences.", distanceKm: 2, travelTime: "10 min by metro", area: "Sheikh Zayed Road", suggestedDay: 1, displayOrder: 8 },
    ]},
    // SINGAPORE
    { cityName: "Singapore", countryCode: "SG", attractions: [
      { name: "Marina Bay Sands", category: "Landmark", description: "Iconic triple-tower hotel with the world's largest rooftop infinity pool and SkyPark observation deck.", distanceKm: 0, travelTime: "Central landmark", area: "Marina Bay", suggestedDay: 1, displayOrder: 1 },
      { name: "Gardens by the Bay", category: "Park", description: "Futuristic nature park with Supertree Grove, Cloud Forest, and Flower Dome — stunning light show at night.", distanceKm: 0.5, travelTime: "5 min walk from MBS", area: "Marina Bay", suggestedDay: 1, displayOrder: 2 },
      { name: "Sentosa Island", category: "Entertainment", description: "Resort island with Universal Studios, beaches, S.E.A. Aquarium, and Adventure Cove Waterpark.", distanceKm: 5, travelTime: "15 min by taxi/cable car", area: "Sentosa", suggestedDay: 2, displayOrder: 3 },
      { name: "Chinatown", category: "Cultural", description: "Historic district with traditional shophouses, Buddha Tooth Relic Temple, and hawker center food.", distanceKm: 2, travelTime: "10 min by MRT", area: "Chinatown", suggestedDay: 3, displayOrder: 4 },
      { name: "Little India", category: "Cultural", description: "Vibrant ethnic district with colorful temples, Tekka Centre market, and authentic Indian cuisine.", distanceKm: 3, travelTime: "12 min by MRT", area: "Little India", suggestedDay: 3, displayOrder: 5 },
      { name: "Singapore Flyer", category: "Landmark", description: "165m giant observation wheel — one of the world's largest — with stunning views of Marina Bay and beyond.", distanceKm: 1.5, travelTime: "5 min by taxi", area: "Marina Bay", suggestedDay: 1, displayOrder: 6 },
      { name: "Singapore Zoo & Night Safari", category: "Wildlife", description: "World-class open-concept zoo and the world's first nocturnal wildlife park with tram rides.", distanceKm: 18, travelTime: "30 min by taxi", area: "Mandai", suggestedDay: 4, displayOrder: 7 },
      { name: "Orchard Road", category: "Shopping", description: "Singapore's premier shopping street with mega-malls, luxury brands, and international dining.", distanceKm: 3, travelTime: "10 min by MRT", area: "Orchard", suggestedDay: 3, displayOrder: 8 },
    ]},
    // SYDNEY
    { cityName: "Sydney", countryCode: "AU", attractions: [
      { name: "Sydney Opera House", category: "Landmark", description: "UNESCO-listed architectural masterpiece — take a tour or watch a performance at this global icon.", distanceKm: 0, travelTime: "Central landmark", area: "Circular Quay", suggestedDay: 1, displayOrder: 1 },
      { name: "Sydney Harbour Bridge", category: "Landmark", description: "Affectionately called 'The Coathanger' — climb to the 134m summit for breathtaking harbor views.", distanceKm: 0.5, travelTime: "5 min walk from Opera House", area: "The Rocks", suggestedDay: 1, displayOrder: 2 },
      { name: "Bondi Beach", category: "Beach", description: "Australia's most famous beach with golden sand, surf culture, and the scenic Bondi to Coogee coastal walk.", distanceKm: 7, travelTime: "25 min by bus", area: "Bondi", suggestedDay: 2, displayOrder: 3 },
      { name: "Taronga Zoo", category: "Wildlife", description: "Harbourside zoo with over 4,000 animals and spectacular views of the Sydney skyline.", distanceKm: 4, travelTime: "12 min by ferry", area: "Mosman", suggestedDay: 3, displayOrder: 4 },
      { name: "The Rocks", category: "Cultural", description: "Sydney's oldest neighborhood with cobblestone streets, weekend markets, historic pubs, and galleries.", distanceKm: 0.5, travelTime: "5 min walk from Circular Quay", area: "The Rocks", suggestedDay: 1, displayOrder: 5 },
      { name: "Darling Harbour", category: "Entertainment", description: "Waterfront precinct with SEA LIFE Aquarium, WILD LIFE Zoo, Maritime Museum, and harbourside dining.", distanceKm: 1.5, travelTime: "10 min walk from city", area: "Darling Harbour", suggestedDay: 2, displayOrder: 6 },
      { name: "Manly Beach", category: "Beach", description: "Laid-back surf beach — take the iconic Manly Ferry for stunning harbour views en route.", distanceKm: 12, travelTime: "30 min by ferry", area: "Manly", suggestedDay: 4, displayOrder: 7 },
    ]},
    // BANGKOK
    { cityName: "Bangkok", countryCode: "TH", attractions: [
      { name: "Grand Palace", category: "Landmark", description: "Dazzling royal complex and former residence of Thai kings, home to the sacred Emerald Buddha.", distanceKm: 0, travelTime: "Central landmark", area: "Rattanakosin", suggestedDay: 1, displayOrder: 1 },
      { name: "Wat Pho", category: "Temple", description: "Home of the massive 46m Reclining Buddha and traditional Thai massage school.", distanceKm: 0.8, travelTime: "10 min walk from Grand Palace", area: "Rattanakosin", suggestedDay: 1, displayOrder: 2 },
      { name: "Wat Arun", category: "Temple", description: "Stunning 'Temple of Dawn' with a 79m central prang decorated with colorful porcelain — best at sunset.", distanceKm: 1.5, travelTime: "5 min ferry across river", area: "Thonburi", suggestedDay: 1, displayOrder: 3 },
      { name: "Chatuchak Weekend Market", category: "Shopping", description: "One of the world's largest weekend markets with 15,000+ stalls selling everything imaginable.", distanceKm: 8, travelTime: "25 min by BTS/metro", area: "Chatuchak", suggestedDay: 2, displayOrder: 4 },
      { name: "Khao San Road", category: "Entertainment", description: "Legendary backpacker street with budget guesthouses, street food, bars, and a vibrant nightlife scene.", distanceKm: 2, travelTime: "10 min by tuk-tuk", area: "Banglamphu", suggestedDay: 3, displayOrder: 5 },
      { name: "MBK Center", category: "Shopping", description: "Eight-floor shopping paradise with 2,000+ shops offering electronics, fashion, and souvenirs at bargain prices.", distanceKm: 3, travelTime: "10 min by BTS", area: "Siam", suggestedDay: 2, displayOrder: 6 },
      { name: "Damnoen Saduak Floating Market", category: "Cultural", description: "Famous canal market where vendors sell fresh produce and Thai food from traditional wooden boats.", distanceKm: 80, travelTime: "1.5 hours by car", area: "Ratchaburi", suggestedDay: 4, displayOrder: 7 },
      { name: "Asiatique", category: "Entertainment", description: "Open-air riverside night market with boutiques, restaurants, and a giant Ferris wheel.", distanceKm: 4, travelTime: "15 min by taxi", area: "Charoenkrung", suggestedDay: 3, displayOrder: 8 },
    ]},
    // ROME
    { cityName: "Rome", countryCode: "IT", attractions: [
      { name: "Colosseum", category: "Landmark", description: "The largest ancient amphitheater ever built — a marvel of Roman engineering completed in 80 AD.", distanceKm: 0, travelTime: "Central landmark", area: "Centro Storico", suggestedDay: 1, displayOrder: 1 },
      { name: "Roman Forum", category: "Landmark", description: "Ancient Rome's civic center with ruins of temples, basilicas, and the Senate House.", distanceKm: 0.2, travelTime: "2 min walk from Colosseum", area: "Centro Storico", suggestedDay: 1, displayOrder: 2 },
      { name: "Trevi Fountain", category: "Landmark", description: "Baroque masterpiece and Rome's largest fountain — toss a coin to ensure your return to the Eternal City.", distanceKm: 2, travelTime: "15 min walk", area: "Trevi", suggestedDay: 2, displayOrder: 3 },
      { name: "Pantheon", category: "Landmark", description: "Remarkably preserved 2,000-year-old temple with the world's largest unreinforced concrete dome.", distanceKm: 1.5, travelTime: "10 min walk from Trevi", area: "Piazza della Rotonda", suggestedDay: 2, displayOrder: 4 },
      { name: "Vatican Museums & Sistine Chapel", category: "Museum", description: "One of the world's greatest art collections featuring Michelangelo's masterpiece ceiling frescoes.", distanceKm: 3.5, travelTime: "20 min by metro", area: "Vatican City", suggestedDay: 3, displayOrder: 5 },
      { name: "St. Peter's Basilica", category: "Temple", description: "The largest church in Christendom with Michelangelo's Pietà and a dome offering panoramic Rome views.", distanceKm: 3.5, travelTime: "20 min by metro", area: "Vatican City", suggestedDay: 3, displayOrder: 6 },
    ]},
    // ISTANBUL
    { cityName: "Istanbul", countryCode: "TR", attractions: [
      { name: "Hagia Sophia", category: "Landmark", description: "Architectural marvel that served as church, mosque, and museum — with stunning dome and mosaics.", distanceKm: 0, travelTime: "Central landmark", area: "Sultanahmet", suggestedDay: 1, displayOrder: 1 },
      { name: "Blue Mosque", category: "Temple", description: "Magnificent 17th-century mosque with six minarets and 20,000 hand-painted blue Iznik tiles.", distanceKm: 0.3, travelTime: "3 min walk", area: "Sultanahmet", suggestedDay: 1, displayOrder: 2 },
      { name: "Topkapi Palace", category: "Landmark", description: "Opulent 15th-century Ottoman palace with treasury, harem quarters, and Bosphorus views.", distanceKm: 0.5, travelTime: "7 min walk", area: "Sultanahmet", suggestedDay: 1, displayOrder: 3 },
      { name: "Grand Bazaar", category: "Shopping", description: "One of the world's oldest and largest covered markets with 4,000+ shops across 61 streets.", distanceKm: 1.5, travelTime: "15 min walk / 5 min tram", area: "Beyazıt", suggestedDay: 2, displayOrder: 4 },
      { name: "Basilica Cistern", category: "Landmark", description: "Mysterious 6th-century underground water storage with 336 columns and atmospheric lighting.", distanceKm: 0.2, travelTime: "3 min walk from Hagia Sophia", area: "Sultanahmet", suggestedDay: 1, displayOrder: 5 },
      { name: "Bosphorus Cruise", category: "Adventure", description: "Scenic boat ride between Europe and Asia with palaces, mansions, and bridges along the shores.", distanceKm: 0, travelTime: "Departs from Eminönü pier", area: "Bosphorus", suggestedDay: 3, displayOrder: 6 },
      { name: "Galata Tower", category: "Landmark", description: "14th-century stone tower with a 360° observation deck offering incredible views of the Golden Horn.", distanceKm: 2.5, travelTime: "10 min by tram", area: "Galata", suggestedDay: 2, displayOrder: 7 },
    ]},
    // SEOUL
    { cityName: "Seoul", countryCode: "KR", attractions: [
      { name: "Gyeongbokgung Palace", category: "Landmark", description: "The grandest of Seoul's Five Grand Palaces — watch the Royal Guard changing ceremony in traditional costume.", distanceKm: 0, travelTime: "Central landmark", area: "Jongno", suggestedDay: 1, displayOrder: 1 },
      { name: "Bukchon Hanok Village", category: "Cultural", description: "Picturesque neighborhood with 600-year-old traditional Korean houses, now cultural centers and tea houses.", distanceKm: 1, travelTime: "12 min walk from Gyeongbokgung", area: "Jongno", suggestedDay: 1, displayOrder: 2 },
      { name: "Myeongdong", category: "Shopping", description: "Seoul's premier shopping district with K-beauty flagship stores, street food stalls, and fashion boutiques.", distanceKm: 2.5, travelTime: "10 min by metro", area: "Jung-gu", suggestedDay: 2, displayOrder: 3 },
      { name: "N Seoul Tower", category: "Landmark", description: "236m tower atop Namsan Mountain offering panoramic city views — especially romantic at night with love locks.", distanceKm: 3, travelTime: "15 min by cable car", area: "Namsan", suggestedDay: 2, displayOrder: 4 },
      { name: "Hongdae", category: "Entertainment", description: "Youthful district near Hongik University with indie music, street performances, themed cafés, and nightlife.", distanceKm: 5, travelTime: "20 min by metro", area: "Mapo-gu", suggestedDay: 3, displayOrder: 5 },
      { name: "Insadong", category: "Cultural", description: "Traditional cultural street with art galleries, antique shops, traditional tea houses, and calligraphy supplies.", distanceKm: 1.5, travelTime: "5 min by taxi", area: "Jongno", suggestedDay: 1, displayOrder: 6 },
      { name: "Gangnam", category: "Entertainment", description: "Upscale district made famous by PSY — luxury boutiques, K-beauty clinics, and trendy restaurants.", distanceKm: 7, travelTime: "25 min by metro", area: "Gangnam-gu", suggestedDay: 3, displayOrder: 7 },
      { name: "DMZ Tour", category: "Historical", description: "Half-day tour to the Korean Demilitarized Zone — peer into North Korea at the Joint Security Area.", distanceKm: 50, travelTime: "1 hour by tour bus", area: "DMZ", suggestedDay: 4, displayOrder: 8 },
    ]},
    // MUMBAI
    { cityName: "Mumbai", countryCode: "IN", attractions: [
      { name: "Gateway of India", category: "Landmark", description: "Iconic 26m basalt arch overlooking the Arabian Sea, built to commemorate King George V's visit in 1911.", distanceKm: 0, travelTime: "Central landmark", area: "Colaba", suggestedDay: 1, displayOrder: 1 },
      { name: "Marine Drive", category: "Landmark", description: "3.6km C-shaped boulevard along the coast known as the 'Queen's Necklace' — stunning at sunset.", distanceKm: 2, travelTime: "10 min drive", area: "Marine Lines", suggestedDay: 1, displayOrder: 2 },
      { name: "Chhatrapati Shivaji Terminus", category: "Landmark", description: "UNESCO-listed Victorian Gothic railway station — Mumbai's busiest and most beautiful building.", distanceKm: 3, travelTime: "15 min by taxi", area: "Fort", suggestedDay: 2, displayOrder: 3 },
      { name: "Elephanta Caves", category: "Historical", description: "UNESCO site — 7th-century rock-cut cave temples on an island in Mumbai Harbour with massive Shiva sculptures.", distanceKm: 10, travelTime: "1 hour by ferry", area: "Elephanta Island", suggestedDay: 2, displayOrder: 4 },
      { name: "Juhu Beach", category: "Beach", description: "Mumbai's most popular beach with street food stalls serving pav bhaji, chaat, and coconut water.", distanceKm: 18, travelTime: "45 min drive", area: "Juhu", suggestedDay: 3, displayOrder: 5 },
      { name: "Dharavi", category: "Cultural", description: "One of Asia's largest slums — take a guided tour to see its thriving small-scale industries and community spirit.", distanceKm: 8, travelTime: "30 min drive", area: "Dharavi", suggestedDay: 3, displayOrder: 6 },
      { name: "Colaba Causeway", category: "Shopping", description: "Bustling street market with jewelry, leather goods, clothes, and antiques — a bargain hunter's paradise.", distanceKm: 0.5, travelTime: "5 min walk from Gateway", area: "Colaba", suggestedDay: 1, displayOrder: 7 },
    ]},
    // HONG KONG
    { cityName: "Hong Kong", countryCode: "HK", attractions: [
      { name: "Victoria Peak", category: "Landmark", description: "The highest point on Hong Kong Island with the world-famous Peak Tram and stunning skyline views.", distanceKm: 4, travelTime: "15 min by Peak Tram", area: "The Peak", suggestedDay: 1, displayOrder: 1 },
      { name: "Star Ferry", category: "Landmark", description: "Historic ferry crossing Victoria Harbour since 1888 — the best value sightseeing in Hong Kong.", distanceKm: 0.5, travelTime: "10 min crossing", area: "Victoria Harbour", suggestedDay: 1, displayOrder: 2 },
      { name: "Temple Street Night Market", category: "Shopping", description: "Vibrant night market with fortune tellers, street food, and bargain goods — pure Hong Kong atmosphere.", distanceKm: 2, travelTime: "10 min by MTR", area: "Kowloon", suggestedDay: 2, displayOrder: 3 },
      { name: "Tian Tan Buddha", category: "Temple", description: "Massive 34m bronze Buddha statue atop 268 steps on Lantau Island — visible from miles away.", distanceKm: 30, travelTime: "45 min by MTR + cable car", area: "Lantau Island", suggestedDay: 3, displayOrder: 4 },
      { name: "Mong Kok", category: "Shopping", description: "One of the world's most densely populated areas with ladies' market, sneaker street, and goldfish market.", distanceKm: 3, travelTime: "15 min by MTR", area: "Mong Kok", suggestedDay: 2, displayOrder: 5 },
      { name: "Ocean Park", category: "Entertainment", description: "Marine-themed amusement park with roller coasters, aquariums, and giant pandas on a scenic coastal setting.", distanceKm: 8, travelTime: "25 min by MTR", area: "Wong Chuk Hang", suggestedDay: 4, displayOrder: 6 },
    ]},
  ];

  for (const ad of attractionsData) {
    const city = await prisma.city.findFirst({
      where: { name: ad.cityName, country: { code: ad.countryCode } },
    });
    if (!city) {
      console.log(`⚠️  City not found: ${ad.cityName} (${ad.countryCode}) — skipping attractions`);
      continue;
    }

    // Delete existing attractions for this city to avoid duplicates on re-seed
    await prisma.attraction.deleteMany({ where: { cityId: city.id } });

    for (const attr of ad.attractions) {
      await prisma.attraction.create({
        data: { ...attr, cityId: city.id },
      });
    }
    console.log(`✅ ${ad.cityName}: ${ad.attractions.length} attractions seeded`);
  }
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
