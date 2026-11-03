/**
 * Drobny stan UI trzymany na wolumenie (`<OUT_DIR>/ui-state.json`).
 *
 * Trzymamy tu ostatni kafelek ukladu i historie seedow tla, zeby generator
 * podpowiadal kolejny kafelek i pozwalal wrocic do poprzedniego tla —
 * niezaleznie od historii zadan, ktora bywa czyszczona.
 */
import fs from "node:fs";
import path from "node:path";

const MAX_SEEDS = 24;

export const createUiState = (outDir) => {
  const file = path.join(outDir, "ui-state.json");
  let cache = null;

  const read = () => {
    if (cache) return cache;
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      cache = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      cache = {};
    }
    return cache;
  };

  const write = (patch) => {
    cache = {...read(), ...patch};
    try {
      fs.mkdirSync(outDir, {recursive: true});
      const temp = `${file}.tmp`;
      fs.writeFileSync(temp, JSON.stringify(cache, null, 2), "utf8");
      fs.renameSync(temp, file);
    } catch (error) {
      console.error(`Nie udało się zapisać stanu UI: ${error.message}`);
    }
    return cache;
  };

  const seeds = () => {
    const stored = read().seeds;
    return Array.isArray(stored) ? stored.filter((value) => Number.isInteger(value) && value >= 0) : [];
  };

  /** Dodaje seed do historii (bez duplikatow) i ustawia go jako aktualny. */
  const rememberSeed = (seed) => {
    const history = seeds().filter((value) => value !== seed);
    history.push(seed);
    return write({seeds: history.slice(-MAX_SEEDS), currentSeed: seed});
  };

  return {read, write, seeds, rememberSeed, file};
};
