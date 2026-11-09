/**
 * Palety postów o spotkaniach.
 *
 * Tematy spotkań korzystają z `default`, a osobne spotkania sekcji mają własny,
 * od razu rozpoznawalny kolor: ogólne (niebieski), robotyka (bursztyn), Redflag (czerwień),
 * gamedev (zieleń).
 * Paleta obejmuje też tło, żeby odróżnienie było widoczne z daleka, a nie tylko w akcencie.
 */
export type PostThemeName = "default" | "general" | "robotics" | "cyber" | "gamedev";

export type PostTheme = {
  /** Trzy przystanki gradientu tła mozaiki. */
  backgroundStart: string;
  backgroundMid: string;
  backgroundEnd: string;
  /** Akcent: godzina, separator, ikona, wartości pól. */
  accent: string;
  /** Łagodniejszy akcent: etykiety pól i tekst pomocniczy. */
  accentSoft: string;
  /** Kolor planet i korony słońca w tle. */
  glow: string;
};

export const POST_THEMES: Record<PostThemeName, PostTheme> = {
  default: {
    backgroundStart: "#1b1638",
    backgroundMid: "#101a33",
    backgroundEnd: "#0b0b16",
    accent: "#ffdbed",
    accentSoft: "#e3e9ff",
    glow: "#6c63ff"
  },
  general: {
    backgroundStart: "#10213a",
    backgroundMid: "#0e2433",
    backgroundEnd: "#08121b",
    accent: "#cfe3ff",
    accentSoft: "#e2ecff",
    glow: "#4f9dff"
  },
  robotics: {
    backgroundStart: "#2b1c12",
    backgroundMid: "#1d1724",
    backgroundEnd: "#0b0a12",
    accent: "#ffd6a0",
    accentSoft: "#ffe6c9",
    glow: "#ff8a3d"
  },
  cyber: {
    backgroundStart: "#2a1220",
    backgroundMid: "#1a0f24",
    backgroundEnd: "#0b0a12",
    accent: "#ffb3bd",
    accentSoft: "#ffd6dc",
    glow: "#ff3d5a"
  },
  gamedev: {
    backgroundStart: "#12291c",
    backgroundMid: "#0e2118",
    backgroundEnd: "#080f0b",
    accent: "#c6f5b0",
    accentSoft: "#dcf8cd",
    glow: "#48d17a"
  }
};

export const DEFAULT_POST_THEME: PostThemeName = "default";

/** Nieznana nazwa (np. stara definicja) spada na paletę domyślną. */
export const resolvePostTheme = (name?: string): PostTheme =>
  POST_THEMES[(name ?? "") as PostThemeName] ?? POST_THEMES[DEFAULT_POST_THEME];
