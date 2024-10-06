import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "@/components/Provider";
import { VideoPlayerContainer } from "@/components/models/VideoPlayerContainer";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useVideoPlayer from "@/hooks/useVideoPlayer";
import { StyleSheet, View } from "react-native";
import TabBar from "@/components/ui/TabBar";
import { springConfig } from "@/constants/utils";
import { navigationHeight, videoMinHeight } from "@/constants";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const containerHeight = useSharedValue(0);
  const movableHeight = useDerivedValue(() => {
    return Math.max(
      containerHeight.value - videoMinHeight - navigationHeight,
      0
    );
  });

  const { translateY, selectedItem, setSelectedItem, fetching, setFetching } =
    useVideoPlayer();

  const onSelect = (item: string | null) => {
    if (!item) {
      setSelectedItem(null);
      return;
    }
    if (item === selectedItem) {
      translateY.value = withSpring(0, springConfig(2));
      return;
    }
    translateY.value = withSpring(0, springConfig(2));
    setSelectedItem(item);
    fetchData();
  };

  const fetchData = () => {
    if (!fetching) setFetching(true);
    setTimeout(() => {
      setFetching(false);
    }, 500);
  };

  useEffect(() => {
    setSelectedItem(null);
  }, [containerHeight]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      <GestureHandlerRootView>
        <View
          style={styles.flex}
          onLayout={(e) =>
            (containerHeight.value = e.nativeEvent.layout.height)
          }
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>

          {selectedItem && (
            <VideoPlayerContainer
              translateY={translateY}
              movableHeight={movableHeight.value}
              selectedItem={selectedItem}
              onSelect={onSelect}
              fetching={fetching}
            />
          )}
          <TabBar translateY={translateY} movableHeight={movableHeight.value} />
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    overflow: "hidden",
  },
});
