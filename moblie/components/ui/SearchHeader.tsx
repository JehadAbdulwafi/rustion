import { navigationHeight } from "@/constants";
import { View } from "./View";
import { Input } from "tamagui";
import Icon from "../icon";

type SearchHeaderProps = {
  handleSearch: (text: string) => void
}

export default function SearchHeader({ handleSearch }: SearchHeaderProps) {
  return (
    <View
      style={{
        height: navigationHeight,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 12,
        backgroundColor: "white"
      }}
    >
      <Icon name="ArrowLeft" size={24} />

      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Input
          // styles
          backgroundColor={"$color2"}
          color={"white"}
          borderWidth={0}
          borderRadius={12}
          placeholder={"Search"}
          // events
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}
