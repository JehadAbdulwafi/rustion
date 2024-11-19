import React, { useEffect, useRef, useState } from "react";
import Video, { VideoRef } from "react-native-video";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  View,
  Easing,
} from "react-native";
import PlayerLoader from "./loader";
import PlayerError from "./error";
import Controls from "./controls";

export interface ConfigTypes {
  controlTimeoutDelay: number;
  controlTimeout: NodeJS.Timeout | null | undefined;
  tapActionTimeout: NodeJS.Timeout | null;
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
  isLive: boolean;
  paused?: boolean;
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

export type PlayerState = {
  resizeMode: "contain" | "cover" | "none" | "stretch";
  paused: boolean;
  isLive: boolean;

  isFullScreen: boolean;
  showControls: boolean;
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

export const VideoPlayer = (props: PlayerProps) => {
  const playerRef = useRef<VideoRef | null>(null); // Ensure the ref type matches VideoRef
  const [playerState, setPlayerState] = useState<PlayerState>({
    // Video
    resizeMode: props.resizeMode || "contain",
    paused: props.paused || true,
    isLive: props.source.isLive || false,

    // Controls
    isFullScreen: props.isFullScreen || false,
    showControls: props.showOnStart || true,
    loading: false,
    error: false,
  });

  const configRef = useRef<ConfigTypes>({
    controlTimeoutDelay: 5000,
    controlTimeout: null,
    tapActionTimeout: null,
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
    onBuffer: onBuffer,
    onLoad: onLoad,
    onPause: props.onPause,
    onPlay: props.onPlay,
  };

  const initialValue = 1;

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

  function onBuffer(e: { isBuffering: boolean }) {
    if (!playerState.isLive) return setPlayerState((prev) => ({ ...prev, loading: false }));
    if (e.isBuffering) {
      setPlayerState((prev) => ({ ...prev, loading: true }));
    } else {
      setPlayerState((prev) => ({ ...prev, loading: false }));
    }
  }

  function onError(e: any) {
    console.log("onError:", e);
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
          if (!playerState.paused) {
            resetControlTimeout();
          } else {
            methods.toggleControls();
          }
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
    if (playerState.paused) {
      setControlTimeout();
    }
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
      if (playerState.paused) {
        clearControlTimeout();
      } else {
        setControlTimeout();
      }
    } else {
      if (!playerState.paused) {
        return clearControlTimeout();
      }
      hideControlAnimation();
    }
  }

  function togglePlayPause() {
    setPlayerState((prev) => ({
      ...prev,
      paused: !prev.paused,
      showControls: !prev.paused ? prev.showControls : true, // Keep controls shown if paused
    }));
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
          resizeMode={"contain"}
          volume={1}
          paused={playerState.paused || true}
          muted={false}
          rate={1}
          onBuffer={events.onBuffer}
          onLoadStart={events.onLoadStart}
          onError={events.onError}
          onLoad={events.onLoad}
          onEnd={events.onEnd}
          style={[styles.video]}
          source={props.source}
        />
        <PlayerLoader loading={playerState.loading} />
        <PlayerError error={playerState.error} isLive={props.isLive} />
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
