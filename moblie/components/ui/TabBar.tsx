import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { navigationHeight } from "@/constants";
import { View } from "./View";
import { useState } from "react";
import Tabs from "./Tabs";

const AnimatedView = Animated.createAnimatedComponent(View);

const TabBar = ({
  movableHeight,
  translateY,
}: {
  movableHeight: number;
  translateY: SharedValue<number>;
}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.value,
            [0, movableHeight],
            [movableHeight, 0]
          ),
        },
      ],
    };
  });

  return (
    <AnimatedView style={[styles.tabBar, rStyle]}>
      <Tabs
        tabs={[
          { name: "Home", icon: "House", route: "/" },
          { name: "Explore", icon: "Search", route: "explore" },
          { name: "Player", icon: "Play", route: "player" },
          { name: "Account", icon: "User", route: "account" },
        ]}
      />
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: navigationHeight,
    backgroundColor: "#121212",
  },
});

export default TabBar;
