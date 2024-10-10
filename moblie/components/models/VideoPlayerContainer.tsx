import { springConfig } from "@/constants/utils";
import React, { useEffect } from "react";
import {
  BackHandler,
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { videoMinHeight, videoMinWidth } from "@/constants";
import { View } from "../ui/View";
import { Text } from "../ui/Text";
import Player from "../player";
import Constants from "expo-constants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const listData = Array(50)
  .fill(null)
  .map((_, i) => `https://picsum.photos/200/300?random=${i}`);

const AnimatedView = Animated.createAnimatedComponent(View);

const ListItem = ({ onSelect }: { onSelect: (item: string) => void }) => (
  <FlatList
    keyExtractor={(item) => item}
    data={listData}
    renderItem={({ item }) => (
      <TouchableOpacity
        key={item}
        onPress={() => onSelect(item)}
        activeOpacity={0.9}
      >
        <View style={styles.videoTumbnail}>
          <Image
            style={styles.tumbnail}
            source={{ uri: item }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Some title</Text>
        <Text style={styles.subTitle}>Some description</Text>
      </TouchableOpacity>
    )}
  />
);

export function VideoPlayerContainer({
  translateY,
  movableHeight,
  setSelectedItem,
  selectedItem,
  isFullScreen,
}: {
  translateY: SharedValue<number>;
  movableHeight: number;
  setSelectedItem: (item: string | null) => void;
  selectedItem: string | null;
  isFullScreen: boolean;
}) {
  const videoMaxHeight = SCREEN_WIDTH * 0.6;
  const videoMaxWidth = SCREEN_WIDTH;
  const initialTranslateY = useSharedValue(100);
  const finalTranslateY = useSharedValue(0);
  const initialOpacity = useSharedValue(0);

  const animatedContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.value,
            [0, movableHeight],
            [0, movableHeight]
          ),
        },
        { translateY: initialTranslateY.value },
        { translateY: finalTranslateY.value },
      ],
      opacity: initialOpacity.value,
    };
  });

  const animatedVideoStyles = useAnimatedStyle(() => {
    return {
      width: isFullScreen
        ? SCREEN_HEIGHT - Constants.statusBarHeight
        : interpolate(
            translateY.value,
            [movableHeight - videoMinHeight, movableHeight],
            [videoMaxWidth, videoMinWidth],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            }
          ),
      height: isFullScreen
        ? SCREEN_WIDTH
        : interpolate(
            translateY.value,
            [0, movableHeight - videoMinHeight, movableHeight],
            [videoMaxHeight, videoMinHeight + videoMinHeight, videoMinHeight],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            }
          ),
    };
  });

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      let newValue = event.changeY + translateY.value;
      if (newValue > movableHeight) newValue = movableHeight;
      if (newValue < 0) newValue = 0;
      translateY.value = newValue;
    })
    .onFinalize((event) => {
      if (event.velocityY < -20 && translateY.value > 0) {
        translateY.value = withSpring(0, springConfig(event.velocityY));
      } else if (event.velocityY > 20 && translateY.value < movableHeight) {
        translateY.value = withSpring(
          movableHeight,
          springConfig(event.velocityY)
        );
      } else if (translateY.value < movableHeight / 2) {
        translateY.value = withSpring(0, springConfig(event.velocityY));
      } else {
        translateY.value = withSpring(
          movableHeight,
          springConfig(event.velocityY)
        );
      }
    });

  useEffect(() => {
    initialTranslateY.value = withSpring(0, springConfig(20));
    initialOpacity.value = withSpring(1, springConfig(20));
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (translateY.value < movableHeight / 2) {
        translateY.value = withSpring(movableHeight, springConfig(40));
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [movableHeight]);

  const openVideo = () => {
    translateY.value = withSpring(0, springConfig(-20));
  };
  const onClose = () => {
    finalTranslateY.value = withSpring(videoMinHeight, springConfig(-20));
    setTimeout(() => onSelect(null), 150);
  };

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
  };

  return (
    <AnimatedView style={[styles.subContainer, animatedContainerStyles]}>
      <GestureDetector gesture={panGesture}>
        <AnimatedView style={[styles.fillWidth]}>
          <TouchableOpacity
            style={[styles.flexRow]}
            activeOpacity={0.9}
            onPress={openVideo}
          >
            <AnimatedView style={[animatedVideoStyles]}>
              <Player />
            </AnimatedView>
            <View>
              <Text style={styles.title}>Selected title</Text>
              <Text style={styles.subTitle}>Selected description</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.close}>
            <Button title="close" onPress={onClose} />
          </View>
        </AnimatedView>
      </GestureDetector>
      <View>
        <Text style={styles.title}>Selected title</Text>
        <Text style={styles.subTitle}>Selected description</Text>
      </View>
      <ListItem onSelect={onSelect} />
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fillWidth: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexRow: {
    flexDirection: "row",
  },
  tumbnail: {
    height: "100%",
    width: "100%",
  },
  videoTumbnail: {
    height: SCREEN_WIDTH / 2,
    backgroundColor: "#000",
  },
  title: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 13,
    color: "#aaa",
    marginHorizontal: 20,
    marginBottom: 25,
  },
  close: {
    alignSelf: "center",
  },
});
