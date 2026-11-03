import type React from "react";
import {AbsoluteFill, Img} from "remotion";
import logoKniTextWhite from "../../../assets/logoKNI-text-white.svg";
import {SolarSystemBackground} from "../../components/backgrounds/SolarSystemBackground";
import {formatPlDate} from "../../core/dates/plDate";
import {KNI_FONT_FAMILY} from "../../core/fonts/kniFonts";

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
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  fontWeight: 600,
  whiteSpace: "pre-line",
  color: "#e3e9ff"
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  lineHeight: 1.2,
  fontWeight: 700,
  whiteSpace: "pre-line",
  color: "#ffdbed"
};

/**
 * Bazowy, statyczny szablon postu o spotkaniu (1080x1350).
 * Układ tekstu jest zawsze ten sam, zmienia się wycinek proceduralnego tła.
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
  footer
}) => {
  const dateLabel = formatPlDate(dateISO);
  const hasTopic = Boolean(topicLabel?.trim() && topicValue?.trim());

  return (
    <AbsoluteFill
      style={{
        background: "#0b0b14",
        color: "#ffffff",
        fontFamily: KNI_FONT_FAMILY,
        overflow: "hidden"
      }}
    >
      <SolarSystemBackground shapeIndex={shapeIndex} seed={seed} />

      <div
        style={{
          position: "absolute",
          top: 86,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Img src={logoKniTextWhite} style={{width: 360, maxWidth: "100%"}} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 512,
          left: 84,
          right: 84,
          height: 330,
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
              color: "#ffdbed",
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
            background: "#ffdbed"
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
