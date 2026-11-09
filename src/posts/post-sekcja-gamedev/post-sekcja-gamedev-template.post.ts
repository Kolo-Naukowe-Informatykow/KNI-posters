import {nextWednesdayISO} from "../../core/dates/plDate";
import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {PostSpotkanieBaseTemplate, type PostSpotkanieBaseProps} from "../post-spotkanie-base/post-spotkanie-base-template.component";

/**
 * Szablon postu o spotkaniu sekcji gamedev.
 * Godzina i sala sa tymczasowe (sroda, 18:00, L9) — popraw je w `defaultProps`.
 */
export class PostSekcjaGamedevPost extends InstagramPostDefinition<PostSpotkanieBaseProps> {
  public readonly id = "PostSekcjaGamedev";

  public readonly component = PostSpotkanieBaseTemplate;

  public readonly aspectRatio = "4:5" as const;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 1
  };

  public readonly caption = `Sekcja gamedev KNI zaprasza na cotygodniowe spotkanie. Robimy własne gry, testujemy prototypy i dzielimy się tym, co komu wyszło.

Kiedy: środy, 18:00
Gdzie: Wydział Matematyki i Informatyki, sala L9
Wstęp wolny, nie trzeba się zapisywać.

#KNI #gamedev #UMK`;

  public readonly defaultProps: PostSpotkanieBaseProps = {
    shapeIndex: 0,
    seed: 1,
    dateISO: nextWednesdayISO(),
    time: "18:00",
    headline: "spotkanie sekcji gamedev",
    sectionLabel: "Gamedev",
    topicLabel: "Temat",
    topicValue: "",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "do zobaczenia!",
    icon: "kni-gamedev",
    theme: "gamedev"
  };
}
