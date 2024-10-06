import { springConfig } from "@/constants/utils";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { videoMinHeight, videoMinWidth } from "@/constants";

const { width } = Dimensions.get("screen");

const listData = Array(50)
  .fill(null)
  .map((_, i) => `https://picsum.photos/200/300?random=${i}`);

const ListItem = ({ onSelect }: { onSelect: (item: string) => void }) => (
  <FlatList
    keyExtractor={(item) => item}
    data={listData}
    renderItem={({ item }) => (
      <TouchableOpacity
        key={item}
        style={styles.row}
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
  selectedItem,
  onSelect,
  fetching,
}: {
  translateY: any;
  movableHeight: any;
  selectedItem: string;
  onSelect: (item: string | null) => void;
  fetching: boolean;
}) {
  const videoMaxHeight = width * 0.6;
  const videoMaxWidth = width;
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
      width: interpolate(
        translateY.value,
        [movableHeight - videoMinHeight, movableHeight],
        [videoMaxWidth, videoMinWidth],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        }
      ),
      height: interpolate(
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

  return (
    <Animated.View style={[styles.subContainer, animatedContainerStyles]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.fillWidth}>
          <TouchableOpacity
            style={styles.flexRow}
            activeOpacity={0.9}
            onPress={openVideo}
          >
            <Animated.View style={[animatedVideoStyles]}>
              <Image
                style={styles.tumbnail}
                source={{
                  uri: selectedItem,
                }}
                resizeMode="cover"
              />
            </Animated.View>
            <View>
              <Text style={styles.title}>Selected title</Text>
              <Text style={styles.subTitle}>Selected description</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.close}>
            <Button title="close" onPress={onClose} />
          </View>
        </Animated.View>
      </GestureDetector>
      <View style={styles.selectedItemDetails}>
        <Text style={styles.title}>Selected title</Text>
        <Text style={styles.subTitle}>Selected description</Text>
      </View>
      {fetching ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color="#000" size="large" />
        </View>
      ) : (
        <ListItem onSelect={onSelect} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    backgroundColor: "#fff",
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
  row: {
    backgroundColor: "#fff",
  },
  tumbnail: {
    height: "100%",
    width: "100%",
  },
  videoTumbnail: {
    height: width / 2,
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
  selectedItemDetails: {
    backgroundColor: "#fff",
  },
  close: {
    alignSelf: "center",
  },
});
