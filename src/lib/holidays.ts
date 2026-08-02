/**
 * Holiday data and checking utilities for ClockHive.
 * Includes major national/fixed-date holidays.
 * Floating holidays (Easter, Eid, Diwali, etc.) use approximate rules.
 */

interface Holiday {
  name: string;
  month: number; // 1-12
  day: number;   // 1-31
  type: "national" | "religious" | "observance";
}

// Approximate Easter Sunday (valid 1900-2099 using the Meeus/Jones/Butcher algorithm)
function getEasterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

// Approximate Diwali (varies mid-Oct to mid-Nov)
function getDiwaliApprox(year: number): { month: number; day: number } {
  // Approximate: ~15-20 days after Dussehra, typically late Oct/early Nov
  return { month: 11, day: 1 };
}

// Approximate Eid al-Fitr (moves ~11 days earlier each year in Gregorian)
function getEidAlFitrApprox(year: number): { month: number; day: number } {
  // Rough approximation based on 2024 dates (~April 10)
  const baseYear = 2024;
  const baseDay = 100; // April 10 = day 100 of year
  const yearsDiff = year - baseYear;
  const approxDayOfYear = baseDay - yearsDiff * 11;
  const date = new Date(year, 0);
  date.setDate(approxDayOfYear);
  return { month: date.getMonth() + 1, day: date.getDate() };
}

function getEidAlAdhaApprox(year: number): { month: number; day: number } {
  const eidAlFitr = getEidAlFitrApprox(year);
  const date = new Date(year, eidAlFitr.month - 1, eidAlFitr.day + 70);
  return { month: date.getMonth() + 1, day: date.getDate() };
}

// Country code → list of holidays
const HOLIDAYS_BY_COUNTRY: Record<string, Holiday[]> = {};

function addHolidays(countryCode: string, holidays: Holiday[]) {
  if (!HOLIDAYS_BY_COUNTRY[countryCode]) {
    HOLIDAYS_BY_COUNTRY[countryCode] = [];
  }
  HOLIDAYS_BY_COUNTRY[countryCode].push(...holidays);
}

// ==================== GLOBAL HOLIDAYS ====================
const NEW_YEARS_DAY: Holiday = { name: "New Year's Day", month: 1, day: 1, type: "national" };
const CHRISTMAS_DAY: Holiday = { name: "Christmas Day", month: 12, day: 25, type: "national" };
const CHRISTMAS_EVE: Holiday = { name: "Christmas Eve", month: 12, day: 24, type: "observance" };
const NEW_YEARS_EVE: Holiday = { name: "New Year's Eve", month: 12, day: 31, type: "observance" };
const BOXING_DAY: Holiday = { name: "Boxing Day", month: 12, day: 26, type: "national" };
const LABOUR_DAY: Holiday = { name: "Labour Day", month: 5, day: 1, type: "national" };

// ==================== USA ====================
addHolidays("US", [
  NEW_YEARS_DAY,
  { name: "Martin Luther King Jr. Day", month: 1, day: 20, type: "national" },
  { name: "Presidents' Day", month: 2, day: 17, type: "national" },
  { name: "Memorial Day", month: 5, day: 26, type: "national" },
  { name: "Juneteenth", month: 6, day: 19, type: "national" },
  { name: "Independence Day", month: 7, day: 4, type: "national" },
  { name: "Labor Day", month: 9, day: 1, type: "national" },
  { name: "Columbus Day", month: 10, day: 13, type: "observance" },
  { name: "Veterans Day", month: 11, day: 11, type: "national" },
  { name: "Thanksgiving", month: 11, day: 27, type: "national" },
  CHRISTMAS_DAY,
  NEW_YEARS_EVE,
]);

// ==================== UK ====================
addHolidays("GB", [
  NEW_YEARS_DAY,
  { name: "St Patrick's Day", month: 3, day: 17, type: "observance" },
  { name: "Early May Bank Holiday", month: 5, day: 5, type: "national" },
  { name: "Spring Bank Holiday", month: 5, day: 26, type: "national" },
  { name: "Summer Bank Holiday", month: 8, day: 25, type: "national" },
  { name: "Guy Fawkes Day", month: 11, day: 5, type: "observance" },
  { name: "Remembrance Day", month: 11, day: 11, type: "observance" },
  CHRISTMAS_DAY,
  BOXING_DAY,
  NEW_YEARS_EVE,
]);

// ==================== INDIA ====================
addHolidays("IN", [
  { name: "Republic Day", month: 1, day: 26, type: "national" },
  { name: "Maha Shivaratri", month: 2, day: 26, type: "religious" },
  { name: "Holi", month: 3, day: 14, type: "religious" },
  { name: "Ram Navami", month: 4, day: 6, type: "religious" },
  { name: "Good Friday", month: 4, day: 3, type: "religious" },
  { name: "Independence Day", month: 8, day: 15, type: "national" },
  { name: "Raksha Bandhan", month: 8, day: 9, type: "religious" },
  { name: "Janmashtami", month: 8, day: 15, type: "religious" },
  { name: "Ganesh Chaturthi", month: 9, day: 7, type: "religious" },
  { name: "Dussehra", month: 10, day: 2, type: "religious" },
  { name: "Gandhi Jayanti", month: 10, day: 2, type: "national" },
  ...(() => { const d = getDiwaliApprox(2026); return [{ name: "Diwali", month: d.month, day: d.day, type: "religious" as const }]; })(),
  { name: "Guru Nanak Jayanti", month: 11, day: 5, type: "religious" },
  CHRISTMAS_DAY,
  NEW_YEARS_EVE,
]);

// ==================== AUSTRALIA ====================
addHolidays("AU", [
  NEW_YEARS_DAY,
  { name: "Australia Day", month: 1, day: 26, type: "national" },
  { name: "Labour Day", month: 3, day: 10, type: "national" },
  { name: "ANZAC Day", month: 4, day: 25, type: "national" },
  { name: "Queen's Birthday", month: 6, day: 9, type: "national" },
  CHRISTMAS_DAY,
  BOXING_DAY,
  NEW_YEARS_EVE,
]);

// ==================== JAPAN ====================
addHolidays("JP", [
  NEW_YEARS_DAY,
  { name: "Coming of Age Day", month: 1, day: 12, type: "national" },
  { name: "Foundation Day", month: 2, day: 11, type: "national" },
  { name: "Emperor's Birthday", month: 2, day: 23, type: "national" },
  { name: "Vernal Equinox Day", month: 3, day: 20, type: "national" },
  { name: "Showa Day", month: 4, day: 29, type: "national" },
  { name: "Constitution Memorial Day", month: 5, day: 3, type: "national" },
  { name: "Greenery Day", month: 5, day: 4, type: "national" },
  { name: "Children's Day", month: 5, day: 5, type: "national" },
  { name: "Marine Day", month: 7, day: 20, type: "national" },
  { name: "Mountain Day", month: 8, day: 11, type: "national" },
  { name: "Respect for the Aged Day", month: 9, day: 21, type: "national" },
  { name: "Autumnal Equinox Day", month: 9, day: 23, type: "national" },
  { name: "Sports Day", month: 10, day: 12, type: "national" },
  { name: "Culture Day", month: 11, day: 3, type: "national" },
  { name: "Labor Thanksgiving Day", month: 11, day: 23, type: "national" },
  NEW_YEARS_EVE,
]);

// ==================== GERMANY ====================
addHolidays("DE", [
  NEW_YEARS_DAY,
  { name: "German Unity Day", month: 10, day: 3, type: "national" },
  { name: "Reformation Day", month: 10, day: 31, type: "observance" },
  { name: "All Saints' Day", month: 11, day: 1, type: "religious" },
  { name: "St. Nicholas Day", month: 12, day: 6, type: "observance" },
  CHRISTMAS_EVE,
  CHRISTMAS_DAY,
  { name: "Second Christmas Day", month: 12, day: 26, type: "national" },
  NEW_YEARS_EVE,
]);

// ==================== FRANCE ====================
addHolidays("FR", [
  NEW_YEARS_DAY,
  { name: "Bastille Day", month: 7, day: 14, type: "national" },
  { name: "Assumption Day", month: 8, day: 15, type: "religious" },
  { name: "All Saints' Day", month: 11, day: 1, type: "religious" },
  { name: "Armistice Day", month: 11, day: 11, type: "national" },
  CHRISTMAS_DAY,
  NEW_YEARS_EVE,
]);

// ==================== CANADA ====================
addHolidays("CA", [
  NEW_YEARS_DAY,
  { name: "Family Day", month: 2, day: 17, type: "national" },
  { name: "Victoria Day", month: 5, day: 19, type: "national" },
  { name: "Canada Day", month: 7, day: 1, type: "national" },
  { name: "Civic Holiday", month: 8, day: 4, type: "national" },
  { name: "Labour Day", month: 9, day: 1, type: "national" },
  { name: "Thanksgiving", month: 10, day: 13, type: "national" },
  { name: "Remembrance Day", month: 11, day: 11, type: "national" },
  CHRISTMAS_DAY,
  BOXING_DAY,
  NEW_YEARS_EVE,
]);

// ==================== CHINA ====================
addHolidays("CN", [
  NEW_YEARS_DAY,
  { name: "Chinese New Year", month: 2, day: 17, type: "national" },
  { name: "Qingming Festival", month: 4, day: 5, type: "national" },
  { name: "Labour Day Holiday", month: 5, day: 1, type: "national" },
  { name: "Dragon Boat Festival", month: 5, day: 31, type: "national" },
  { name: "Mid-Autumn Festival", month: 9, day: 27, type: "national" },
  { name: "National Day", month: 10, day: 1, type: "national" },
]);

// ==================== BRAZIL ====================
addHolidays("BR", [
  NEW_YEARS_DAY,
  { name: "Carnival", month: 2, day: 16, type: "national" },
  { name: "Tiradentes Day", month: 4, day: 21, type: "national" },
  { name: "Independence Day", month: 9, day: 7, type: "national" },
  { name: "Our Lady of Aparecida", month: 10, day: 12, type: "national" },
  { name: "All Souls' Day", month: 11, day: 2, type: "national" },
  { name: "Republic Day", month: 11, day: 15, type: "national" },
  CHRISTMAS_DAY,
  NEW_YEARS_EVE,
]);

// ==================== SINGAPORE ====================
addHolidays("SG", [
  NEW_YEARS_DAY,
  { name: "Chinese New Year", month: 2, day: 17, type: "national" },
  { name: "National Day", month: 8, day: 9, type: "national" },
  { name: "Deepavali", month: 11, day: 1, type: "religious" },
  CHRISTMAS_DAY,
]);

// ==================== UAE ====================
addHolidays("AE", [
  NEW_YEARS_DAY,
  { name: "National Day", month: 12, day: 2, type: "national" },
]);

// ==================== RUSSIA ====================
addHolidays("RU", [
  { name: "New Year Holiday", month: 1, day: 1, type: "national" },
  { name: "Orthodox Christmas", month: 1, day: 7, type: "religious" },
  { name: "Defender of the Fatherland Day", month: 2, day: 23, type: "national" },
  { name: "International Women's Day", month: 3, day: 8, type: "national" },
  { name: "Victory Day", month: 5, day: 9, type: "national" },
  { name: "Russia Day", month: 6, day: 12, type: "national" },
  { name: "Unity Day", month: 11, day: 4, type: "national" },
]);

// ==================== SOUTH KOREA ====================
addHolidays("KR", [
  NEW_YEARS_DAY,
  { name: "Seollal (Lunar New Year)", month: 1, day: 29, type: "national" },
  { name: "Independence Movement Day", month: 3, day: 1, type: "national" },
  { name: "Children's Day", month: 5, day: 5, type: "national" },
  { name: "Buddha's Birthday", month: 5, day: 5, type: "religious" },
  { name: "Memorial Day", month: 6, day: 6, type: "national" },
  { name: "Liberation Day", month: 8, day: 15, type: "national" },
  { name: "Chuseok", month: 10, day: 6, type: "national" },
  { name: "National Foundation Day", month: 10, day: 3, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== MEXICO ====================
addHolidays("MX", [
  NEW_YEARS_DAY,
  { name: "Constitution Day", month: 2, day: 3, type: "national" },
  { name: "Benito Juárez Day", month: 3, day: 17, type: "national" },
  { name: "Labour Day", month: 5, day: 1, type: "national" },
  { name: "Independence Day", month: 9, day: 16, type: "national" },
  { name: "Day of the Dead", month: 11, day: 2, type: "national" },
  { name: "Revolution Day", month: 11, day: 17, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== ITALY ====================
addHolidays("IT", [
  NEW_YEARS_DAY,
  { name: "Epiphany", month: 1, day: 6, type: "national" },
  { name: "Liberation Day", month: 4, day: 25, type: "national" },
  LABOUR_DAY,
  { name: "Republic Day", month: 6, day: 2, type: "national" },
  { name: "Assumption Day", month: 8, day: 15, type: "national" },
  { name: "All Saints' Day", month: 11, day: 1, type: "national" },
  { name: "Immaculate Conception", month: 12, day: 8, type: "national" },
  CHRISTMAS_DAY,
  { name: "St. Stephen's Day", month: 12, day: 26, type: "national" },
]);

// ==================== SPAIN ====================
addHolidays("ES", [
  NEW_YEARS_DAY,
  { name: "Epiphany", month: 1, day: 6, type: "national" },
  LABOUR_DAY,
  { name: "National Day", month: 10, day: 12, type: "national" },
  { name: "All Saints' Day", month: 11, day: 1, type: "national" },
  { name: "Constitution Day", month: 12, day: 6, type: "national" },
  { name: "Immaculate Conception", month: 12, day: 8, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== SAUDI ARABIA ====================
addHolidays("SA", [
  { name: "Saudi National Day", month: 9, day: 23, type: "national" },
]);

// ==================== TURKEY ====================
addHolidays("TR", [
  NEW_YEARS_DAY,
  { name: "National Sovereignty Day", month: 4, day: 23, type: "national" },
  LABOUR_DAY,
  { name: "Youth and Sports Day", month: 5, day: 19, type: "national" },
  { name: "Democracy Day", month: 7, day: 15, type: "national" },
  { name: "Victory Day", month: 8, day: 30, type: "national" },
  { name: "Republic Day", month: 10, day: 29, type: "national" },
]);

// ==================== IRELAND ====================
addHolidays("IE", [
  NEW_YEARS_DAY,
  { name: "St. Patrick's Day", month: 3, day: 17, type: "national" },
  { name: "May Day", month: 5, day: 5, type: "national" },
  { name: "June Bank Holiday", month: 6, day: 2, type: "national" },
  { name: "August Bank Holiday", month: 8, day: 4, type: "national" },
  { name: "October Bank Holiday", month: 10, day: 27, type: "national" },
  CHRISTMAS_DAY,
  { name: "St. Stephen's Day", month: 12, day: 26, type: "national" },
]);

// ==================== SOUTH AFRICA ====================
addHolidays("ZA", [
  NEW_YEARS_DAY,
  { name: "Human Rights Day", month: 3, day: 21, type: "national" },
  { name: "Freedom Day", month: 4, day: 27, type: "national" },
  LABOUR_DAY,
  { name: "Youth Day", month: 6, day: 16, type: "national" },
  { name: "National Women's Day", month: 8, day: 9, type: "national" },
  { name: "Heritage Day", month: 9, day: 24, type: "national" },
  { name: "Day of Reconciliation", month: 12, day: 16, type: "national" },
  CHRISTMAS_DAY,
  { name: "Day of Goodwill", month: 12, day: 26, type: "national" },
]);

// ==================== NETHERLANDS ====================
addHolidays("NL", [
  NEW_YEARS_DAY,
  { name: "King's Day", month: 4, day: 27, type: "national" },
  { name: "Liberation Day", month: 5, day: 5, type: "national" },
  CHRISTMAS_DAY,
  { name: "Second Christmas Day", month: 12, day: 26, type: "national" },
]);

// ==================== SWITZERLAND ====================
addHolidays("CH", [
  NEW_YEARS_DAY,
  { name: "Swiss National Day", month: 8, day: 1, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== SWEDEN ====================
addHolidays("SE", [
  NEW_YEARS_DAY,
  { name: "Epiphany", month: 1, day: 6, type: "national" },
  { name: "National Day", month: 6, day: 6, type: "national" },
  { name: "Midsummer Eve", month: 6, day: 20, type: "national" },
  CHRISTMAS_EVE,
  CHRISTMAS_DAY,
  BOXING_DAY,
  NEW_YEARS_EVE,
]);

// ==================== NEW ZEALAND ====================
addHolidays("NZ", [
  NEW_YEARS_DAY,
  { name: "Day after New Year", month: 1, day: 2, type: "national" },
  { name: "Waitangi Day", month: 2, day: 6, type: "national" },
  { name: "ANZAC Day", month: 4, day: 25, type: "national" },
  { name: "Queen's Birthday", month: 6, day: 2, type: "national" },
  { name: "Labour Day", month: 10, day: 27, type: "national" },
  CHRISTMAS_DAY,
  BOXING_DAY,
]);

// ==================== PORTUGAL ====================
addHolidays("PT", [
  NEW_YEARS_DAY,
  { name: "Freedom Day", month: 4, day: 25, type: "national" },
  LABOUR_DAY,
  { name: "Portugal Day", month: 6, day: 10, type: "national" },
  { name: "Assumption Day", month: 8, day: 15, type: "national" },
  { name: "Republic Day", month: 10, day: 5, type: "national" },
  { name: "All Saints' Day", month: 11, day: 1, type: "national" },
  { name: "Restoration of Independence", month: 12, day: 1, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== POLAND ====================
addHolidays("PL", [
  NEW_YEARS_DAY,
  { name: "Epiphany", month: 1, day: 6, type: "national" },
  LABOUR_DAY,
  { name: "Constitution Day", month: 5, day: 3, type: "national" },
  { name: "Assumption Day", month: 8, day: 15, type: "national" },
  { name: "All Saints' Day", month: 11, day: 1, type: "national" },
  { name: "Independence Day", month: 11, day: 11, type: "national" },
  CHRISTMAS_DAY,
  BOXING_DAY,
]);

// ==================== GREECE ====================
addHolidays("GR", [
  NEW_YEARS_DAY,
  { name: "Epiphany", month: 1, day: 6, type: "national" },
  { name: "Independence Day", month: 3, day: 25, type: "national" },
  { name: "Ohi Day", month: 10, day: 28, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== ISRAEL ====================
addHolidays("IL", [
  { name: "Purim", month: 3, day: 14, type: "national" },
  { name: "Passover", month: 4, day: 13, type: "national" },
  { name: "Independence Day", month: 5, day: 1, type: "national" },
  { name: "Shavuot", month: 6, day: 2, type: "national" },
  { name: "Rosh Hashanah", month: 9, day: 12, type: "national" },
  { name: "Yom Kippur", month: 9, day: 21, type: "national" },
  { name: "Sukkot", month: 9, day: 26, type: "national" },
]);

// ==================== THAILAND ====================
addHolidays("TH", [
  NEW_YEARS_DAY,
  { name: "Songkran Festival", month: 4, day: 13, type: "national" },
  { name: "Coronation Day", month: 5, day: 4, type: "national" },
  { name: "King's Birthday", month: 7, day: 28, type: "national" },
  { name: "Queen Mother's Birthday", month: 8, day: 12, type: "national" },
  { name: "King Bhumibol Memorial Day", month: 10, day: 13, type: "national" },
  { name: "King Chulalongkorn Day", month: 10, day: 23, type: "national" },
  { name: "King's Birthday (Rama IX)", month: 12, day: 5, type: "national" },
  { name: "Constitution Day", month: 12, day: 10, type: "national" },
]);

// ==================== EGYPT ====================
addHolidays("EG", [
  { name: "Coptic Christmas", month: 1, day: 7, type: "national" },
  { name: "Sinai Liberation Day", month: 4, day: 25, type: "national" },
  LABOUR_DAY,
  { name: "Revolution Day", month: 7, day: 23, type: "national" },
  { name: "Armed Forces Day", month: 10, day: 6, type: "national" },
]);

// ==================== DENMARK ====================
addHolidays("DK", [
  NEW_YEARS_DAY,
  { name: "Constitution Day", month: 6, day: 5, type: "national" },
  CHRISTMAS_EVE,
  CHRISTMAS_DAY,
  BOXING_DAY,
]);

// ==================== NORWAY ====================
addHolidays("NO", [
  NEW_YEARS_DAY,
  { name: "Constitution Day", month: 5, day: 17, type: "national" },
  CHRISTMAS_DAY,
  BOXING_DAY,
]);

// ==================== FINLAND ====================
addHolidays("FI", [
  NEW_YEARS_DAY,
  { name: "Independence Day", month: 12, day: 6, type: "national" },
  CHRISTMAS_EVE,
  CHRISTMAS_DAY,
  BOXING_DAY,
]);

// ==================== AUSTRIA ====================
addHolidays("AT", [
  NEW_YEARS_DAY,
  { name: "National Day", month: 10, day: 26, type: "national" },
  CHRISTMAS_DAY,
  BOXING_DAY,
]);

// ==================== PHILIPPINES ====================
addHolidays("PH", [
  NEW_YEARS_DAY,
  { name: "Araw ng Kagitingan", month: 4, day: 9, type: "national" },
  LABOUR_DAY,
  { name: "Independence Day", month: 6, day: 12, type: "national" },
  { name: "National Heroes Day", month: 8, day: 25, type: "national" },
  { name: "Bonifacio Day", month: 11, day: 30, type: "national" },
  CHRISTMAS_DAY,
  { name: "Rizal Day", month: 12, day: 30, type: "national" },
]);

// ==================== VIETNAM ====================
addHolidays("VN", [
  NEW_YEARS_DAY,
  { name: "Tet Holiday", month: 2, day: 17, type: "national" },
  { name: "Hung Kings Festival", month: 4, day: 7, type: "national" },
  { name: "Reunification Day", month: 4, day: 30, type: "national" },
  LABOUR_DAY,
  { name: "National Day", month: 9, day: 2, type: "national" },
]);

// ==================== TAIWAN ====================
addHolidays("TW", [
  NEW_YEARS_DAY,
  { name: "Lunar New Year", month: 1, day: 29, type: "national" },
  { name: "Peace Memorial Day", month: 2, day: 28, type: "national" },
  { name: "Tomb Sweeping Day", month: 4, day: 5, type: "national" },
  { name: "Dragon Boat Festival", month: 5, day: 31, type: "national" },
  { name: "Mid-Autumn Festival", month: 9, day: 27, type: "national" },
  { name: "National Day", month: 10, day: 10, type: "national" },
]);

// ==================== ARGENTINA ====================
addHolidays("AR", [
  NEW_YEARS_DAY,
  { name: "Carnival", month: 3, day: 3, type: "national" },
  { name: "Memorial Day", month: 3, day: 24, type: "national" },
  { name: "Malvinas Day", month: 4, day: 2, type: "national" },
  LABOUR_DAY,
  { name: "Revolution Day", month: 5, day: 25, type: "national" },
  { name: "Flag Day", month: 6, day: 20, type: "national" },
  { name: "Independence Day", month: 7, day: 9, type: "national" },
  { name: "San Martín Day", month: 8, day: 17, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== COLOMBIA ====================
addHolidays("CO", [
  NEW_YEARS_DAY,
  LABOUR_DAY,
  { name: "Independence Day", month: 7, day: 20, type: "national" },
  { name: "Battle of Boyacá", month: 8, day: 7, type: "national" },
  CHRISTMAS_DAY,
]);

// ==================== PAKISTAN ====================
addHolidays("PK", [
  { name: "Kashmir Day", month: 2, day: 5, type: "national" },
  { name: "Pakistan Day", month: 3, day: 23, type: "national" },
  LABOUR_DAY,
  { name: "Independence Day", month: 8, day: 14, type: "national" },
  { name: "Iqbal Day", month: 11, day: 9, type: "national" },
  { name: "Quaid-e-Azam Day", month: 12, day: 25, type: "national" },
]);

// ==================== BANGLADESH ====================
addHolidays("BD", [
  { name: "Language Martyrs' Day", month: 2, day: 21, type: "national" },
  { name: "Independence Day", month: 3, day: 26, type: "national" },
  { name: "Bengali New Year", month: 4, day: 14, type: "national" },
  LABOUR_DAY,
  { name: "National Mourning Day", month: 8, day: 15, type: "national" },
  { name: "Victory Day", month: 12, day: 16, type: "national" },
]);

// ==================== NEPAL ====================
addHolidays("NP", [
  { name: "Prithvi Jayanti", month: 1, day: 11, type: "national" },
  { name: "Democracy Day", month: 2, day: 19, type: "national" },
  { name: "Nepali New Year", month: 4, day: 14, type: "national" },
  { name: "Constitution Day", month: 9, day: 20, type: "national" },
]);

// ==================== SRI LANKA ====================
addHolidays("LK", [
  { name: "Tamil Thai Pongal Day", month: 1, day: 15, type: "national" },
  { name: "Independence Day", month: 2, day: 4, type: "national" },
  { name: "Sinhala & Tamil New Year", month: 4, day: 13, type: "national" },
  LABOUR_DAY,
  CHRISTMAS_DAY,
]);

// ==================== UAE ====================
addHolidays("AE", [
  NEW_YEARS_DAY,
  ...(() => { const d = getEidAlFitrApprox(2026); return [{ name: "Eid al-Fitr", month: d.month, day: d.day, type: "religious" as const }]; })(),
  ...(() => { const d = getEidAlAdhaApprox(2026); return [{ name: "Eid al-Adha", month: d.month, day: d.day, type: "religious" as const }]; })(),
  { name: "Islamic New Year", month: 6, day: 26, type: "national" },
  { name: "UAE National Day", month: 12, day: 2, type: "national" },
]);

// Add floating holidays for countries that have them
function addEasterHolidays(countryCode: string) {
  const easter2026 = getEasterSunday(2026);
  addHolidays(countryCode, [
    { name: "Good Friday", month: easter2026.month, day: easter2026.day - 2, type: "religious" },
    { name: "Easter Sunday", month: easter2026.month, day: easter2026.day, type: "religious" },
    { name: "Easter Monday", month: easter2026.month, day: easter2026.day + 1, type: "religious" },
  ]);
}

["GB", "DE", "FR", "IT", "ES", "NL", "CH", "SE", "DK", "NO", "FI", "AT", "IE", "PT", "PL", "CA", "AU", "NZ", "BR", "MX", "AR", "CO", "ZA"].forEach(addEasterHolidays);

// ==================== PUBLIC API ====================

/**
 * Check if a given date is a holiday for the specified country.
 * Returns the holiday info or null.
 */
export function getHoliday(countryCode: string, date?: Date): Holiday | null {
  const d = date || new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const holidays = HOLIDAYS_BY_COUNTRY[countryCode.toUpperCase()];
  if (!holidays) return null;

  // Check exact date match (±1 day for observances that may span multiple days)
  const match = holidays.find(
    (h) => h.month === month && Math.abs(h.day - day) <= 1
  );

  // Prefer exact match
  const exact = holidays.find((h) => h.month === month && h.day === day);
  return exact || (match && match.type === "national" ? match : null) || null;
}

/**
 * Check if today is a national holiday (business closed) for a given country.
 */
export function isNationalHoliday(countryCode: string): boolean {
  const holiday = getHoliday(countryCode);
  return holiday !== null && holiday.type === "national";
}

/**
 * Get all holidays for a country for the current year.
 */
export function getHolidaysForCountry(countryCode: string): Holiday[] {
  return HOLIDAYS_BY_COUNTRY[countryCode.toUpperCase()] || [];
}
