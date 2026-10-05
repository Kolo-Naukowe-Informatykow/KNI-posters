import {InstagramStoryDefinition} from "../../core/posts/InstagramPostDefinition";
import {StoryMeeting20261006, type StoryMeeting20261006Props} from "./story-meeting-2026-10-06.component";

export class StoryMeeting20261006Story extends InstagramStoryDefinition<StoryMeeting20261006Props> {
  public readonly id = "StoryMeeting-2026-10-06";

  public readonly component = StoryMeeting20261006;

  public readonly defaultProps: StoryMeeting20261006Props = {
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
