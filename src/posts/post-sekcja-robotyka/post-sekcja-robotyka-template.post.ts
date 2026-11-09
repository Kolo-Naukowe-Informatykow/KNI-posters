import {nextMondayISO} from "../../core/dates/plDate";
import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {PostSpotkanieBaseTemplate, type PostSpotkanieBaseProps} from "../post-spotkanie-base/post-spotkanie-base-template.component";

/**
 * Szablon postu o cotygodniowym spotkaniu sekcji robotyki (poniedziałki, 18:00, L15).
 * Nowe materialy kopiuja te definicje, zmieniajac `id`, teksty, `dateISO`, `shapeIndex` i `seed`.
 */
export class PostSekcjaRobotykaPost extends InstagramPostDefinition<PostSpotkanieBaseProps> {
  public readonly id = "PostSekcjaRobotyka";

  public readonly component = PostSpotkanieBaseTemplate;

  public readonly aspectRatio = "4:5" as const;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 1
  };

  public readonly caption = `Sekcja robotyki KNI zaprasza na cotygodniowe spotkanie. Pracujemy nad własnymi konstrukcjami, omawiamy tematy i dzielimy się tym, co komu wyszło.

Kiedy: poniedziałki, 18:00
Gdzie: Wydział Matematyki i Informatyki, sala L15
Wstęp wolny, nie trzeba się zapisywać.

#KNI #robotyka #UMK`;

  public readonly defaultProps: PostSpotkanieBaseProps = {
    shapeIndex: 0,
    seed: 1,
    dateISO: nextMondayISO(),
    time: "18:00",
    headline: "spotkanie sekcji robotyki",
    sectionLabel: "Sekcja robotyki",
    topicLabel: "Temat",
    topicValue: "",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L15",
    footer: "do zobaczenia!",
    icon: "kni-robot",
    theme: "robotics"
  };
}
