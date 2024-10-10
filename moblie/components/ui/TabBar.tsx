import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { navigationHeight } from "@/constants";
import { View } from "./View";

const tabs = [
  { name: "Home", icon: "home", route: "index" },
  { name: "Explore", icon: "search", route: "explore" },
  { name: "Player", icon: "play", route: "player" },
];

const AnimatedView = Animated.createAnimatedComponent(View);

const TabBar = ({
  movableHeight,
  translateY,
}: {
  movableHeight: number;
  translateY: SharedValue<number>;
}) => {
  const navigation = useNavigation();

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
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.route}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.route as never)}
        >
          <Ionicons name={tab.icon as any} size={24} color="white" />
          <Text style={styles.tabText}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: navigationHeight,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "white",
  },
});

export default TabBar;
