import { navigationHeight } from "@/constants";
import { View } from "./View";
import { Input } from "tamagui";
import Icon from "../icon";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

type SearchHeaderProps = {
  handleSearch: (text: string) => void
}

export default function SearchHeader({ handleSearch }: SearchHeaderProps) {
  const { i18n, _ } = useLingui();
  return (
    <View
      style={{
        height: navigationHeight,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 12,
      }}
    >
      {i18n.locale === "en" && <Icon name="ArrowLeft" size={24} />}

      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Input
          // styles
          backgroundColor={"$color2"}
          color={"white"}
          borderWidth={0}
          borderRadius={12}
          placeholder={_(msg`Search`)}
          // events
          onChangeText={handleSearch}
        />
      </View>
      {i18n.locale === "ar" && <Icon name="ArrowRight" size={24} />}
    </View>
  );
}
