import React, { useEffect, useRef, useState } from "react";
import Video, { ReactVideoPoster, ReactVideoSource, VideoRef } from "react-native-video";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  View,
  Easing,
  StatusBar,
} from "react-native";
import PlayerLoader from "./loader";
import PlayerError from "./error";
import Controls from "./controls";

import * as Orientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";

export interface ConfigTypes {
  controlTimeoutDelay: number;
  controlTimeout: NodeJS.Timeout | null | undefined;
  tapActionTimeout: NodeJS.Timeout | null;
  iconOffset: number;
  tapAnywhereToPause: boolean;
}

type PlayerProps = {
  isLive: boolean;
  paused?: boolean;
  source: ReactVideoSource;
  poster?: string | ReactVideoPoster
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
    resizeMode: "contain",
    paused: props.paused || false,
    isLive: props.isLive || true,

    // Controls
    isFullScreen: false,
    showControls: true,
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

  const accelerometerSubscription = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    // Set update interval
    Accelerometer.setUpdateInterval(500); // Update every 500ms

    return () => {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
      }
    };
  }, []);

  /**
   * Functions used throughout the application
   */
  const methods = {
    toggleFullscreen: toggleFullscreen,
    togglePlayPause: togglePlayPause,
    toggleControls: toggleControls,
    hideControls: hideControls,
  };

  useEffect(() => {
    if (!props.source && playerRef.current) {
      setPlayerState(prev => ({ ...prev, paused: true }));
      playerRef.current.seek(0);
    }
  }, [props.source]);


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
    // if (!playerState.isLive) return setPlayerState((prev) => ({ ...prev, loading: false }));
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
        // If controls are hidden, show them
        if (!playerState.showControls) {
          methods.toggleControls();
        } 
        // If controls are visible and video is playing, hide them
        else if (!playerState.paused) {
          hideControls();
        }
        // Otherwise just toggle controls
        else {
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
  const clearControlTimeout = () => {
    const config = configRef.current;
    if (config.controlTimeout) {
      clearTimeout(config.controlTimeout);
      config.controlTimeout = null;
    }
  };

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
    // Don't hide controls if video is paused
    if (playerState.paused) return;
    
    setPlayerState((prev) => ({ ...prev, showControls: false }));
    hideControlAnimation();
  }

  /**
   * Function to toggle controls based on
   * current state.
   */

  function toggleControls() {
    // If video is paused, always show controls
    if (playerState.paused) {
      setPlayerState((prev) => ({ ...prev, showControls: true }));
      showControlAnimation();
      return;
    }

    setPlayerState((prev) => ({ ...prev, showControls: !prev.showControls }));
    if (!playerState.showControls) {
      showControlAnimation();
      setControlTimeout();
    } else {
      hideControlAnimation();
    }
  }

  function togglePlayPause() {
    // Only toggle play/pause if controls are visible
    if (playerState.showControls) {
      setPlayerState((prev) => ({
        ...prev,
        paused: !prev.paused,
      }));
    } else {
      // If controls are hidden, show them
      setPlayerState((prev) => ({
        ...prev,
        showControls: true,
      }));
      showControlAnimation();
    }
  }

  async function toggleFullscreen() {
    try {
      if (!playerState.isFullScreen) {
        setPlayerState((prev) => ({
          ...prev,
          isFullScreen: true,
        }));
        
        // Initial orientation
        await Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
        StatusBar.setHidden(true, "slide");

        // Set up accelerometer subscription
        const { status } = await Accelerometer.requestPermissionsAsync();
        if (status === 'granted') {
          if (!accelerometerSubscription.current) {
            accelerometerSubscription.current = Accelerometer.addListener(
              (accelerometerData) => {
                const { x } = accelerometerData;
                // Use a threshold to prevent over-sensitive rotation
                if (Math.abs(x) > 0.5) {
                  if (x > 0) {
                    Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
                  } else {
                    Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_LEFT);
                  }
                }
              }
            );
          }
        }
      } else {
        // Clean up subscription when exiting fullscreen
        if (accelerometerSubscription.current) {
          accelerometerSubscription.current.remove();
          accelerometerSubscription.current = null;
        }

        setPlayerState((prev) => ({
          ...prev,
          isFullScreen: false,
        }));
        
        await Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
        StatusBar.setHidden(false, "slide");
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      // Fallback to basic fullscreen without accelerometer
      setPlayerState((prev) => ({
        ...prev,
        isFullScreen: !prev.isFullScreen,
      }));
      
      if (!playerState.isFullScreen) {
        await Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
        StatusBar.setHidden(true, "slide");
      } else {
        await Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
        StatusBar.setHidden(false, "slide");
      }
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={onScreenTouch}
      style={styles.container}
    >
      <View style={[styles.wrapper]}>
        <Video
          ref={playerRef}
          source={props.source}
          style={[styles.video]}
          playInBackground={true}
          playWhenInactive={true}
          ignoreSilentSwitch="ignore"
          progressUpdateInterval={1000}
          onAudioBecomingNoisy={() => {
            setPlayerState((prev) => ({ ...prev, paused: true }));
          }}
          resizeMode={"contain"}
          volume={1}
          paused={playerState.paused || false}
          muted={false}
          rate={1}
          showNotificationControls={true}
          poster={props.poster}
          onBuffer={onBuffer}
          onLoadStart={onLoadStart}
          onError={onError}
          onLoad={onLoad}
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
