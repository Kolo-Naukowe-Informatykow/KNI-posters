/**
 * Siatka mozaiki: jeden obraz rozpisany na 3x3 kafelków Instagrama.
 *
 * Każdy post dostaje `shapeIndex` (0-8) i pokazuje tylko swoją komórkę tego samego
 * obrazu, więc kształty trafiają w siebie co do piksela. Cały układ widać dopiero
 * gdy 9 postów stoi obok siebie w siatce.
 */

export const MOSAIC_TILE = 1080;
export const MOSAIC_COLUMNS = 3;
export const MOSAIC_ROWS = 3;
export const MOSAIC_TILES = MOSAIC_COLUMNS * MOSAIC_ROWS;

/** Środek całej mozaiki w jej własnych współrzędnych (tu siedzi słońce). */
export const MOSAIC_CENTER: [number, number] = [
  (MOSAIC_COLUMNS * MOSAIC_TILE) / 2,
  (MOSAIC_ROWS * MOSAIC_TILE) / 2
];

export type MosaicTile = {
  column: number;
  row: number;
};

/** Indeks kafelka przycina się do zakresu 0-8 (błędna wartość = pierwszy kafelek). */
export const clampShapeIndex = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(Math.trunc(parsed), 0), MOSAIC_TILES - 1);
};

/**
 * Indeks następnego kafelka. Posty publikujemy od najstarszego, a Instagram dokłada nowe
 * przed starymi, więc pierwszy post trafia w ostatnią komórkę siatki (8) i numeracja leci w dół.
 */
export const nextShapeIndex = (value: unknown): number =>
  (clampShapeIndex(value) + MOSAIC_TILES - 1) % MOSAIC_TILES;

export const tileOf = (shapeIndex: unknown): MosaicTile => {
  const index = clampShapeIndex(shapeIndex);
  return {column: index % MOSAIC_COLUMNS, row: Math.floor(index / MOSAIC_COLUMNS)};
};
