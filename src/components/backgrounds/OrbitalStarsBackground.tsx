import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";

type StarSpec = {
  top: string;
  left: string;
  size: number;
};

export type OrbitalStarsBackgroundProps = {
  stars: StarSpec[];
  motionIntensity?: number;
  twinkleIntensity?: number;
};

export const OrbitalStarsBackground: React.FC<OrbitalStarsBackgroundProps> = ({
  stars,
  motionIntensity = 1,
  twinkleIntensity = 1
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;

  return (
    <>
      {stars.map((star, index) => {
        const intro = interpolate(frame, [index * 2, 20 + index * 2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });

        const basePhase = index * 0.72;
        const radiusX = (2.8 + (index % 4) * 1.5) * motionIntensity;
        const radiusY = (2.2 + (index % 5) * 1.25) * motionIntensity;
        const speed = (0.62 + (index % 4) * 0.12) * (0.85 + motionIntensity * 0.2);

        const orbitX = Math.cos(time * speed + basePhase) * radiusX;
        const orbitY = Math.sin(time * speed + basePhase) * radiusY;
        const driftX = Math.sin(time * 0.35 + basePhase) * 1.45 * motionIntensity;
        const driftY = Math.cos(time * 0.28 + basePhase) * 1.2 * motionIntensity;
        const twinkle = 0.54 + ((Math.sin(time * 2.4 * (0.9 + twinkleIntensity * 0.2) + basePhase) + 1) / 2) * (0.36 * twinkleIntensity);
        const scale = 0.95 + ((Math.sin(time * 1.9 + basePhase) + 1) / 2) * 0.3;
        const starColor = index % 3 === 0 ? "#ffdbed" : "#ffffff";

        return (
          <div
            key={`${star.top}-${star.left}`}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              background: starColor,
              opacity: Math.min(1, twinkle * intro),
              transform: `translate(${orbitX + driftX}px, ${orbitY + driftY}px) scale(${scale})`,
              boxShadow: `0 0 ${3 + star.size * 0.45}px ${starColor}`,
              willChange: "transform, opacity"
            }}
          />
        );
      })}
    </>
  );
};
