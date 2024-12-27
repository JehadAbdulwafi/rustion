import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { VideoPlayer } from "./player";
import Animated, { FadeIn } from "react-native-reanimated";
import useStream from "@/hooks/streamStatus";
import { View } from "../ui/View";
import { Image } from "expo-image";

const Player = () => {
  const { streamStatus } = useStream();
  const [isLoading, setIsLoading] = useState(true);

  const videoSource = useMemo(() => ({
    // uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    uri: "https://stream.jehad.ly/live/livestream1.flv",
    metadata: {
      imageUri: streamStatus.thumbnail || "https://picsum.photos/300/200/",
      title: streamStatus.title,
      subtitle: streamStatus.description,
      artist: "Rustion",
      description: streamStatus.description,
    }
  }), [streamStatus]);

  const preloadContent = useCallback(async () => {
    try {
      if (videoSource.metadata.imageUri) {
        await Image.prefetch(videoSource.metadata.imageUri);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(false);
    } catch (error) {
      console.error("Preloading failed:", error);
      setIsLoading(false);
    }
  }, [videoSource]);

  useEffect(() => {
    preloadContent();
  }, [preloadContent]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black"
        }}
      >
        <ActivityIndicator
          color={"white"}
          size={"large"}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.videoContainer]}
      entering={FadeIn.duration(300)}
    >
      <VideoPlayer
        isLive={streamStatus.status === "published"}
        source={videoSource}
        poster={{
          source: { uri: videoSource.metadata.imageUri },
          resizeMode: "cover",
        }}
      />
    </Animated.View>
  );
};

export default React.memo(Player);

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
});
