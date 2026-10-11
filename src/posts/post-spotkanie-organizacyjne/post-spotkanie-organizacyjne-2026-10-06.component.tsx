import type React from "react";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {OrbitalStarsBackground} from "../../components/backgrounds/OrbitalStarsBackground";
import {KNI_FONT_FAMILY} from "../../core/fonts/kniFonts";
import {meetingStars, type StoryMeetingTemplateProps} from "../story-meeting/story-meeting-template.component";
import logoKniTextWhite from "../../../assets/logoKNI-text-white.svg";

export type PostSpotkanieOrganizacyjne20261006Props = StoryMeetingTemplateProps;

export const PostSpotkanieOrganizacyjne20261006: React.FC<PostSpotkanieOrganizacyjne20261006Props> = ({
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

  const infoSlide = interpolate(frame, [8, 34], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const bottomSlide = interpolate(frame, [12, 38], [40, 0], {
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
        padding: "72px 84px 80px",
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
              width: 420,
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
              fontSize: 138,
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
              marginTop: 28,
              marginBottom: 0,
              fontSize: 50,
              fontWeight: 700,
              lineHeight: 1.15
            }}
          >
            {headline}
          </p>
          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              fontSize: 44,
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
              width: 480,
              maxWidth: "100%",
              height: 4,
              margin: "0 auto 42px",
              borderRadius: 999,
              background: "#ffdbed"
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 2.4fr",
              columnGap: 24,
              alignItems: "start"
            }}
          >
            <p style={{margin: 0, fontSize: 44, fontWeight: 600, color: "#e3e9ff"}}>{topicLabel}</p>
            <p style={{margin: 0, fontSize: 44, lineHeight: 1.2, fontWeight: 700, color: "#ffdbed"}}>
              {topicValue}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 2.4fr",
              columnGap: 24,
              alignItems: "start",
              marginTop: 24
            }}
          >
            <p style={{margin: 0, fontSize: 44, fontWeight: 600, color: "#e3e9ff"}}>{locationLabel}</p>
            <p style={{margin: 0, fontSize: 44, lineHeight: 1.2, fontWeight: 700, color: "#ffdbed"}}>
              {locationValue}
            </p>
          </div>
          <p
            style={{
              marginTop: 58,
              marginBottom: 0,
              textAlign: "center",
              fontSize: 48,
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

export default PostSpotkanieOrganizacyjne20261006;
