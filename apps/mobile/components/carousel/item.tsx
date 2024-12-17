import { StyleSheet } from "react-native";
import { Text, View } from "tamagui";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const OVERFLOW_HEIGHT = 75;
const SPACING = 10;

type CarouselItemProps = {
  data: TvShow[];
  scrollXAnimated: SharedValue<number>;
};

const CarouselItem = ({ data, scrollXAnimated }: CarouselItemProps) => {
  const rStyle = useAnimatedStyle(() => {
    const inputRange = [-1, 0, 1];
    const translateY = interpolate(scrollXAnimated.value, inputRange, [
      OVERFLOW_HEIGHT,
      0,
      -OVERFLOW_HEIGHT,
    ]);
    return {
      transform: [{ translateY: translateY }],
    };
  });

  return (
    <View style={styles.overflowContainer}>
      <Animated.View style={rStyle}>
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.title]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.location]}>{item.genre}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "900",
    // color: "#9a49f8",
    textTransform: "uppercase",
    letterSpacing: -1,
    textAlign: "center",
  },
  location: {
    fontSize: 16,
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    textAlign: "center",
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING * 1,
    textAlign: "center",
  },
  itemContainerRow: {
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: "hidden",
    textAlign: "center",
  },
});
