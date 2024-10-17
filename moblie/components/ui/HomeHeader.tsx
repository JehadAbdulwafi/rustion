import { Text } from "./Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationHeight } from "@/constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { COLOR } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import {
  BellDot,
  BellRing,
  Cast,
  Podcast,
  PoundSterling,
} from "lucide-react-native";
import { LiveTVOutline } from "@/assets/icons";

export default function HomeHeader() {
  const opacity = useSharedValue(0);

  const stylez = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          height: navigationHeight,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: "transparent",
        }}
      >
        <Text
          style={{
            textTransform: "uppercase",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          jehad
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <View
            style={{
              backgroundColor: "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              padding: 8,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                opacity: 0.2,
                backgroundColor: "white",
              }}
            />
            <Cast color={"white"} size={22} />
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              padding: 8,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                opacity: 0.2,
                backgroundColor: "white",
              }}
            />
            <BellDot color={"white"} size={22} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
