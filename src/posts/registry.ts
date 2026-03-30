import type {InstagramCompositionDefinition} from "../core/posts/InstagramPostDefinition";
import {StoryMeeting20260331Story} from "./story-meeting/story-meeting-2026-03-31.story";

export const storyRegistry = [new StoryMeeting20260331Story()];

export const compositionRegistry: InstagramCompositionDefinition<Record<string, unknown>>[] = [
  ...storyRegistry
];
