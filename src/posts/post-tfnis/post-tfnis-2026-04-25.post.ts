import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {PostTfnis20260425, type PostTfnis20260425Props} from "./post-tfnis-2026-04-25.component";
import laserGunImage from "../../../assets/TFNiS2026/laser-gun.png";
import gameScreenshotImage from "../../../assets/TFNiS2026/game-screenshot.png";
import labyrinthThinkersImage from "../../../assets/TFNiS2026/labirynt-mysliciele.png";
import labyrinthWorkImage from "../../../assets/TFNiS2026/labirynt-prace.png";

export class PostTfnis20260425Post extends InstagramPostDefinition<PostTfnis20260425Props> {
  public readonly id = "PostTFNiS-2026-04-25";

  public readonly component = PostTfnis20260425;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 280
  };

  public readonly defaultProps: PostTfnis20260425Props = {
    dateTimeLabel: "25.04.2026, 10:00-16:00",
    locationLabel: "UMK, WMiI, ul. Chopina 12/18, hol główny przed aulą",
    slides: [
      {
        title: "Pistolet świetlny",
        imageSrc: laserGunImage
      },
      {
        title: "Własna gra",
        imageSrc: gameScreenshotImage
      },
      {
        title: "Robot rozwiązujący labirynt",
        imageSrc: labyrinthThinkersImage
      },
      {
        title: "Robot rozwiązujący labirynt",
        imageSrc: labyrinthWorkImage
      }
    ]
  };
}
