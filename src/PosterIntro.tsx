import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export type PosterIntroProps = {
  title: string;
  subtitle: string;
  date: string;
};

export const PosterIntro: React.FC<PosterIntroProps> = ({title, subtitle, date}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 200
    }
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #071320 0%, #0f2a43 50%, #153f62 100%)",
        color: "#e6f2ff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Verdana, Geneva, sans-serif",
        textAlign: "center",
        padding: 80
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${0.8 + 0.2 * scale})`,
          border: "3px solid rgba(230, 242, 255, 0.35)",
          borderRadius: 36,
          padding: "64px 48px",
          background: "rgba(7, 19, 32, 0.35)",
          backdropFilter: "blur(6px)",
          width: "100%",
          maxWidth: 860
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: 2,
            textTransform: "uppercase"
          }}
        >
          {title}
        </h1>
        <p
          style={{
            marginTop: 26,
            marginBottom: 0,
            fontSize: 56,
            lineHeight: 1.2,
            opacity: 0.92
          }}
        >
          {subtitle}
        </p>
        <p
          style={{
            marginTop: 46,
            marginBottom: 0,
            fontSize: 42,
            opacity: 0.78
          }}
        >
          {date}
        </p>
      </div>
    </AbsoluteFill>
  );
};
