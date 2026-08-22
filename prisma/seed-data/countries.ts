import { PrismaClient } from "@prisma/client";

export async function seedCountries(prisma: PrismaClient) {
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
        { name: "New York", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "JFK", latitude: 40.7128, longitude: -74.006, population: 8804190, region: "New York" },
        { name: "Los Angeles", timezone: "America/Los_Angeles", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "LAX", latitude: 34.0522, longitude: -118.2437, population: 3898747, region: "California" },
        { name: "Chicago", timezone: "America/Chicago", gmtOffset: "-06:00", dstOffset: "-05:00", airportCode: "ORD", latitude: 41.8781, longitude: -87.6298, population: 2746388, region: "Illinois" },
        { name: "Denver", timezone: "America/Denver", gmtOffset: "-07:00", dstOffset: "-06:00", airportCode: "DEN", latitude: 39.7392, longitude: -104.9903, population: 715522, region: "Colorado" },
        { name: "Anchorage", timezone: "America/Anchorage", gmtOffset: "-09:00", dstOffset: "-08:00", airportCode: "ANC", latitude: 61.2181, longitude: -149.9003, population: 291247, region: "Alaska" },
        { name: "Honolulu", timezone: "Pacific/Honolulu", gmtOffset: "-10:00", dstOffset: null, airportCode: "HNL", latitude: 21.3069, longitude: -157.8583, population: 345064, region: "Hawaii" },
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
        { name: "Brisbane", timezone: "Australia/Brisbane", gmtOffset: "+10:00", dstOffset: null, airportCode: "BNE", latitude: -27.4698, longitude: 153.0251, population: 2568000, seoFaqs: JSON.stringify([
          { q: "What is BNE time?", a: "BNE is the IATA airport code for Brisbane. Brisbane is on Australian Eastern Standard Time (Australia/Brisbane, UTC+10) and does not observe daylight saving time." },
        ]) },
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
        { name: "Geneva", timezone: "Europe/Zurich", gmtOffset: "+01:00", dstOffset: "+02:00", airportCode: "GVA", latitude: 46.2044, longitude: 6.1432, population: 203000, seoFaqs: JSON.stringify([
          { q: "What is GVA time?", a: "GVA is the IATA airport code for Geneva. Geneva is on Central European Time (Europe/Zurich, UTC+1, UTC+2 during daylight saving time)." },
        ]) },
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
        { name: "Jeddah", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "JED", latitude: 21.4858, longitude: 39.1925, population: 4600000, seoFaqs: JSON.stringify([
          { q: "What is JED time?", a: "JED is the IATA airport code for Jeddah. Jeddah is on Arabian Standard Time (Asia/Riyadh, UTC+3) and does not observe daylight saving time." },
        ]) },
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
        { name: "Bali", timezone: "Asia/Makassar", gmtOffset: "+08:00", dstOffset: null, airportCode: "DPS", latitude: -8.4095, longitude: 115.1889, population: 726000, aliases: JSON.stringify(["Denpasar"]) },
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
      { name: "San Francisco", timezone: "America/Los_Angeles", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "SFO", latitude: 37.7749, longitude: -122.4194, population: 808437, region: "California" },
      { name: "Seattle", timezone: "America/Los_Angeles", gmtOffset: "-08:00", dstOffset: "-07:00", airportCode: "SEA", latitude: 47.6062, longitude: -122.3321, population: 737015, region: "Washington" },
      { name: "Houston", timezone: "America/Chicago", gmtOffset: "-06:00", dstOffset: "-05:00", airportCode: "IAH", latitude: 29.7604, longitude: -95.3698, population: 2304580, region: "Texas" },
      { name: "Phoenix", timezone: "America/Phoenix", gmtOffset: "-07:00", dstOffset: null, airportCode: "PHX", latitude: 33.4484, longitude: -112.074, population: 1608139, region: "Arizona" },
      { name: "Miami", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "MIA", latitude: 25.7617, longitude: -80.1918, population: 442241, region: "Florida" },
      { name: "Washington DC", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "DCA", latitude: 38.9072, longitude: -77.0369, population: 689545, region: "District of Columbia", seoFaqs: JSON.stringify([
        { q: "What is DC time?", a: "\"DC time\" is shorthand for the local time in Washington DC, the capital of the United States. Washington DC uses Eastern Time (America/New_York, UTC-5, UTC-4 during daylight saving time)." },
        { q: "Is Washington DC on Eastern Time?", a: "Yes — Washington DC is in the Eastern Time Zone (America/New_York). Its offset is UTC-5, moving to UTC-4 during daylight saving time." },
      ]) },
      { name: "Boston", timezone: "America/New_York", gmtOffset: "-05:00", dstOffset: "-04:00", airportCode: "BOS", latitude: 42.3601, longitude: -71.0589, population: 675647, region: "Massachusetts" },
      { name: "Dallas", timezone: "America/Chicago", gmtOffset: "-06:00", dstOffset: "-05:00", airportCode: "DFW", latitude: 32.7767, longitude: -96.797, population: 1304379, region: "Texas" },
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
      { name: "Incheon", timezone: "Asia/Seoul", gmtOffset: "+09:00", dstOffset: null, airportCode: "ICN", latitude: 37.4563, longitude: 126.7052, population: 2923000, seoFaqs: JSON.stringify([
        { q: "What is ICN time?", a: "ICN is the IATA airport code for Incheon. Incheon is on Korea Standard Time (Asia/Seoul, UTC+9) and does not observe daylight saving time." },
      ]) },
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
    // ========== MORE SAUDI ARABIA CITIES ==========
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", capital: "Riyadh", continent: "Asia", population: 35000000, timezoneCount: 1, displayOrder: 41, cities: [
      { name: "Dammam", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: "DMM", latitude: 26.4207, longitude: 50.0888, population: 1203000 },
      { name: "Khobar", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: null, latitude: 26.2172, longitude: 50.1971, population: 660000 },
      { name: "NEOM", timezone: "Asia/Riyadh", gmtOffset: "+03:00", dstOffset: null, airportCode: null, latitude: 28.1051, longitude: 35.2014, population: 5000 },
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
}
