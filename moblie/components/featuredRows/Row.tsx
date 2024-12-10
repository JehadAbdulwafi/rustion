import { FlatList } from "react-native";
import { Text, View } from "tamagui";
import RowItem from "./RowItem";

type RowProps = {
  data: FeaturedSectionWithArticles;
};

export default function Row({ data }: RowProps) {
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
      />
    </View>
  );
}
