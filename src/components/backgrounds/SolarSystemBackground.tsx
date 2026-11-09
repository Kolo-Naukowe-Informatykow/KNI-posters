import type React from "react";
import {useMemo} from "react";
import {MOSAIC_COLUMNS, MOSAIC_ROWS, MOSAIC_TILE, tileOf} from "../../core/mosaic/mosaic";
import {buildSolarSystem} from "../../core/mosaic/solarSystem";
import {POST_THEMES, type PostTheme} from "../../core/posts/postThemes";

const WIDTH = 1080;
const HEIGHT = 1350;
const MOSAIC_WIDTH = MOSAIC_COLUMNS * MOSAIC_TILE;
const MOSAIC_HEIGHT = MOSAIC_ROWS * MOSAIC_TILE;

/** Kwadrat widoczny w siatce Instagrama (kadr 4:5 jest przycinany do środka). */
export const CROP_TOP = 135;

type Props = {
  /** Kafelek mozaiki 0-8 — 9 postów tworzy jeden układ. */
  shapeIndex: number;
  /** Ziarno generatora: ten sam seed = ten sam układ słoneczny. */
  seed: number;
  /** Paleta sekcji: kolory gradientu i obiektów są wspólne dla całej mozaiki. */
  palette?: PostTheme;
};

/**
 * Tło postu: wycinek jednego, globalnego obrazu rozpiętego na mozaikę 3x3.
 *
 * Gradient, gwiazdy i układ słoneczny są liczone w jednych współrzędnych mozaiki,
 * a kafelek tylko przesuwa `viewBox`. Dzięki temu na styku kafelków nie ma szwu
 * ani ciemniejszej ramki — tło jest dokładnie ciągłe.
 */
export const SolarSystemBackground: React.FC<Props> = ({shapeIndex, seed, palette = POST_THEMES.default}) => {
  const system = useMemo(() => buildSolarSystem(seed), [seed]);
  const {column, row} = tileOf(shapeIndex);
  const idPrefix = `solar-${palette.glow.replace(/#/g, "")}-${seed}-${column}-${row}`;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`${column * MOSAIC_TILE} ${row * MOSAIC_TILE - CROP_TOP} ${WIDTH} ${HEIGHT}`}
      style={{position: "absolute", inset: 0, pointerEvents: "none"}}
      aria-hidden="true"
    >
      <defs>
        {/* Gradient ciągnięty przez całą mozaikę — sąsiednie kafelki mają ten sam kolor na styku. */}
        <linearGradient id={`${idPrefix}-base`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={MOSAIC_WIDTH} y2={MOSAIC_HEIGHT}>
          <stop offset="0%" stopColor={palette.backgroundStart} />
          <stop offset="52%" stopColor={palette.backgroundMid} />
          <stop offset="100%" stopColor={palette.backgroundEnd} />
        </linearGradient>
        <radialGradient id={`${idPrefix}-sun`}>
          <stop offset="0%" stopColor={palette.accent} stopOpacity={0.22} />
          <stop offset="45%" stopColor={palette.accent} stopOpacity={0.08} />
          <stop offset="100%" stopColor={palette.glow} stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect
        x={-MOSAIC_WIDTH}
        y={-MOSAIC_HEIGHT}
        width={MOSAIC_WIDTH * 3}
        height={MOSAIC_HEIGHT * 3}
        fill={`url(#${idPrefix}-base)`}
      />

      {system.stars.map((star) => (
        <circle
          key={star.key}
          cx={star.cx}
          cy={star.cy}
          r={star.radius}
          fill={star.warm ? palette.accent : "#ffffff"}
          opacity={star.warm ? 0.55 : 0.4}
        />
      ))}

      <circle cx={system.sun.cx} cy={system.sun.cy} r={system.sun.radius} fill={`url(#${idPrefix}-sun)`} />

      {system.orbits.map((orbit) => (
        <path
          key={orbit.key}
          d={orbit.path}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={orbit.opacity}
          strokeWidth={orbit.width}
        />
      ))}

      {/* Słońce bez jasnego rdzenia — na środku kafelka leży tekst, więc tylko korona. */}
      <circle
        cx={system.sun.cx}
        cy={system.sun.cy}
        r={system.sun.coreRadius * 2.6}
        fill="none"
        stroke={palette.accent}
        strokeOpacity={0.22}
        strokeWidth={1.6}
      />
      <circle
        cx={system.sun.cx}
        cy={system.sun.cy}
        r={system.sun.coreRadius * 4.4}
        fill="none"
        stroke={palette.accent}
        strokeOpacity={0.1}
        strokeWidth={1.2}
      />

      {system.bodies.map((body) => {
        if (body.tone === "belt") {
          return <circle key={body.key} cx={body.cx} cy={body.cy} r={body.radius} fill="#ffffff" opacity={0.3} />;
        }
        if (body.tone === "moon") {
          return <circle key={body.key} cx={body.cx} cy={body.cy} r={body.radius} fill={palette.accentSoft} opacity={0.5} />;
        }
        return (
          <g key={body.key}>
            <circle cx={body.cx} cy={body.cy} r={body.radius * 2.4} fill={palette.accent} opacity={0.09} />
            <circle cx={body.cx} cy={body.cy} r={body.radius} fill={palette.accentSoft} opacity={0.68} />
          </g>
        );
      })}
    </svg>
  );
};
