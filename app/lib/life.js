export const LIFE_YEARS = 80;
export const WEEKS_PER_YEAR = 52;
export const TOTAL_WEEKS = LIFE_YEARS * WEEKS_PER_YEAR;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Parses a date input without letting the browser reinterpret it in UTC.
 * @param {string} value
 */
export function parseDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function partsFromDate(value) {
  if (typeof value === "string") return parseDateInput(value);
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;

  return {
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    day: value.getDate(),
  };
}

function toUtcTimestamp(parts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatDateInput(value = new Date()) {
  const parts = partsFromDate(value);
  if (!parts) throw new TypeError("Fecha inválida");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function getFullYears(birthDate, atDate = new Date()) {
  const birth = partsFromDate(birthDate);
  const at = partsFromDate(atDate);
  if (!birth || !at) throw new TypeError("Fecha inválida");

  let years = at.year - birth.year;
  if (at.month < birth.month || (at.month === birth.month && at.day < birth.day)) {
    years -= 1;
  }
  return years;
}

export function getDaysAlive(birthDate, atDate = new Date()) {
  const birth = partsFromDate(birthDate);
  const at = partsFromDate(atDate);
  if (!birth || !at) throw new TypeError("Fecha inválida");

  return Math.floor((toUtcTimestamp(at) - toUtcTimestamp(birth)) / DAY_IN_MS);
}

export function getWeeksAlive(birthDate, atDate = new Date()) {
  const daysAlive = getDaysAlive(birthDate, atDate);
  if (daysAlive < 0) throw new RangeError("La fecha de nacimiento no puede ser futura");

  return Math.min(TOTAL_WEEKS, Math.floor(daysAlive / 7));
}

export function calculateLifeSnapshot(birthDate, atDate = new Date()) {
  const age = getFullYears(birthDate, atDate);
  const daysAlive = getDaysAlive(birthDate, atDate);
  if (daysAlive < 0) throw new RangeError("La fecha de nacimiento no puede ser futura");

  return {
    age,
    daysAlive,
    weeksAlive: Math.min(TOTAL_WEEKS, Math.floor(daysAlive / 7)),
  };
}

function addUtcDays(birthDate, days) {
  const birth = parseDateInput(birthDate);
  if (!birth) throw new TypeError("Fecha inválida");
  return new Date(toUtcTimestamp(birth) + days * DAY_IN_MS);
}

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function getWeekDetails(birthDate, weekIndex) {
  if (!Number.isInteger(weekIndex) || weekIndex < 0 || weekIndex >= TOTAL_WEEKS) {
    throw new RangeError("Semana fuera del calendario");
  }

  const start = addUtcDays(birthDate, weekIndex * 7);
  const end = addUtcDays(birthDate, weekIndex * 7 + 6);
  const startInput = `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-${pad(start.getUTCDate())}`;

  return {
    number: weekIndex + 1,
    age: getFullYears(birthDate, startInput),
    dateRange: `${shortDateFormatter.format(start)} – ${shortDateFormatter.format(end)}`,
  };
}
