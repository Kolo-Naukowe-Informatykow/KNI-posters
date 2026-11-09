import themes from "./post-themes.json";

/**
 * Palety postów o spotkaniach (dane w `post-themes.json`, czyta je też serwer generatora).
 *
 * Tematy spotkań korzystają z `default`, a osobne spotkania sekcji mają własny,
 * od razu rozpoznawalny kolor: ogólne (niebieski), robotyka (bursztyn), Redflag (czerwień),
 * gamedev (zieleń). Paleta obejmuje też tło, żeby odróżnienie było widoczne z daleka.
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

export const POST_THEMES = themes as Record<PostThemeName, PostTheme>;

export const DEFAULT_POST_THEME: PostThemeName = "default";

/** Nieznana nazwa (np. stara definicja) spada na paletę domyślną. */
export const resolvePostTheme = (name?: string): PostTheme =>
  POST_THEMES[(name ?? "") as PostThemeName] ?? POST_THEMES[DEFAULT_POST_THEME];
