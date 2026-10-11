import {cancelRender, continueRender, delayRender, staticFile} from "remotion";

/**
 * Czcionki sa czescia repo (`public/fonts/`), a nie zaleznoscia od czcionek systemowych.
 * Kontener na serwerze nie ma Segoe UI ani Trebuchet MS, dlatego bez tego render
 * na serwerze wygladal inaczej niz lokalnie na Windows.
 *
 * Selawik to otwarta czcionka Microsoftu (SIL OFL 1.1, `public/fonts/LICENSE.txt`)
 * metrycznie zgodna z Segoe UI - uklad i zawijanie tekstu nie zmieniaja sie.
 */
export const KNI_FONT_FAMILY = 'Selawik, "Segoe UI", "DejaVu Sans", sans-serif';

const KNI_FONT_FAMILY_NAME = "Selawik";

const FONT_FACES: ReadonlyArray<{fileName: string; weight: number}> = [
  {fileName: "fonts/selawik-regular.woff2", weight: 400},
  {fileName: "fonts/selawik-semibold.woff2", weight: 600},
  {fileName: "fonts/selawik-bold.woff2", weight: 700}
];

/**
 * Wczytuje pliki czcionek i rejestruje je w `document.fonts`.
 * `delayRender` wstrzymuje render, wiec klatka nigdy nie powstaje z czcionka zapasowa.
 */
const registerFontFaces = async () => {
  await Promise.all(
    FONT_FACES.map(async ({fileName, weight}) => {
      const fontFace = new FontFace(KNI_FONT_FAMILY_NAME, `url('${staticFile(fileName)}') format('woff2')`, {
        style: "normal",
        weight: String(weight)
      });
      await fontFace.load();
      document.fonts.add(fontFace);
    })
  );
};

// Modul jest importowany przez komponenty, wiec ladowanie startuje przy pierwszym renderze
// (identycznie w Remotion Studio i w renderze serwerowym).
const fontHandle = delayRender("Wczytywanie czcionek KNI (Selawik)");

registerFontFaces()
  .then(() => continueRender(fontHandle))
  .catch((error: unknown) => cancelRender(error instanceof Error ? error : new Error(String(error))));
