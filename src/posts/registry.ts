import type {InstagramCompositionDefinition} from "../core/posts/InstagramPostDefinition";
import {PostTfnis20260425Post} from "./post-tfnis/post-tfnis-2026-04-25.post";
import {PostSpotkanieBasePost} from "./post-spotkanie-base/post-spotkanie-base.post";
import {PostSekcjaRobotykaPost} from "./post-sekcja-robotyka/post-sekcja-robotyka-template.post";
import {PostSekcjaOgolnaPost} from "./post-sekcja-ogolna/post-sekcja-ogolna-template.post";
import {PostSekcjaGamedevPost} from "./post-sekcja-gamedev/post-sekcja-gamedev-template.post";
import {PostRedflagPost} from "./post-redflag/post-redflag-template.post";

export const postRegistry = [
  new PostSpotkanieBasePost(),
  new PostSekcjaOgolnaPost(),
  new PostSekcjaRobotykaPost(),
  new PostSekcjaGamedevPost(),
  new PostRedflagPost(),
  new PostTfnis20260425Post()
];

export const compositionRegistry: InstagramCompositionDefinition<any>[] = [...postRegistry];
