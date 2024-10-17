import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { navigationHeight } from "@/constants";
import { View } from "./View";
import Tabs from "./Tabs";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";

const AnimatedView = Animated.createAnimatedComponent(View);

const routesWithTabs = ["/", "/explore", "/account"];
const TabBar = () => {
  const pathname = usePathname();
  const isVisible = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    console.log("pathname", pathname);
    if (!routesWithTabs.includes(pathname)) {
      setSelectedIndex(0);
      isVisible.value = withTiming(0, { duration: 300 });
    } else {
      isVisible.value = withTiming(1, { duration: 300 });
    }
  }, [pathname]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            isVisible.value,
            [0, 1],
            [navigationHeight, 0]
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
          { name: "Live", icon: "Video", route: "live" },
          { name: "Account", icon: "User", route: "account" },
        ]}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabBar;
