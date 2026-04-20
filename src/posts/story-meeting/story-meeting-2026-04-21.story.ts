import {InstagramStoryDefinition} from "../../core/posts/InstagramPostDefinition";
import {StoryMeeting20260421, type StoryMeeting20260421Props} from "./story-meeting-2026-04-21.component";

export class StoryMeeting20260421Story extends InstagramStoryDefinition<StoryMeeting20260421Props> {
  public readonly id = "StoryMeeting-2026-04-21";

  public readonly component = StoryMeeting20260421;

  public readonly defaultProps: StoryMeeting20260421Props = {
    time: "18:00",
    dateLabel: "21 kwietnia 2026",
    headline: "jutro spotkanie koła!",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "widzimy się!"
  };
}