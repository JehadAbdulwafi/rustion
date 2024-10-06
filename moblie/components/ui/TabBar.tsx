import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { navigationHeight } from "@/constants";

const tabs = [
  { name: "Home", icon: "home", route: "index" },
  { name: "Explore", icon: "search", route: "explore" },
  { name: "Player", icon: "play", route: "player" },
];

const TabBar = ({
  translateY,
  movableHeight,
}: {
  translateY: SharedValue<number>;
  movableHeight: number;
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
    <Animated.View style={[styles.tabBar, rStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.route}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.route as never)}
        >
          <Ionicons name={tab.icon as any} size={24} color="black" />
          <Text style={styles.tabText}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: navigationHeight,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "black",
  },
});

export default TabBar;
