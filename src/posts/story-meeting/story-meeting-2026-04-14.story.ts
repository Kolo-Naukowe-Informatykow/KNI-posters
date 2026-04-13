import {InstagramStoryDefinition} from "../../core/posts/InstagramPostDefinition";
import {StoryMeeting20260414, type StoryMeeting20260414Props} from "./story-meeting-2026-04-14.component";

export class StoryMeeting20260414Story extends InstagramStoryDefinition<StoryMeeting20260414Props> {
  public readonly id = "StoryMeeting-2026-04-14";

  public readonly component = StoryMeeting20260414;

  public readonly defaultProps: StoryMeeting20260414Props = {
    time: "18:00",
    dateLabel: "14 kwietnia 2026",
    headline: "już jutro!",
    topicLabel: "Temat",
    topicValue: "KNI na Toruńskim Festiwalu Nauki i Sztuki",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "zapraszamy!"
  };
}