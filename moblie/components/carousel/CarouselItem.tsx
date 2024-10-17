import React, { memo } from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Dimensions, StyleSheet, View } from "react-native";
import { DATA_ITEM_TYPE } from "../../constants/data";
import { Text } from "tamagui";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const SPACING = 10;
const HEADER_HEIGHT = 80;
const ITEM_HEIGHT = SCREEN_HEIGHT / 1.7 - HEADER_HEIGHT - SPACING * 2;

type Props = {
  idx: number;
  item: DATA_ITEM_TYPE;
  scrollX: SharedValue<number>;
};

const CarouselItem = ({ idx, item, scrollX }: Props) => {
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
        source={{ uri: item.poster }}
        style={[
          {
            flex: 1,
          },
          stylez,
        ]}
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
          <Text style={[styles.title]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.location]}>{item.location}</Text>
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
