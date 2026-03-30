import {Composition} from "remotion";
import {PosterIntro, type PosterIntroProps} from "./PosterIntro";

const defaultProps: PosterIntroProps = {
  title: "KNI",
  subtitle: "Koło Naukowe Informatyki",
  date: "2026-03-30"
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PosterIntro"
        component={PosterIntro}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
