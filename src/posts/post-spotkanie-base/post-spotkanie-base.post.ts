import {nextTuesdayISO} from "../../core/dates/plDate";
import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {PostSpotkanieBaseTemplate, type PostSpotkanieBaseProps} from "./post-spotkanie-base-template.component";

/**
 * Bazowy szablon postu o spotkaniu. Nowe materialy kopiuja te definicje,
 * zmieniajac `id`, teksty, `dateISO`, `shapeIndex` i `seed`.
 */
export class PostSpotkanieBasePost extends InstagramPostDefinition<PostSpotkanieBaseProps> {
  public readonly id = "PostSpotkanieBase";

  public readonly component = PostSpotkanieBaseTemplate;

  public readonly aspectRatio = "4:5" as const;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 1
  };

  public readonly defaultProps: PostSpotkanieBaseProps = {
    shapeIndex: 0,
    seed: 1,
    dateISO: nextTuesdayISO(),
    time: "18:00",
    headline: "zapraszamy na cotygodniowe spotkanie KNI",
    topicLabel: "Temat",
    topicValue: "Spotkanie organizacyjne",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "do zobaczenia!"
  };
}
