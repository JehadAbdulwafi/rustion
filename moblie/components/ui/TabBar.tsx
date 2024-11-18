import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { navigationHeight } from "@/constants";
import Tabs from "./Tabs";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "tamagui";

const AView = Animated.createAnimatedComponent(View);

const routesWithTabs = ["/", "/tabs/explore", "/tabs/account"];
const TabBar = () => {
  const pathname = usePathname();
  const isVisible = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
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
    <AView style={[styles.tabBar, rStyle]} backgroundColor={"$color2"} btc={"$6"} btw={"$0.5"}>
      <Tabs
        tabs={[
          { name: "Home", icon: "House", route: "/" },
          { name: "Explore", icon: "Search", route: "/tabs/explore" },
          { name: "Live", icon: "Video", route: "/tabs/live" },
          { name: "Account", icon: "User", route: "tabs/account" },
        ]}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </AView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: navigationHeight,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabBar;
