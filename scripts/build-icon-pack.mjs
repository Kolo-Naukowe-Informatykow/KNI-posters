/**
 * Generuje `src/core/icons/phosphor-icons.json` z paczki `@phosphor-icons/core`.
 *
 * Ikony trzymamy w repo jako jeden plik JSON, zeby render Remotion i generator
 * w przegladarce korzystaly z tych samych ksztaltow bez zaleznosci od node_modules
 * w czasie renderu. Po aktualizacji paczki uruchom ponownie: `npm run icons:build`.
 *
 * Wybieramy wariant `bold`, bo przy duzym rozmiarze ikony na plakacie trzyma
 * podobna grubosc linii co zestaw KNI.
 */
import fs from "node:fs";
import path from "node:path";

const WEIGHT = "bold";

const repoRoot = path.resolve(import.meta.dirname, "..");
const iconsDir = path.join(repoRoot, "node_modules", "@phosphor-icons", "core", "assets", WEIGHT);
const outFile = path.join(repoRoot, "src", "core", "icons", "phosphor-icons.json");
const weightSuffix = new RegExp(`-${WEIGHT}$`);

if (!fs.existsSync(iconsDir)) {
  console.error(`Brak katalogu ikon: ${iconsDir}. Zainstaluj @phosphor-icons/core.`);
  process.exit(1);
}

const icons = {};

for (const file of fs.readdirSync(iconsDir)) {
  if (!file.endsWith(".svg")) continue;
  const raw = fs.readFileSync(path.join(iconsDir, file), "utf8");
  const match = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) continue;
  const name = file.slice(0, -4).replace(weightSuffix, "");
  icons[name] = match[1]
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s*\n\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const sorted = Object.fromEntries(Object.entries(icons).sort(([a], [b]) => a.localeCompare(b)));

fs.mkdirSync(path.dirname(outFile), {recursive: true});
fs.writeFileSync(outFile, `${JSON.stringify(sorted)}\n`, "utf8");
console.log(`Zapisano ${Object.keys(sorted).length} ikon do ${path.relative(repoRoot, outFile)}`);
