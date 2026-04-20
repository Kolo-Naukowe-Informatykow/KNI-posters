import type {InstagramCompositionDefinition} from "../core/posts/InstagramPostDefinition";
import {StoryMeeting20260421Story} from "./story-meeting/story-meeting-2026-04-21.story";
import {StoryMeeting20260414Story} from "./story-meeting/story-meeting-2026-04-14.story";
import {StoryMeeting20260331Story} from "./story-meeting/story-meeting-2026-03-31.story";

export const storyRegistry = [new StoryMeeting20260331Story(), new StoryMeeting20260414Story(), new StoryMeeting20260421Story()];

export const compositionRegistry: InstagramCompositionDefinition<any>[] = [
  ...storyRegistry
];
