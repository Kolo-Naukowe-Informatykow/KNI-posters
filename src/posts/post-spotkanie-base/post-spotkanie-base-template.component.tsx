import type React from "react";
import {AbsoluteFill, Img} from "remotion";
import logoKniTextWhite from "../../../assets/logoKNI-text-white.svg";
import {SolarSystemBackground} from "../../components/backgrounds/SolarSystemBackground";
import {TopicIcon, type TopicIconName} from "../../components/icons/TopicIcon";
import {formatPlDate} from "../../core/dates/plDate";
import {KNI_FONT_FAMILY} from "../../core/fonts/kniFonts";
import {resolvePostTheme, type PostThemeName} from "../../core/posts/postThemes";

export type PostSpotkanieBaseProps = {
  /** Kafelek mozaiki 0-8 — 9 postów tworzy jeden układ w siatce Instagrama. */
  shapeIndex: number;
  /** Ziarno generatora tła: ten sam seed = ten sam układ słoneczny. */
  seed: number;
  /** Data w formacie `YYYY-MM-DD`; na plakacie pojawia się jako `3 października 2026`. */
  dateISO: string;
  time: string;
  headline: string;
  topicLabel?: string;
  topicValue?: string;
  locationLabel: string;
  locationValue: string;
  footer: string;
  /** Jednokolorowa ikona tematu w lewym górnym rogu. */
  icon?: TopicIconName;
  /** Paleta kolorów — osobne kolory dla spotkań sekcji. */
  theme?: PostThemeName;
  /** Nagłówek sekcji pod logo, np. `Sekcja robotyki` albo `Redflag`. */
  sectionLabel?: string;
};

/**
 * Bazowy, statyczny szablon postu o spotkaniu (1080x1350).
 * Układ tekstu jest zawsze ten sam, zmienia się wycinek proceduralnego tła,
 * ikona tematu i paleta kolorów sekcji.
 */
export const PostSpotkanieBaseTemplate: React.FC<PostSpotkanieBaseProps> = ({
  shapeIndex,
  seed,
  dateISO,
  time,
  headline,
  topicLabel,
  topicValue,
  locationLabel,
  locationValue,
  footer,
  icon = "kni-chat",
  theme: themeName,
  sectionLabel
}) => {
  const dateLabel = formatPlDate(dateISO);
  const hasTopic = Boolean(topicLabel?.trim() && topicValue?.trim());
  const theme = resolvePostTheme(themeName);

  const labelStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    fontWeight: 600,
    whiteSpace: "pre-line",
    color: theme.accentSoft
  };

  const valueStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 700,
    whiteSpace: "pre-line",
    color: theme.accent
  };

  return (
    <AbsoluteFill
      style={{
        background: theme.backgroundEnd,
        color: "#ffffff",
        fontFamily: KNI_FONT_FAMILY,
        overflow: "hidden"
      }}
    >
      <SolarSystemBackground shapeIndex={shapeIndex} seed={seed} palette={theme} />

      <div style={{position: "absolute", top: 74, left: 68}}>
        <TopicIcon name={icon} size={156} color={theme.accent} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 74,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Img src={logoKniTextWhite} style={{width: 440, maxWidth: "100%"}} />
      </div>

      {sectionLabel?.trim() ? (
        <div
          style={{
            position: "absolute",
            top: 444,
            left: 84,
            right: 84,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <span
            style={{
              padding: "12px 34px",
              border: `2px solid ${theme.glow}`,
              borderRadius: 999,
              backgroundColor: `${theme.glow}22`,
              color: theme.accent,
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: 1.5,
              whiteSpace: "nowrap"
            }}
          >
            {sectionLabel}
          </span>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          top: 512,
          left: 84,
          right: 84,
          height: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        {time ? (
          <p
            style={{
              margin: 0,
              fontSize: 138,
              fontWeight: 800,
              lineHeight: 0.95,
              color: theme.accent,
              letterSpacing: 1
            }}
          >
            {time}
          </p>
        ) : null}
        {headline ? (
          <p
            style={{
              margin: time ? "28px 0 0" : 0,
              fontSize: 50,
              fontWeight: 700,
              lineHeight: 1.15,
              whiteSpace: "pre-line"
            }}
          >
            {headline}
          </p>
        ) : null}
        {dateLabel ? (
          <p
            style={{
              margin: time || headline ? "10px 0 0" : 0,
              fontSize: 44,
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#f3f6ff"
            }}
          >
            {dateLabel}
          </p>
        ) : null}
      </div>

      <div style={{position: "absolute", left: 84, right: 84, bottom: 150}}>
        <div
          style={{
            width: 480,
            maxWidth: "100%",
            height: 4,
            margin: "0 auto 40px",
            borderRadius: 999,
            background: theme.accent
          }}
        />
        {hasTopic ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 2.4fr",
              columnGap: 24,
              alignItems: "start"
            }}
          >
            <p style={labelStyle}>{topicLabel}</p>
            <p style={valueStyle}>{topicValue}</p>
          </div>
        ) : null}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 2.4fr",
            columnGap: 24,
            alignItems: "start",
            marginTop: hasTopic ? 24 : 0
          }}
        >
          <p style={labelStyle}>{locationLabel}</p>
          <p style={valueStyle}>{locationValue}</p>
        </div>
        {footer ? (
          <p
            style={{
              margin: "52px 0 0",
              textAlign: "center",
              fontSize: 48,
              fontWeight: 700,
              whiteSpace: "pre-line"
            }}
          >
            {footer}
          </p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export default PostSpotkanieBaseTemplate;
