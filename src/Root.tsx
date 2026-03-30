import {Composition} from "remotion";
import {compositionRegistry} from "./posts/registry";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositionRegistry.map((post) => (
        <Composition
          key={post.id}
          id={post.id}
          component={post.component}
          durationInFrames={post.spec.durationInFrames}
          fps={post.spec.fps}
          width={post.spec.width}
          height={post.spec.height}
          defaultProps={post.defaultProps}
        />
      ))}
    </>
  );
};
