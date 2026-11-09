import {nextThursdayISO} from "../../core/dates/plDate";
import {InstagramPostDefinition} from "../../core/posts/InstagramPostDefinition";
import {PostSpotkanieBaseTemplate, type PostSpotkanieBaseProps} from "../post-spotkanie-base/post-spotkanie-base-template.component";

/**
 * Szablon postu o spotkaniu sekcji cyberbezpieczenstwa Redflag.
 * Godzina i sala sa tymczasowe (czwartek, 18:00, L9) — popraw je w `defaultProps`.
 */
export class PostRedflagPost extends InstagramPostDefinition<PostSpotkanieBaseProps> {
  public readonly id = "PostRedflag";

  public readonly component = PostSpotkanieBaseTemplate;

  public readonly aspectRatio = "4:5" as const;

  public readonly spec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 1
  };

  public readonly caption = `Redflag, sekcja cyberbezpieczeństwa KNI, zaprasza na cotygodniowe spotkanie. Omawiamy bezpieczeństwo aplikacji i sieci, przeglądamy podatności i robimy praktyczne zadania.

Kiedy: czwartki, 18:00
Gdzie: Wydział Matematyki i Informatyki, sala L9
Wstęp wolny, nie trzeba się zapisywać.

#KNI #cyberbezpieczenstwo #Redflag #UMK`;

  public readonly defaultProps: PostSpotkanieBaseProps = {
    shapeIndex: 0,
    seed: 1,
    dateISO: nextThursdayISO(),
    time: "18:00",
    headline: "spotkanie sekcji cyberbezpieczeństwa",
    sectionLabel: "Redflag",
    topicLabel: "Temat",
    topicValue: "",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "do zobaczenia!",
    icon: "kni-shield",
    theme: "cyber"
  };
}
