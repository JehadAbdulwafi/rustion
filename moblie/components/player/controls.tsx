import TopControls from "./top_controls";
import BottomControls from "./bottom_controls";
import { PlayerState, animationsTypes } from "./player";

type Props = {
  playerState: PlayerState;
  methods: any;
  animations: animationsTypes;
};

export default function Controls({ playerState, methods, animations }: Props) {
  return (
    <>
      <TopControls
        hideControls={methods.hideControls}
        animations={animations}
        toggleFullscreen={methods.toggleFullscreen}
        isFullScreen={playerState.isFullScreen}
      />
      <BottomControls
        paused={playerState.paused}
        togglePlayPause={methods.togglePlayPause}
        isFullScreen={playerState.isFullScreen}
        toggleFullscreen={methods.toggleFullscreen}
        animations={animations}
      />
    </>
  );
}
