/**
 * Opisy pól formularza dla propsów kompozycji Remotion.
 *
 * Formularz wystawia TYLKO propsy skalarne (string / number / boolean) oraz pola
 * specjalne: `date` (kalendarz), `shape` (kafelek mozaiki) i `seed` (ziarno tła).
 * Reszta propsów (np. tablica `slides` z obrazkami w PostTFNiS) zostaje z
 * `defaultProps` kompozycji, bo Remotion płasko scala `defaultProps` z propsami
 * przekazanymi do renderu (zweryfikowane empirycznie: `--props` / `inputProps`
 * nadpisują tylko podane klucze, reszta pochodzi z `defaultProps`).
 */

const MAX_SEED = 2147483647;

const LABELS = {
  shapeIndex: "Kafelek układu",
  seed: "Ziarno tła",
  dateISO: "Data spotkania",
  time: "Godzina",
  dateLabel: "Data",
  headline: "Nagłówek",
  topicLabel: "Etykieta tematu",
  topicValue: "Temat",
  locationLabel: "Etykieta miejsca",
  locationValue: "Miejsce",
  footer: "Stopka",
  dateTimeLabel: "Data i godzina"
};

const HINTS = {
  shapeIndex: "9 kafelków tworzy jeden układ — generator podpowiada kolejny (9, 8, ... 1)",
  seed: "Ten sam seed = to samo tło; można wrócić do poprzednich",
  dateISO: "Data z kalendarza trafia na plakat jako np. 10 listopada 2026",
  time: "np. 18:00",
  dateLabel: "np. 28 maja 2026",
  headline: "Krótka, mocna informacja",
  topicLabel: "np. Temat",
  topicValue: "np. Speedrunning Minecraft",
  locationLabel: "np. gdzie?",
  locationValue: "np. WMiI, sala L9 (Enter = nowa linia)",
  footer: "np. serdecznie zapraszamy!",
  dateTimeLabel: "np. 25.04.2026, 10:00-16:00"
};

/** Kolejność pól: najważniejsze informacje najpierw. */
const ORDER = [
  "shapeIndex",
  "seed",
  "dateISO",
  "time",
  "dateTimeLabel",
  "dateLabel",
  "headline",
  "topicLabel",
  "topicValue",
  "locationLabel",
  "locationValue",
  "footer"
];

/** Pola z kalendarzem: UI wysyła `RRRR-MM-DD`, komponent zamienia to na tekst (np. 3 października). */
const DATE_FIELDS = new Set(["dateISO"]);

/** Pola wyboru kafelka mozaiki: liczba kafelków układu. */
const SHAPE_FIELDS = new Map([["shapeIndex", 9]]);

/** Pola z ziarnem tła: UI pokazuje losowanie i historię seedów. */
const SEED_FIELDS = new Set(["seed"]);

const label = (name) =>
  LABELS[name] ??
  name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const rank = (name) => {
  const index = ORDER.indexOf(name);
  return index === -1 ? ORDER.length : index;
};

/** Buduje listę pól formularza z `defaultProps` kompozycji. */
export const describeFields = (defaultProps = {}) => {
  const fields = [];

  for (const [name, value] of Object.entries(defaultProps)) {
    if (typeof value === "string") {
      if (DATE_FIELDS.has(name)) {
        fields.push({name, label: label(name), type: "date", value, hint: HINTS[name]});
        continue;
      }
      fields.push({
        name,
        label: label(name),
        type: "string",
        value,
        multiline: value.includes("\n") || value.length > 48,
        hint: HINTS[name]
      });
    } else if (typeof value === "number") {
      const tiles = SHAPE_FIELDS.get(name);
      if (tiles) {
        fields.push({name, label: label(name), type: "shape", value, count: tiles, hint: HINTS[name]});
        continue;
      }
      if (SEED_FIELDS.has(name)) {
        fields.push({name, label: label(name), type: "seed", value, max: MAX_SEED, hint: HINTS[name]});
        continue;
      }
      fields.push({name, label: label(name), type: "number", value, advanced: true, step: 0.05});
    } else if (typeof value === "boolean") {
      fields.push({name, label: label(name), type: "boolean", value, advanced: true});
    }
  }

  return fields.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const isISODate = (value) => {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

/** Sprawdza i normalizuje propsy przysłane z UI (tylko znane, skalarne pola). */
export const sanitizeProps = (fields, rawProps) => {
  const result = {};
  const errors = [];
  const byName = new Map(fields.map((field) => [field.name, field]));

  for (const [name, rawValue] of Object.entries(rawProps ?? {})) {
    const field = byName.get(name);
    if (!field) {
      errors.push(`Nieznane pole: ${name}`);
      continue;
    }

    if (field.type === "date") {
      if (typeof rawValue !== "string") {
        errors.push(`Pole ${name} musi być datą`);
        continue;
      }
      const trimmed = rawValue.trim();
      if (trimmed === "") {
        result[name] = "";
        continue;
      }
      if (!isISODate(trimmed)) {
        errors.push(`Pole ${name} musi być poprawną datą RRRR-MM-DD`);
        continue;
      }
      result[name] = trimmed;
    } else if (field.type === "shape") {
      const parsed = typeof rawValue === "number" ? rawValue : Number.parseInt(String(rawValue ?? ""), 10);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed >= field.count) {
        errors.push(`Pole ${name} musi być numerem kafelka 0-${field.count - 1}`);
        continue;
      }
      result[name] = parsed;
    } else if (field.type === "seed") {
      const parsed = typeof rawValue === "number" ? rawValue : Number.parseInt(String(rawValue ?? ""), 10);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > field.max) {
        errors.push(`Pole ${name} musi być liczbą całkowitą 0-${field.max}`);
        continue;
      }
      result[name] = parsed;
    } else if (field.type === "string") {
      if (typeof rawValue !== "string") {
        errors.push(`Pole ${name} musi być tekstem`);
        continue;
      }
      if (rawValue.length > 2000) {
        errors.push(`Pole ${name} jest za długie (limit 2000 znaków)`);
        continue;
      }
      result[name] = rawValue;
    } else if (field.type === "number") {
      if (rawValue === null || rawValue === "") continue;
      const parsed = typeof rawValue === "number" ? rawValue : Number(rawValue);
      if (!Number.isFinite(parsed)) {
        errors.push(`Pole ${name} musi być liczbą`);
        continue;
      }
      result[name] = parsed;
    } else if (field.type === "boolean") {
      result[name] = Boolean(rawValue);
    }
  }

  return {props: result, errors};
};
