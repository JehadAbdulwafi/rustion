import { StatusBar, StyleSheet } from "react-native";
import { VideoPlayer } from "./player";
import Animated from "react-native-reanimated";
import * as Orientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Accelerometer } from "expo-sensors";
import { usePlayerContext } from "@/providers/PlayerProvider";

export default function Player() {
  const { isFullScreen, setIsFullScreen } = usePlayerContext();

  const [isManualToggle, setIsManualToggle] = useState(false);
  const [subscription, setSubscription] =
    useState<Orientation.Subscription | null>(null);

  function toggleFullscreen() {
    setIsManualToggle(true);

    if (!isFullScreen) {
      setIsFullScreen(true);
      Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
      StatusBar.setHidden(true, "slide");
    } else {
      setIsFullScreen(false);
      Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
      StatusBar.setHidden(false, "slide");
    }

    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  }

  useEffect(() => {
    const newSubscription: Orientation.Subscription = Accelerometer.addListener(
      (accelerometerData) => {
        const { x, y } = accelerometerData;
        if (Math.abs(x) > Math.abs(y)) {
          if (x > 0) {
            Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
            setIsFullScreen(true);
            setIsManualToggle(false);
            StatusBar.setHidden(true, "slide");
          } else {
            Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_LEFT);
            setIsFullScreen(true);
            setIsManualToggle(false);
            StatusBar.setHidden(true, "slide");
          }
        } else {
          if (!isManualToggle) {
            setIsFullScreen(false);
            Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
            StatusBar.setHidden(false, "slide");
          }
        }
      }
    );

    return () => {
      if (newSubscription) {
        newSubscription.remove();
      }
    };
  }, []);

  return (
    <Animated.View style={[styles.videoContainer]}>
      <VideoPlayer
        repeat
        title="title"
        source={require("../../assets/videos/big_buck_bunny.mp4")}
        toggleFullscreen={toggleFullscreen}
        isFullScreen={isFullScreen}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
});

// const source = "http://192.168.1.2:9973/api/assets/docker.mp4";
// const source = require('../../assets/videos/big_buck_bunny.mp4')
//http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4
//http://192.168.1.2:2022/live/ly_tv.m3u8
