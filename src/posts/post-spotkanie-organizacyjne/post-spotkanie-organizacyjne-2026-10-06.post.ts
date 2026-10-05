import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {
  PostSpotkanieOrganizacyjne20261006,
  type PostSpotkanieOrganizacyjne20261006Props
} from "./post-spotkanie-organizacyjne-2026-10-06.component";

export class PostSpotkanieOrganizacyjne20261006Post extends InstagramPostDefinition<PostSpotkanieOrganizacyjne20261006Props> {
  public readonly id = "PostSpotkanieOrganizacyjne-2026-10-06";

  public readonly component = PostSpotkanieOrganizacyjne20261006;

  public readonly aspectRatio = "4:5" as const;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 240
  };

  public readonly caption = [
    "Wracamy! Startujemy nowy rok akademicki 2026/27 i zapraszamy na pierwsze, organizacyjne spotkanie Koła Naukowego Informatyków.",
    "",
    "To spotkanie rozpoczyna cykl cotygodniowych spotkań — od teraz widzimy się w każdy wtorek o 18:00.",
    "",
    "Kiedy: wtorek, 6 października 2026, godz. 18:00",
    "Gdzie: Wydział Matematyki i Informatyki UMK, sala L9",
    "",
    "W planach sprawy organizacyjne koła, plany na semestr i luźne rozmowy o projektach. Jeśli zaczynasz studia albo szukasz ludzi do wspólnego kodowania — wpadnij, nie trzeba się zapisywać ani nic umieć na start.",
    "",
    "Do zobaczenia we wtorek!",
    "",
    "#KNI #UMK #informatyka #Toruń #studia"
  ].join("\n");

  public readonly defaultProps: PostSpotkanieOrganizacyjne20261006Props = {
    time: "18:00",
    dateLabel: "6 października 2026",
    headline: "już jutro pierwsze spotkanie w nowym roku akademickim!",
    topicLabel: "Temat",
    topicValue: "Spotkanie organizacyjne",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "do zobaczenia!",
    backgroundMotionIntensity: 1.1,
    backgroundTwinkleIntensity: 0.85
  };
}
