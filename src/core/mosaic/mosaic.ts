/**
 * Siatka mozaiki: jeden obraz rozpisany na 3x3 postów w profilu Instagrama.
 *
 * Instagram pokazuje posty 4:5 w siatce 3:4 (przycina boki) i zostawia cienki
 * odstęp między kafelkami. Mozaika liczy oba te efekty, więc w tym, co naprawdę
 * widać na profilu, sąsiednie kafelki schodzą się co do piksela.
 *
 * Każdy post dostaje `shapeIndex` (0-8) i pokazuje tylko swój wycinek tego samego
 * obrazu. Cały układ widać dopiero gdy 9 postów stoi obok siebie w siatce.
 */

/** Rozmiar renderowanego posta (4:5). */
export const MOSAIC_POST_WIDTH = 1080;
export const MOSAIC_POST_HEIGHT = 1350;

/** Siatka profilu ma proporcje 3:4 — Instagram obcina boki posta 4:5. */
export const MOSAIC_GRID_ASPECT = 3 / 4;

/** Przerwa między postami na profilu w pikselach posta (ok. 1 px CSS). */
export const MOSAIC_GAP = 8;

/** Szerokość kafelka widoczna w siatce po przycięciu boków posta. */
export const MOSAIC_VISIBLE_WIDTH = MOSAIC_POST_HEIGHT * MOSAIC_GRID_ASPECT;

/** Ile pikseli z każdej strony posta obcina siatka Instagrama. */
export const MOSAIC_CROP_X = (MOSAIC_POST_WIDTH - MOSAIC_VISIBLE_WIDTH) / 2;

export const MOSAIC_COLUMNS = 3;
export const MOSAIC_ROWS = 3;
export const MOSAIC_TILES = MOSAIC_COLUMNS * MOSAIC_ROWS;

/**
 * Odległość między początkami sąsiednich kafelków. Obraz pod odstępem istnieje,
 * ale Instagram go nie pokazuje — dlatego sąsiednie kafelki są o `MOSAIC_GAP`
 * dalej od siebie, a nie o pełną szerokość widocznego kadru.
 */
export const MOSAIC_PITCH_X = MOSAIC_VISIBLE_WIDTH + MOSAIC_GAP;
export const MOSAIC_PITCH_Y = MOSAIC_POST_HEIGHT + MOSAIC_GAP;

/** Rozmiar całej mozaiki bez zewnętrznych odstępów. */
export const MOSAIC_WIDTH = MOSAIC_COLUMNS * MOSAIC_VISIBLE_WIDTH + (MOSAIC_COLUMNS - 1) * MOSAIC_GAP;
export const MOSAIC_HEIGHT = MOSAIC_ROWS * MOSAIC_POST_HEIGHT + (MOSAIC_ROWS - 1) * MOSAIC_GAP;

/** Środek całej mozaiki w jej własnych współrzędnych (tu siedzi słońce). */
export const MOSAIC_CENTER: [number, number] = [MOSAIC_WIDTH / 2, MOSAIC_HEIGHT / 2];

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

/** Pozycja punktu mozaiki względem lewego górnego rogu najbliższego kafelka. */
export const localInTile = (x: number, y: number): [number, number] => [
  x - Math.floor(x / MOSAIC_PITCH_X) * MOSAIC_PITCH_X,
  y - Math.floor(y / MOSAIC_PITCH_Y) * MOSAIC_PITCH_Y
];
