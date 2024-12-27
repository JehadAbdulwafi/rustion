import { View, useTheme } from "tamagui";
import { Dimensions, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import CarouselItem from "./CarouselItem";
import HomeHeader from "../ui/HomeHeader";
import BackdropImage from "./BackdropImage";
import { useLingui } from "@lingui/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const SPACING = 10;
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;

type CarouselProps = {
  data: TvShow[];
}


const Carousel = ({ data }: CarouselProps) => {
  const theme = useTheme();
  const { i18n } = useLingui();
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (ITEM_WIDTH + SPACING);
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {data?.map((item, idx) => {
          return (
            <BackdropImage key={idx} item={item} idx={idx} scrollX={scrollX} />
          );
        })}
      </View>

      <HomeHeader />
      <LinearGradient
        colors={["transparent", theme.background.val]}
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

      <Animated.FlatList
        data={data}
        keyExtractor={(item) => `trans.${item.id}.img`}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
          gap: SPACING,
        }}
        renderItem={({ item, index: idx }) => {
          return <CarouselItem item={item} idx={idx} scrollX={scrollX} />;
        }}
        // scrolling
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate={"fast"}
        showsHorizontalScrollIndicator={false}
        horizontal
        inverted={i18n.locale === "ar"}
        // scroll event
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT / 1.7,
    justifyContent: "center",
  },
});
