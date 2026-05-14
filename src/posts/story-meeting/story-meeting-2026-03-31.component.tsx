import type React from "react";
import {StoryMeetingTemplate, type StoryMeetingTemplateProps} from "./story-meeting-template.component";

export type StoryMeeting20260331Props = StoryMeetingTemplateProps;

export const StoryMeeting20260331: React.FC<StoryMeeting20260331Props> = ({
  time,
  dateLabel,
  headline,
  locationLabel,
  locationValue,
  footer
}) => {
  return (
    <StoryMeetingTemplate
      time={time}
      dateLabel={dateLabel}
      headline={headline}
      locationLabel={locationLabel}
      locationValue={locationValue}
      footer={footer}
    />
  );
};
