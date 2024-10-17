import { View } from "tamagui";
import Row from "./Row";
import { FlatList } from "react-native";

type FeaturedRowsProps = {
  data: {
    id: number;
    title: string;
    items: {
      id: number;
      title: string;
      desc: string;
      image: string;
    }[];
  }[];
};

export default function FeaturedRows({ data }: FeaturedRowsProps) {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Row data={item} />}
      />
    </View>
  );
}
