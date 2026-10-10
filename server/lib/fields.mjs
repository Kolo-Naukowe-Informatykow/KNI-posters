/**
 * Opisy pól formularza dla propsów kompozycji Remotion.
 *
 * Formularz wystawia TYLKO propsy skalarne (string / number / boolean). Reszta
 * propsów (np. tablica `slides` z obrazkami w PostTFNiS) zostaje z `defaultProps`
 * kompozycji, bo Remotion płasko scala `defaultProps` z propsami przekazanymi do
 * renderu (zweryfikowane empirycznie: `--props` / `inputProps` nadpisują tylko
 * podane klucze, reszta pochodzi z `defaultProps`).
 */

const LABELS = {
  time: "Godzina",
  dateLabel: "Data",
  headline: "Nagłówek",
  topicLabel: "Etykieta tematu",
  topicValue: "Temat",
  locationLabel: "Etykieta miejsca",
  locationValue: "Miejsce",
  footer: "Stopka",
  dateTimeLabel: "Data i godzina",
  backgroundMotionIntensity: "Ruch tła",
  backgroundTwinkleIntensity: "Migotanie tła"
};

const HINTS = {
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

/**
 * Opcjonalne propsy `StoryMeetingTemplate`
 * (src/posts/story-meeting/story-meeting-template.component.tsx). Nie ustawia ich
 * każda kompozycja, a domyślna wartość w `OrbitalStarsBackground` to 1.
 */
const OPTIONAL_NUMERIC_FIELDS = [
  {
    name: "backgroundMotionIntensity",
    min: 0,
    max: 3,
    step: 0.05,
    hint: "0 = brak ruchu, 1 = domyślnie"
  },
  {
    name: "backgroundTwinkleIntensity",
    min: 0,
    max: 3,
    step: 0.05,
    hint: "0 = brak migotania, 1 = domyślnie"
  }
];

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
      fields.push({
        name,
        label: label(name),
        type: "string",
        value,
        multiline: value.includes("\n") || value.length > 48,
        hint: HINTS[name]
      });
    } else if (typeof value === "number") {
      fields.push({name, label: label(name), type: "number", value, advanced: true, step: 0.05});
    } else if (typeof value === "boolean") {
      fields.push({name, label: label(name), type: "boolean", value, advanced: true});
    }
  }

  if (Object.hasOwn(defaultProps, "time")) {
    for (const optional of OPTIONAL_NUMERIC_FIELDS) {
      if (!fields.some((field) => field.name === optional.name)) {
        fields.push({...optional, label: label(optional.name), type: "number", value: null, advanced: true});
      }
    }
  }

  return fields.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
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

    if (field.type === "string") {
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
