import { Text } from "./Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationHeight } from "@/constants";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  BellDot,
  Cast,
} from "lucide-react-native";
import { View } from "./View";
import { useRouter } from "expo-router";
import config from "@/api/config";
import { useLingui } from "@lingui/react";

export default function HomeHeader() {
  const router = useRouter();
  const { i18n } = useLingui();

  return (
    <SafeAreaView>
      <View
        flexDirection="row"
        style={{
          height: navigationHeight,
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
            color: "#fff"
          }}
        >
          {i18n.locale === "ar" ? config.app.name.ar : config.app.name.en}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/tabs/live")}
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
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              padding: 8,
              borderRadius: 12,
              overflow: "hidden",
            }}
            onPress={() => router.push("/notifications")}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                opacity: 0.2,
                backgroundColor: "white",
              }}
            />
            <BellDot color={"white"} size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
