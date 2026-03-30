import type React from "react";

export type InstagramCompositionSpec = {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

export type InstagramCarouselItem = {
  id: string;
  type: "image" | "video";
  source: string;
  durationInFrames?: number;
};

export abstract class InstagramCompositionDefinition<TProps extends Record<string, unknown>> {
  public abstract readonly id: string;

  public abstract readonly component: React.ComponentType<TProps>;

  public abstract readonly defaultProps: TProps;

  public readonly spec: InstagramCompositionSpec = {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 240
  };
}

export abstract class InstagramStoryDefinition<TProps extends Record<string, unknown>> extends InstagramCompositionDefinition<TProps> {
  public readonly format = "story" as const;

  public readonly spec: InstagramCompositionSpec = {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 240
  };
}

export abstract class InstagramPostDefinition<TProps extends Record<string, unknown>> extends InstagramCompositionDefinition<TProps> {
  public readonly format = "post" as const;

  public readonly aspectRatio: "1:1" | "4:5" | "16:9" = "4:5";

  public readonly carouselItems: InstagramCarouselItem[] = [];

  public readonly spec: InstagramCompositionSpec = {
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 180
  };
}
