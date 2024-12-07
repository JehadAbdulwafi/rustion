import { StatusBar, StyleSheet } from "react-native";
import { VideoPlayer } from "./player";
import Animated from "react-native-reanimated";
import * as Orientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";
import useStream from "@/hooks/streamStatus";
import { useState } from "react";

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function Player() {
  const { streamStatus } = useStream();
  const [isFullScreen, setIsFullScreen] = useState(false);
  function toggleFullscreen() {
    if (!isFullScreen) {
      setIsFullScreen(true);
      Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
      //
      // new
      StatusBar.setHidden(true, "slide");
      const subscription = Accelerometer.addListener(
        (accelerometerData) => {
          const { x, y } = accelerometerData;
          if (Math.abs(x) > Math.abs(y)) {
            if (x > 0) {
              Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT);
              setIsFullScreen(true);
              StatusBar.setHidden(true, "slide");
            } else {
              Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_LEFT);
              setIsFullScreen(true);
              StatusBar.setHidden(true, "slide");
            }
          }
        }
      )

      subscription.remove();

    } else {
      setIsFullScreen(false);
      Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
      StatusBar.setHidden(false, "slide");
    }
  }

  return (
    <Animated.View style={[styles.videoContainer]}>
      <VideoPlayer
        isLive={streamStatus.status === "published"}
        source={{
          uri: videoSource,
          metadata: {
            imageUri: "https://picsum.photos/300/200/",
            title: streamStatus.title,
            subtitle: streamStatus.description,
            artist: "artist",
            description: "description",
          }
        }}
        poster={{
          source: { uri: "https://picsum.photos/300/200/" },
          resizeMode: "cover",
        }}
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
//http://192.168.1.12/live/cFwLFDa329.flv
