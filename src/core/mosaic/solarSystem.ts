/**
 * Proceduralny "układ słoneczny" rozpisany na mozaikę 3x3.
 *
 * Ten sam seed daje zawsze ten sam obraz, a każdy kafelek pokazuje tylko swoje okno.
 * Linie są cienkie i przygaszone, żeby nie konkurowały z tekstem postu.
 */
import {localInTile, MOSAIC_CENTER, MOSAIC_HEIGHT, MOSAIC_WIDTH} from "./mosaic";

type Point = [number, number];

/**
 * Strefa, w której na każdym kafelku leży tekst (logo, godzina, temat, miejsce, stopka).
 * Współrzędne są lokalne dla widocznego kafelka — planety i księżyce omijają ten obszar,
 * żeby nie wyglądały jak kropki w zdaniu.
 */
const TEXT_ZONE = {x0: 30, x1: 985, y0: 340, y1: 1245};

const inTextZone = ([x, y]: Point): boolean => {
  const [localX, localY] = localInTile(x, y);
  return localX > TEXT_ZONE.x0 && localX < TEXT_ZONE.x1 && localY > TEXT_ZONE.y0 && localY < TEXT_ZONE.y1;
};

export type SolarOrbit = {
  key: string;
  path: string;
  opacity: number;
  width: number;
};

export type SolarBody = {
  key: string;
  cx: number;
  cy: number;
  radius: number;
  tone: "planet" | "moon" | "sun" | "belt";
};

export type SolarStar = {
  key: string;
  cx: number;
  cy: number;
  radius: number;
  warm: boolean;
};

export type SolarSystem = {
  orbits: SolarOrbit[];
  bodies: SolarBody[];
  stars: SolarStar[];
  sun: {cx: number; cy: number; radius: number; coreRadius: number};
};

export const MAX_SEED = 2147483647;

/** Seed sprowadzony do liczby całkowitej z zakresu 0..MAX_SEED. */
export const normalizeSeed = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.abs(Math.trunc(parsed)) % MAX_SEED;
};

/** Deterministyczny generator pseudolosowy (mulberry32). */
const createRandom = (seed: number) => {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const ellipsePath = ([cx, cy]: Point, rx: number, ry: number, rotation: number): string => {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const point = (angle: number): Point => {
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    return [cx + x * cos - y * sin, cy + x * sin + y * cos];
  };

  const start = point(0);
  const middle = point(Math.PI);
  const a = `${rx.toFixed(1)} ${ry.toFixed(1)} ${(rotation * 180 / Math.PI).toFixed(2)}`;
  return [
    `M ${start[0].toFixed(1)} ${start[1].toFixed(1)}`,
    `A ${a} 1 0 ${middle[0].toFixed(1)} ${middle[1].toFixed(1)}`,
    `A ${a} 1 0 ${start[0].toFixed(1)} ${start[1].toFixed(1)}`
  ].join(" ");
};

const ellipsePoint = ([cx, cy]: Point, rx: number, ry: number, rotation: number, angle: number): Point => {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const x = Math.cos(angle) * rx;
  const y = Math.sin(angle) * ry;
  return [cx + x * cos - y * sin, cy + x * sin + y * cos];
};

export const buildSolarSystem = (rawSeed: number): SolarSystem => {
  const seed = normalizeSeed(rawSeed);
  const random = createRandom(seed);
  const orbits: SolarOrbit[] = [];
  const bodies: SolarBody[] = [];
  const stars: SolarStar[] = [];

  const [cx, cy] = MOSAIC_CENTER;
  const tilt = (random() - 0.5) * 0.34;
  const planetCount = 4 + Math.floor(random() * 2);
  let distance = 500 + random() * 120;

  for (let index = 0; index < planetCount; index += 1) {
    const rx = distance;
    const ry = distance * (0.82 + random() * 0.16);
    const rotation = tilt + (random() - 0.5) * 0.24;
    orbits.push({
      key: `orbit-${index}`,
      path: ellipsePath([cx, cy], rx, ry, rotation),
      opacity: 0.2 + random() * 0.1,
      width: index === 0 ? 2.6 : 1.9
    });

    let angle = random() * Math.PI * 2;
    let position = ellipsePoint([cx, cy], rx, ry, rotation, angle);
    for (let attempt = 0; attempt < 12 && inTextZone(position); attempt += 1) {
      angle += Math.PI / 5.5;
      position = ellipsePoint([cx, cy], rx, ry, rotation, angle);
    }
    const [px, py] = position;
    const planetRadius = 10 + random() * 8;
    bodies.push({key: `planet-${index}`, cx: px, cy: py, radius: planetRadius, tone: "planet"});

    if (random() > 0.4) {
      const moonAngle = angle + 0.9 + random();
      bodies.push({
        key: `moon-${index}`,
        cx: px + Math.cos(moonAngle) * (planetRadius + 16 + random() * 12),
        cy: py + Math.sin(moonAngle) * (planetRadius + 16 + random() * 12),
        radius: 3 + random() * 2.5,
        tone: "moon"
      });
    }

    distance += 300 + random() * 220;
    if (distance > 2080) break;
  }

  // Pas planetoid — dużo drobnych kropek na jednej orbicie.
  const beltIndex = orbits.length;
  const beltRx = Math.min(distance + 70, 2160);
  const beltRy = beltRx * (0.84 + random() * 0.12);
  const beltRotation = tilt + (random() - 0.5) * 0.14;
  orbits.push({
    key: "orbit-belt",
    path: ellipsePath([cx, cy], beltRx, beltRy, beltRotation),
    opacity: 0.13,
    width: 1.2
  });

  for (let index = 0; index < 56; index += 1) {
    const angle = (index / 56) * Math.PI * 2 + random() * 0.08;
    const [bx, by] = ellipsePoint([cx, cy], beltRx, beltRy, beltRotation, angle);
    bodies.push({key: `belt-${beltIndex}-${index}`, cx: bx, cy: by, radius: 2 + random() * 1.7, tone: "belt"});
  }

  for (let index = 0; index < 90; index += 1) {
    stars.push({
      key: `star-${index}`,
      cx: random() * MOSAIC_WIDTH,
      cy: random() * MOSAIC_HEIGHT,
      radius: 0.9 + random() * 1.9,
      warm: random() > 0.72
    });
  }

  return {
    orbits,
    bodies,
    stars,
    sun: {cx, cy, radius: 120 + random() * 70, coreRadius: 11 + random() * 5}
  };
};
