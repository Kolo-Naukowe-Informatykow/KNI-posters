import type React from "react";
import {StoryMeetingTemplate, type StoryMeetingTemplateProps} from "./story-meeting-template.component";

export type StoryMeeting20260414Props = StoryMeetingTemplateProps;

export const StoryMeeting20260414: React.FC<StoryMeeting20260414Props> = ({
  time,
  dateLabel,
  headline,
  topicLabel,
  topicValue,
  locationLabel,
  locationValue,
  footer
}) => {
  return (
    <StoryMeetingTemplate
      time={time}
      dateLabel={dateLabel}
      headline={headline}
      topicLabel={topicLabel}
      topicValue={topicValue}
      locationLabel={locationLabel}
      locationValue={locationValue}
      footer={footer}
    />
  );
};