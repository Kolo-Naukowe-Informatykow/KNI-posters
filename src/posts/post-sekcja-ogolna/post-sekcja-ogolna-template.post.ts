import {nextTuesdayISO} from "../../core/dates/plDate";
import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {PostSpotkanieBaseTemplate, type PostSpotkanieBaseProps} from "../post-spotkanie-base/post-spotkanie-base-template.component";

/**
 * Szablon postu o cotygodniowym spotkaniu ogolnym KNI (wtorki, 18:00, L9).
 * Nowe materialy kopiuja te definicje, zmieniajac `id`, teksty, `dateISO`, `shapeIndex` i `seed`.
 */
export class PostSekcjaOgolnaPost extends InstagramPostDefinition<PostSpotkanieBaseProps> {
  public readonly id = "PostSekcjaOgolna";

  public readonly component = PostSpotkanieBaseTemplate;

  public readonly aspectRatio = "4:5" as const;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 1
  };

  public readonly caption = `Cotygodniowe spotkanie ogólne Koła Naukowego Informatyków. Prezentacja tematu, krótka dyskusja i sprawy organizacyjne.

Kiedy: wtorki, 18:00
Gdzie: Wydział Matematyki i Informatyki, sala L9
Wstęp wolny, nie trzeba się zapisywać.

#KNI #informatyka #UMK`;

  public readonly defaultProps: PostSpotkanieBaseProps = {
    shapeIndex: 0,
    seed: 1,
    dateISO: nextTuesdayISO(),
    time: "18:00",
    headline: "cotygodniowe spotkanie ogólne KNI",
    sectionLabel: "",
    topicLabel: "Temat",
    topicValue: "Temat tygodnia",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "do zobaczenia!",
    icon: "kni-chat",
    theme: "general"
  };
}
