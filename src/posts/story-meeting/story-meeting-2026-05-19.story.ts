import {InstagramStoryDefinition} from "../../core/posts/InstagramPostDefinition";
import {StoryMeeting20260519, type StoryMeeting20260519Props} from "./story-meeting-2026-05-19.component";

export class StoryMeeting20260519Story extends InstagramStoryDefinition<StoryMeeting20260519Props> {
  public readonly id = "StoryMeeting-2026-05-19";

  public readonly component = StoryMeeting20260519;

  public readonly defaultProps: StoryMeeting20260519Props = {
    time: "18:00",
    dateLabel: "19 maja 2026",
    headline: "w najbliższy wtorek!",
    topicLabel: "Temat",
    topicValue: "Przyszłość pracy informatyka - oparte o konferencję AGH IT Future Day",
    locationLabel: "gdzie?",
    locationValue: "Wydział Matematyki\ni Informatyki, sala L9",
    footer: "zapraszamy!"
  };
}