import {InstagramStoryDefinition} from "../../core/posts/InstagramPostDefinition";
import {StoryMeeting20260528, type StoryMeeting20260528Props} from "./story-meeting-2026-05-28.component";

export class StoryMeeting20260528Story extends InstagramStoryDefinition<StoryMeeting20260528Props> {
  public readonly id = "StoryMeeting-2026-05-28";

  public readonly component = StoryMeeting20260528;

  public readonly defaultProps: StoryMeeting20260528Props = {
    time: "18:00",
    dateLabel: "28 maja 2026",
    headline: "spotkanie specjalne w Toruńskim Laboratorium Miejskim!",
    topicLabel: "Temat",
    topicValue: "Speedrunning Minecraft",
    locationLabel: "gdzie?",
    locationValue: "TLM, ul. Bydgoska 52",
    footer: "serdecznie zapraszamy!",
    backgroundMotionIntensity: 0.8,
    backgroundTwinkleIntensity: 0.6
  };
}
