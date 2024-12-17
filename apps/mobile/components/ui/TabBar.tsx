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
import { msg } from "@lingui/core/macro";

const AView = Animated.createAnimatedComponent(View);

// Define tab routes in the same order as they appear in the tab bar
const TAB_ROUTES = [
  { route: "/", index: 0 },
  { route: "/tabs/explore", index: 1 },
  { route: "/tabs/live", index: 2 },
  { route: "/tabs/account", index: 3 },
];

const TabBar = () => {
  const pathname = usePathname();
  const isVisible = useSharedValue(1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Hide tab bar for live screen and show for others
    if (pathname === '/tabs/live') {
      isVisible.value = withTiming(0, { duration: 150 });
    } else {
      isVisible.value = withTiming(1, { duration: 150 });
      // Find the matching route and set its index
      const tabRoute = TAB_ROUTES.find(tab => tab.route === pathname);
      if (tabRoute) {
        setSelectedIndex(tabRoute.index);
      }
    }
  }, [pathname]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isVisible.value === 0 ? navigationHeight : 0, {
            duration: 150
          })
        },
      ],
      opacity: withTiming(isVisible.value, {
        duration: 150
      })
    };
  });

  return (
    <AView style={[styles.tabBar, rStyle]} backgroundColor={"$background"} btc={"$6"} btw={"$0.5"}>
      <Tabs
        tabs={[
          { name: msg`Home`, icon: "House", route: "/" },
          { name: msg`Explore`, icon: "Search", route: "/tabs/explore" },
          { name: msg`Live`, icon: "Video", route: "/tabs/live" },
          { name: msg`Account`, icon: "User", route: "/tabs/account" },
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
