/**
 * Paczki ikon dla generatora i renderu.
 *
 * `icon-packs.json` opisuje kolejnosc paczek i sposob rysowania (linia albo wypelnienie),
 * a kazda paczka to osobny plik JSON z mapa `nazwa -> markup SVG`:
 *
 * - `kni-icons.json` — własny zestaw KNI (siatka 64 px, stroke 3),
 * - `phosphor-icons.json` — paczka Phosphor (siatka 256 px, ścieżki wypełniane),
 *   generowana przez `npm run icons:build`.
 */
import fs from "node:fs";
import path from "node:path";

const iconsDir = path.join(import.meta.dirname, "..", "..", "src", "core", "icons");

const readJson = (fileName) => {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(iconsDir, fileName), "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error(`Nie udało się wczytać ${fileName}: ${error.message}`);
    return {};
  }
};

const manifest = readJson("icon-packs.json");
const packConfigs = Array.isArray(manifest.packs) ? manifest.packs : [];

/** Paczki w kolejnosci z manifestu; kazda z mapa ikon. */
export const iconPacks = packConfigs.map((pack) => ({...pack, icons: readJson(pack.file)}));

/** Nazwy ikon w kolejnosci paczek — zestaw KNI trafia na gore listy. */
export const iconNames = iconPacks.flatMap((pack) => Object.keys(pack.icons));

export const isKnownIcon = (name) =>
  typeof name === "string" && iconPacks.some((pack) => Object.hasOwn(pack.icons, name));
