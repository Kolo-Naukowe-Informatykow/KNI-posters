import {InstagramStoryDefinition} from "../../core/posts/InstagramPostDefinition";
import {StoryMeeting20260331, type StoryMeeting20260331Props} from "./story-meeting-2026-03-31.component";

export class StoryMeeting20260331Story extends InstagramStoryDefinition<StoryMeeting20260331Props> {
  public readonly id = "StoryMeeting-2026-03-31";

  public readonly component = StoryMeeting20260331;

  public readonly defaultProps: StoryMeeting20260331Props = {
    time: "18:00",
    dateLabel: "31 marca 2026",
    headline: "już jutro spotkanie koła!",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "zapraszamy!"
  };
}
