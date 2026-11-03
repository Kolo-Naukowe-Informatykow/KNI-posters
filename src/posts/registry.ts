import type {InstagramCompositionDefinition} from "../core/posts/InstagramPostDefinition";
import {PostTfnis20260425Post} from "./post-tfnis/post-tfnis-2026-04-25.post";
import {PostSpotkanieBasePost} from "./post-spotkanie-base/post-spotkanie-base.post";

export const postRegistry = [new PostSpotkanieBasePost(), new PostTfnis20260425Post()];

export const compositionRegistry: InstagramCompositionDefinition<any>[] = [...postRegistry];
