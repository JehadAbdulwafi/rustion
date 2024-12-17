import { FlatList } from "react-native";
import { View } from "tamagui";
import RowItem from "./RowItem";
import { useLingui } from "@lingui/react";
import { Text } from "../ui/Text";

type RowProps = {
  data: FeaturedSectionWithArticles;
};

export default function Row({ data }: RowProps) {
  const { i18n } = useLingui();
  return (
    <View pt={14} gap={8}>
      <View px={16}>
        <Text fontSize={18}>{data.featured_section.title}</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data.articles}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RowItem item={item} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 10,
        }}
        inverted={i18n.locale === "ar"}
      />
    </View>
  );
}
