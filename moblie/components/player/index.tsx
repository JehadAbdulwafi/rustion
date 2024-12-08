import { StyleSheet } from "react-native";
import { VideoPlayer } from "./player";
import Animated from "react-native-reanimated";
import useStream from "@/hooks/streamStatus";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function Player() {
  const { streamStatus } = useStream();

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
