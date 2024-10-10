import React, { useEffect, useRef, useState } from "react";
import Video, { VideoRef } from "react-native-video";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  View,
  PanResponderInstance,
  Easing,
  Dimensions,
} from "react-native";
import Controls from "./controls";

export interface ConfigTypes {
  controlTimeoutDelay: number;
  volumePanResponder: PanResponderInstance | undefined;
  controlTimeout: NodeJS.Timeout | null | undefined;
  tapActionTimeout: NodeJS.Timeout | null;
  volumeWidth: number;
  iconOffset: number;
  tapAnywhereToPause: boolean;
}

type PlayerProps = {
  toggleResizeModeOnFullscreen?: boolean;
  controlAnimationTiming?: number;
  doubleTapTime?: number;
  playInBackground?: boolean;
  playWhenInactive?: boolean;
  resizeMode?: "contain" | "cover" | "none" | "stretch";
  isFullScreen?: boolean;
  showOnStart?: boolean;
  paused?: boolean;
  muted?: boolean;
  volume?: number;
  rate?: number;
  showTimeRemaining?: boolean;
  showHours?: boolean;
  onBack?: () => void;
  onEnd?: () => void;
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
  onShowControls?: () => void;
  onHideControls?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  toggleFullscreen?: () => void;
  source: any;
  title: string;
  repeat: boolean;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export type PlayerState = {
  resizeMode: "contain" | "cover" | "none" | "stretch";
  paused: boolean;
  muted: boolean;
  volume: number;
  rate: number;

  isFullScreen: boolean;
  volumeTrackWidth: number;
  volumeFillWidth: number;
  showControls: boolean;
  volumePosition: number;
  volumeOffset: number;
  originallyPaused: boolean;
  loading: boolean;
  error: boolean;
};

export type animationsTypes = {
  bottomControl: {
    marginBottom: Animated.Value;
    opacity: Animated.Value;
  };
  topControl: {
    marginTop: Animated.Value;
    opacity: Animated.Value;
  };
  video: {
    opacity: Animated.Value;
  };
  loader: {
    rotate: Animated.Value;
    MAX_VALUE: number;
  };
};

const defaultProps = {
  toggleResizeModeOnFullscreen: false,
  controlAnimationTiming: 500,
  doubleTapTime: 130,
  playInBackground: false,
  playWhenInactive: false,
  resizeMode: "contain",
  isFullScreen: null,
  showOnStart: true,
  paused: false,
  repeat: false,
  muted: false,
  volume: 1,
  title: "dsaf",
  rate: 1,
  showTimeRemaining: true,
  showHours: false,
};

export const VideoPlayer = (props: PlayerProps) => {
  const playerRef = useRef<VideoRef | null>(null); // Ensure the ref type matches VideoRef
  const [mounted, setmounted] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    // Video
    resizeMode: props.resizeMode || "contain",
    paused: props.paused || false,
    muted: props.muted || false,
    volume: props.volume || 1,
    rate: props.rate || 1,

    // Controls
    isFullScreen: props.isFullScreen || false,
    volumeTrackWidth: 0,
    volumeFillWidth: 0,
    showControls: props.showOnStart || true,
    volumePosition: 0,
    volumeOffset: 0,
    originallyPaused: false,
    loading: false,
    error: false,
  });

  const configRef = useRef<ConfigTypes>({
    controlTimeoutDelay: 4000,
    volumePanResponder: undefined,
    controlTimeout: null,
    tapActionTimeout: null,
    volumeWidth: 150,
    iconOffset: 0,
    tapAnywhereToPause: false,
  });

  const events = {
    onError: onError,
    onBack: props.onBack,
    onEnd: props.onEnd,
    onScreenTouch: onScreenTouch,
    onEnterFullscreen: props.onEnterFullscreen,
    onExitFullscreen: props.onExitFullscreen,
    onShowControls: props.onShowControls,
    onHideControls: props.onHideControls,
    onLoadStart: onLoadStart,
    onLoad: onLoad,
    onPause: props.onPause,
    onPlay: props.onPlay,
  };

  const initialValue = props.showOnStart ? 1 : 0;

  const controlAnimationTiming = 500;
  const doubleTapTime = 130;

  const animations = useRef({
    bottomControl: {
      marginBottom: new Animated.Value(0),
      opacity: new Animated.Value(initialValue),
    },
    topControl: {
      marginTop: new Animated.Value(0),
      opacity: new Animated.Value(initialValue),
    },
    video: {
      opacity: new Animated.Value(1),
    },
    loader: {
      rotate: new Animated.Value(0),
      MAX_VALUE: 360,
    },
  });
  /**
   * Functions used throughout the application
   */
  const methods = {
    toggleFullscreen: props.toggleFullscreen,
    togglePlayPause: togglePlayPause,
    toggleControls: toggleControls,
    hideControls: hideControls,
  };

  useEffect(() => {
    setPlayerState((prev) => ({
      ...prev,
      isFullScreen: props.isFullScreen || false,
    }));

    () => {
      setmounted(false);
      clearControlTimeout();
    };
  }, [props.isFullScreen]);

  /**
    | -------------------------------------------------------
    | Events
    | -------------------------------------------------------
    |
    | These are the events that the <Video> component uses
    | and can be overridden by assigning it as a prop.
    | It is suggested that you override onEnd.
    |
    *
  
  /**
   * When load starts we display a loading icon
   * and show the controls.
   */
  function onLoadStart() {
    setPlayerState((prev) => ({ ...prev, loading: true }));
  }

  function onLoad() {
    setPlayerState((prev) => ({ ...prev, loading: false }));
    if (playerState.showControls) {
      setControlTimeout();
    }
  }

  function onError() {
    setPlayerState((prev) => ({ ...prev, loading: false, error: true }));
  }

  /**
   * This is a single and double tap listener
   * when the user taps the screen anywhere.
   * One tap toggles controls and/or toggles pause,
   * two toggles fullscreen mode.
   */
  function onScreenTouch() {
    const config = configRef.current;
    if (config.tapActionTimeout) {
      clearTimeout(config.tapActionTimeout);
      config.tapActionTimeout = null;
      methods.toggleFullscreen?.();
      if (playerState.showControls) {
        resetControlTimeout();
      }
    } else {
      config.tapActionTimeout = setTimeout(() => {
        if (config.tapAnywhereToPause && playerState.showControls) {
          methods.togglePlayPause();
          resetControlTimeout();
        } else {
          methods.toggleControls();
        }
        config.tapActionTimeout = null;
      }, doubleTapTime);
    }
  }

  /**
    | -------------------------------------------------------
    | Methods
    | -------------------------------------------------------
    |
    | These are all of our functions that interact with
    | various parts of the class. Anything from
    | calculating time remaining in a video
    | to handling control operations.
    |
    */

  /**
   * Set a timeout when the controls are shown
   * that hides them after a length of time.
   * Default is 15s
   */
  function setControlTimeout() {
    const config = configRef.current;
    config.controlTimeout = setTimeout(() => {
      hideControls();
    }, config.controlTimeoutDelay);
  }

  /**
   * Clear the hide controls timeout.
   */
  function clearControlTimeout() {
    const config = configRef.current;
    clearTimeout(config.controlTimeout!);
  }

  /**
   * Reset the timer completely
   */
  function resetControlTimeout() {
    clearControlTimeout();
    setControlTimeout();
  }

  /**
   * Animation to hide controls. We fade the
   * display to 0 then move them off the
   * screen so they're not interactable
   */
  const hideControlAnimation = () => {
    const { topControl, bottomControl } = animations.current;

    const animationConfig = {
      duration: controlAnimationTiming,
      useNativeDriver: false, // Set to true if compatible with native driver
      easing: Easing.linear, // Optional: specify an easing function
    };

    Animated.parallel(
      [
        Animated.timing(topControl.opacity, {
          toValue: 0,
          ...animationConfig,
        }),
        Animated.timing(topControl.marginTop, {
          toValue: -100,
          ...animationConfig,
        }),
        Animated.timing(bottomControl.opacity, {
          toValue: 0,
          ...animationConfig,
        }),
        Animated.timing(bottomControl.marginBottom, {
          toValue: -100,
          ...animationConfig,
        }),
      ],
      { stopTogether: false }
    ).start();
  };

  /**
   * Animation to show controls...opposite of
   * above...move onto the screen and then
   * fade in.
   */
  function showControlAnimation() {
    const { topControl, bottomControl } = animations.current;

    const animationConfig = {
      duration: controlAnimationTiming,
      useNativeDriver: false,
    };

    Animated.parallel([
      Animated.timing(topControl.opacity, {
        toValue: 1,
        ...animationConfig,
      }),
      Animated.timing(topControl.marginTop, {
        toValue: 0,
        ...animationConfig,
      }),
      Animated.timing(bottomControl.opacity, {
        toValue: 1,
        ...animationConfig,
      }),
      Animated.timing(bottomControl.marginBottom, {
        toValue: 0,
        ...animationConfig,
      }),
    ]).start();
  }

  /**
   * Function to hide the controls. Sets our
   * state then calls the animation.
   */
  function hideControls() {
    setPlayerState((prev) => ({ ...prev, showControls: false }));
    hideControlAnimation();
  }

  /**
   * Function to toggle controls based on
   * current state.
   */

  function toggleControls() {
    setPlayerState((prev) => ({ ...prev, showControls: !prev.showControls }));
    if (!playerState.showControls) {
      showControlAnimation();
      setControlTimeout();
    } else {
      hideControlAnimation();
      clearControlTimeout();
    }
  }

  /**
   * Toggle fullscreen changes resizeMode on
   * the <Video> component then updates the
   * isFullScreen state.
   */
  function toggleFullscreen() {
    setPlayerState((prev) => ({
      ...prev,
      isFullScreen: !prev.isFullScreen,
    }));
    if (props.toggleResizeModeOnFullscreen) {
      setPlayerState((prev) => ({
        ...prev,
        resizeMode: !prev.isFullScreen ? "cover" : "contain",
      }));
    }
  }

  function togglePlayPause() {
    setPlayerState((prev) => ({ ...prev, paused: !prev.paused }));
  }

  return (
    <TouchableWithoutFeedback
      onPress={events.onScreenTouch}
      style={styles.container}
    >
      <View style={[styles.wrapper]}>
        <Video
          {...props}
          ref={playerRef}
          resizeMode={playerState.resizeMode || "contain"}
          volume={playerState.volume}
          paused={playerState.paused || false}
          muted={playerState.muted || false}
          rate={playerState.rate || 1}
          onLoadStart={events.onLoadStart}
          onError={events.onError}
          onLoad={events.onLoad}
          onEnd={events.onEnd}
          style={[styles.video]}
          source={props.source}
        />
        <Controls
          methods={methods}
          playerState={playerState}
          animations={animations.current}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  wrapper: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  video: {
    overflow: "hidden",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
