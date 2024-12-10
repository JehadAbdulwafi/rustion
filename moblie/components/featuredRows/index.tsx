import { View } from "tamagui";
import Row from "./Row";
import { FlatList } from "react-native";

type FeaturedRowsProps = {
  data: FeaturedSectionWithArticles[];
};

export default function FeaturedRows({ data }: FeaturedRowsProps) {
  return (
    <View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.featured_section.id)}
        renderItem={({ item }) => <Row data={item} />}
      />
    </View>
  );
}
