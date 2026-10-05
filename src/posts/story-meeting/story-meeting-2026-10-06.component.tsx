import type React from "react";
import {StoryMeetingTemplate, type StoryMeetingTemplateProps} from "./story-meeting-template.component";

export type StoryMeeting20261006Props = StoryMeetingTemplateProps;

export const StoryMeeting20261006: React.FC<StoryMeeting20261006Props> = ({
  time,
  dateLabel,
  headline,
  topicLabel,
  topicValue,
  locationLabel,
  locationValue,
  footer,
  backgroundMotionIntensity,
  backgroundTwinkleIntensity
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
      backgroundMotionIntensity={backgroundMotionIntensity}
      backgroundTwinkleIntensity={backgroundTwinkleIntensity}
    />
  );
};

export default StoryMeeting20261006;
