import { View, Text, YStack } from "tamagui";
import { Image } from "expo-image";

type RowItemProps = {
  item: {
    id: number;
    title: string;
    desc: string;
    image: string;
  };
};

export default function RowItem({ item }: RowItemProps) {
  return (
    <View>
      <YStack>
        <Image
          source={{ uri: item.image }}
          style={{
            flex: 1,
            height: 150,
            width: 270,
            borderRadius: 12,
          }}
        />

        <View p={5}>
          <Text>{item.title}</Text>
          <Text opacity={0.7}>{item.desc}</Text>
        </View>
      </YStack>
    </View>
  );
}
