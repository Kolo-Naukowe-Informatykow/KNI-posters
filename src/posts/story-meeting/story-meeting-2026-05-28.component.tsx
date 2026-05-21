import type React from "react";
import {StoryMeetingTemplate, type StoryMeetingTemplateProps} from "./story-meeting-template.component";

export type StoryMeeting20260528Props = StoryMeetingTemplateProps;

export const StoryMeeting20260528: React.FC<StoryMeeting20260528Props> = ({
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

export default StoryMeeting20260528;
