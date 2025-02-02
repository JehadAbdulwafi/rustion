import React, { memo } from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text, useTheme } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const SPACING = 10;
const HEADER_HEIGHT = 80;
const ITEM_HEIGHT = SCREEN_HEIGHT / 1.7 - HEADER_HEIGHT - SPACING * 2;

type Props = {
  idx: number;
  item: TvShow;
  scrollX: SharedValue<number>;
};

const CarouselItem = ({ idx, item, scrollX }: Props) => {
  const theme = useTheme();
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [idx - 1, idx, idx + 1],
            [0.95, 1, 0.95],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [idx - 1, idx, idx + 1],
            [1.5, 1, 1.5],
            Extrapolation.CLAMP
          ),
        },

        {
          rotateZ: `${interpolate(
            scrollX.value,
            [idx - 1, idx, idx + 1],
            [10, 0, -10],
            Extrapolation.CLAMP
          )}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          overflow: "hidden",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 5,
        },
        containerStyle,
      ]}
    >
      <Animated.Image
        source={{ uri: item.image }}
        style={[
          {
            flex: 1,
          },
          stylez,
        ]}
      />

      <LinearGradient
        colors={["transparent", theme.black4.val]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 5,
          left: 8,
          right: 0,
        }}
      >

        <View style={styles.itemContainer}>

          <Text style={[styles.title, { color: "#fff" }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.location, { color: "#fff" }]}>{item.genre}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default memo(CarouselItem);

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
    textAlign: "left",
  },
  itemContainer: {
    padding: SPACING * 1,
  },
});
