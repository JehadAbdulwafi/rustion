import { navigationHeight } from "@/constants";
import { ArrowLeft } from "lucide-react-native";
import { View } from "./View";
import { DarkTheme } from "@react-navigation/native";
import { Input } from "tamagui";

export default function SearchHeader() {
  return (
    <View
      style={{
        height: navigationHeight,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 12,
        backgroundColor: DarkTheme.colors.card,
      }}
    >
      <ArrowLeft color={"white"} size={24} />

      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Input
          backgroundColor={"$color1"}
          color={"white"}
          borderWidth={0}
          borderRadius={12}
          placeholder={"Search"}
        />
      </View>
    </View>
  );
}
