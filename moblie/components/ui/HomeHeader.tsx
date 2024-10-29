import { Text } from "./Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationHeight } from "@/constants";
import { StyleSheet, View } from "react-native";
import {
  BellDot,
  Cast,
} from "lucide-react-native";

export default function HomeHeader() {

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
