import TopControls from "./top_controls";
import BottomControls from "./bottom_controls";
import { PlayerState, animationsTypes } from "./player";
import PlayPause from "./play_pause";

type Props = {
  playerState: PlayerState;
  methods: any;
  animations: animationsTypes;
};

export default function Controls({ playerState, methods, animations }: Props) {
  return (
    <>
      <TopControls animations={animations} />
      {playerState.error || playerState.loading ? null : (
        <PlayPause
          togglePlayPause={methods.togglePlayPause}
          paused={playerState.paused}
          showControls={playerState.showControls}
          animations={animations}
        />

      )}

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
