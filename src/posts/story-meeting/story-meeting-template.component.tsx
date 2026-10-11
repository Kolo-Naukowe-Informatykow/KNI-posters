import type React from "react";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {OrbitalStarsBackground} from "../../components/backgrounds/OrbitalStarsBackground";
import {KNI_FONT_FAMILY} from "../../core/fonts/kniFonts";
import logoKniTextWhite from "../../../assets/logoKNI-text-white.svg";

export type StoryMeetingTemplateProps = {
  time: string;
  dateLabel: string;
  headline: string;
  topicLabel?: string;
  topicValue?: string;
  locationLabel: string;
  locationValue: string;
  footer: string;
  backgroundMotionIntensity?: number;
  backgroundTwinkleIntensity?: number;
};

export const meetingStars = [
  {top: "8%", left: "12%", size: 6},
  {top: "15%", left: "78%", size: 5},
  {top: "22%", left: "30%", size: 4},
  {top: "29%", left: "64%", size: 7},
  {top: "35%", left: "15%", size: 4},
  {top: "40%", left: "84%", size: 6},
  {top: "48%", left: "54%", size: 5},
  {top: "57%", left: "20%", size: 4},
  {top: "64%", left: "74%", size: 6},
  {top: "72%", left: "40%", size: 5},
  {top: "80%", left: "88%", size: 4},
  {top: "86%", left: "24%", size: 6}
];

export const StoryMeetingTemplate: React.FC<StoryMeetingTemplateProps> = ({
  time,
  dateLabel,
  headline,
  topicLabel,
  topicValue,
  locationLabel,
  locationValue,
  footer,
  backgroundMotionIntensity,
  backgroundTwinkleIntensity
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeline = frame / fps;
  const hasTopic = Boolean(topicLabel && topicValue);

  const intro = spring({
    frame,
    fps,
    config: {
      damping: hasTopic ? 170 : 180,
      stiffness: hasTopic ? 125 : 120
    }
  });

  const panelOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const infoSlide = interpolate(frame, [8, 34], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const bottomSlide = interpolate(frame, [12, 38], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const radialX = 15 + Math.sin(timeline * 0.45) * 8;
  const radialY = 20 + Math.cos(timeline * 0.32) * 7;
  const tint = (Math.sin(timeline * 0.4) + 1) / 2;
  const violetLightness = 12 + tint * 5;
  const navyLightness = 11 + tint * 4;
  const deepLightness = 7 + tint * 2;

  const animatedBackground = `radial-gradient(circle at ${radialX}% ${radialY}%, hsl(252 55% ${violetLightness}%) 0%, hsl(218 62% ${navyLightness}%) 48%, hsl(225 72% ${deepLightness}%) 100%)`;

  return (
    <AbsoluteFill
      style={{
        background: animatedBackground,
        color: "#ffffff",
        fontFamily: KNI_FONT_FAMILY,
        padding: "88px 90px 96px",
        overflow: "hidden"
      }}
    >
      <OrbitalStarsBackground
        stars={meetingStars}
        motionIntensity={backgroundMotionIntensity}
        twinkleIntensity={backgroundTwinkleIntensity}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between"
        }}
      >
        <div style={{display: "flex", justifyContent: "center"}}>
          <Img
            src={logoKniTextWhite}
            style={{
              width: 620,
              maxWidth: "100%",
              opacity: panelOpacity,
              transform: `scale(${0.92 + intro * 0.08})`
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            transform: `translateY(${infoSlide}px)`,
            opacity: panelOpacity
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 168,
              fontWeight: 800,
              lineHeight: 0.95,
              color: "#ffdbed",
              letterSpacing: 1
            }}
          >
            {time}
          </p>
          <p
            style={{
              marginTop: 38,
              marginBottom: 0,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.15
            }}
          >
            {headline}
          </p>
          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#f3f6ff"
            }}
          >
            {dateLabel}
          </p>
        </div>

        <div
          style={{
            opacity: panelOpacity,
            transform: `translateY(${bottomSlide}px)`
          }}
        >
          <div
            style={{
              width: 660,
              maxWidth: "100%",
              height: 4,
              margin: "0 auto 56px",
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
              <p
                style={{
                  margin: 0,
                  fontSize: 56,
                  fontWeight: 600,
                  color: "#e3e9ff"
                }}
              >
                {topicLabel}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 56,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#ffdbed"
                }}
              >
                {topicValue}
              </p>
            </div>
          ) : null}
          {hasTopic ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 2.4fr",
                columnGap: 24,
                alignItems: "start",
                marginTop: 28
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 56,
                  fontWeight: 600,
                  color: "#e3e9ff"
                }}
              >
                {locationLabel}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 56,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#ffdbed"
                }}
              >
                {locationValue}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 2.4fr",
                columnGap: 24,
                alignItems: "start"
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 56,
                  fontWeight: 600,
                  color: "#e3e9ff"
                }}
              >
                {locationLabel}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 56,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#ffdbed"
                }}
              >
                {locationValue}
              </p>
            </div>
          )}
          <p
            style={{
              marginTop: 88,
              marginBottom: 0,
              textAlign: "center",
              fontSize: 64,
              fontWeight: 700
            }}
          >
            {footer}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};