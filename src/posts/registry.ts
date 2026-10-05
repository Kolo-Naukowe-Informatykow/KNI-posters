import type {InstagramCompositionDefinition} from "../core/posts/InstagramPostDefinition";
import {StoryMeeting20260519Story} from "./story-meeting/story-meeting-2026-05-19.story";
import {StoryMeeting20260421Story} from "./story-meeting/story-meeting-2026-04-21.story";
import {StoryMeeting20260414Story} from "./story-meeting/story-meeting-2026-04-14.story";
import {StoryMeeting20260331Story} from "./story-meeting/story-meeting-2026-03-31.story";
import {PostTfnis20260425Post} from "./post-tfnis/post-tfnis-2026-04-25.post";
import {StoryMeeting20260528Story} from "./story-meeting/story-meeting-2026-05-28.story";
import {StoryMeeting20261006Story} from "./story-meeting/story-meeting-2026-10-06.story";
import {PostSpotkanieOrganizacyjne20261006Post} from "./post-spotkanie-organizacyjne/post-spotkanie-organizacyjne-2026-10-06.post";

export const storyRegistry = [
  new StoryMeeting20260331Story(),
  new StoryMeeting20260414Story(),
  new StoryMeeting20260421Story(),
  new StoryMeeting20260519Story(),
  new StoryMeeting20260528Story(),
  new StoryMeeting20261006Story()
];
export const postRegistry = [new PostTfnis20260425Post(), new PostSpotkanieOrganizacyjne20261006Post()];

export const compositionRegistry: InstagramCompositionDefinition<any>[] = [
  ...storyRegistry,
  ...postRegistry
];
