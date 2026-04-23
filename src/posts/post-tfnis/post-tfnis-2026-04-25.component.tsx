import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import logoKniWhite from "../../../assets/logoKNI-white.svg";
import logoTfnis from "../../../assets/TFNiS2026/TFNiS-logo-text.png";

export type PostTfnisSlide = {
  title: string;
  imageSrc: string;
};

export type PostTfnis20260425Props = {
  dateTimeLabel: string;
  locationLabel: string;
  slides: PostTfnisSlide[];
};

const getSlideIndex = (frame: number, slideDuration: number, slideCount: number): number => {
  const raw = Math.floor(frame / slideDuration);
  return Math.min(raw, slideCount - 1);
};

const CalendarIcon: React.FC = () => (
  <svg width="84" height="84" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="#ffffff" strokeWidth="2.6" />
    <line x1="7.5" y1="3.5" x2="7.5" y2="7.5" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="16.5" y1="3.5" x2="16.5" y2="7.5" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="3.5" y1="10" x2="20.5" y2="10" stroke="#ffffff" strokeWidth="2.6" />
  </svg>
);

const PinIcon: React.FC = () => (
  <svg width="84" height="84" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 21C12 21 18.5 14.5 18.5 10.25C18.5 6.8 15.7 4 12.25 4C8.8 4 6 6.8 6 10.25C6 14.5 12 21 12 21Z"
      stroke="#ffffff"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12.25" cy="10" r="2.6" fill="#ffffff" />
  </svg>
);

export const PostTfnis20260425: React.FC<PostTfnis20260425Props> = ({dateTimeLabel, locationLabel, slides}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const slideDuration = Math.max(1, Math.floor(durationInFrames / slides.length));
  const slideIndex = getSlideIndex(frame, slideDuration, slides.length);
  const slide = slides[slideIndex];
  const localFrame = frame - slideIndex * slideDuration;

  const contentOpacity = interpolate(localFrame, [0, 8, slideDuration - 8, slideDuration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const contentY = interpolate(localFrame, [0, 14], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        color: "#ffffff",
        fontFamily: "Trebuchet MS, Segoe UI, sans-serif",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            background: "#e20c62",
            width: "100%",
            height: 128
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 5fr",
            width: "100%",
            minHeight: 156
          }}
        >
          <div
            style={{
              background: "#91be25",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "8px 12px",
              fontWeight: 900,
              fontSize: 30,
              lineHeight: 1.1,
              textAlign: "center"
            }}
          >
            <CalendarIcon />
            <span>{dateTimeLabel}</span>
          </div>

          <div
            style={{
              background: "#019e97",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "8px 24px",
              fontWeight: 900,
              fontSize: 40,
              lineHeight: 1.05,
              
            }}
          >
            <PinIcon />
            <span>{locationLabel}</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: "#1b1b1b",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Img
            src={slide.imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: contentOpacity,
              transform: `translateY(${contentY}px)`
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            alignItems: "stretch",
            minHeight: 256
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Img
              src={logoTfnis}
              style={{
                width: "100%",
                height: 200,
                objectFit: "contain"
              }}
            />
          </div>
          <div
            style={{
              background: "#e20c62",
              padding: "10px 18px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <Img
              src={logoKniWhite}
              style={{
                width: 200,
                height: 200,
                objectFit: "contain"
              }}
            />
            <p
              style={{
                margin: "0 0 0 16px",
                fontSize: 38,
                fontWeight: 900,
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: "#ffffff"
              }}
            >
              {slide.title}
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
