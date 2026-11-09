const PL_MONTHS = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia"
];

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const fallback = (value: string): string => (typeof value === "string" ? value.trim() : "");

/**
 * Zamienia datę z pola `input[type="date"]` na tekst na plakacie.
 * `2026-10-03` -> `3 października 2026`. Niepoprawna wartość wraca bez zmian.
 */
export const formatPlDate = (isoDate: string): string => {
  const match = ISO_DATE.exec((isoDate ?? "").trim());
  if (!match) return fallback(isoDate);

  const [, year, month, day] = match;
  const monthName = PL_MONTHS[Number(month) - 1];
  if (!monthName) return fallback(isoDate);

  return `${Number(day)} ${monthName} ${year}`;
};

/**
 * Najbliższy wybrany dzień tygodnia jako `YYYY-MM-DD` (dziś, jeśli dziś wypada ten dzień).
 * `weekday` liczony jak w `Date#getDay()`: 0 = niedziela, 1 = poniedziałek, ... 6 = sobota.
 */
export const nextWeekdayISO = (weekday: number, today = new Date()): string => {
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  date.setDate(date.getDate() + ((weekday - date.getDay() + 7) % 7));

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Najbliższy wtorek jako `YYYY-MM-DD` (dziś, jeśli dziś jest wtorek).
 * Domyślna data nowego postu o spotkaniu.
 */
export const nextTuesdayISO = (today = new Date()): string => nextWeekdayISO(2, today);

/** Najbliższy poniedziałek — domyślna data spotkania sekcji robotyki. */
export const nextMondayISO = (today = new Date()): string => nextWeekdayISO(1, today);

/** Najbliższy czwartek — domyślna data spotkania Redflag. */
export const nextThursdayISO = (today = new Date()): string => nextWeekdayISO(4, today);

/** Najbliższa środa — domyślna data spotkania sekcji gamedev. */
export const nextWednesdayISO = (today = new Date()): string => nextWeekdayISO(3, today);
