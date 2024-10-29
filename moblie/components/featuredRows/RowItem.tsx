import { View, Text, YStack } from "tamagui";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type RowItemProps = {
  item: Article;
};

export default function RowItem({ item }: RowItemProps) {
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity onPress={() => router.push({ pathname: '/articles/details', params: { id: item.id } })}>
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
            <Text opacity={0.7}>{item.description}</Text>
          </View>
        </YStack>
      </TouchableOpacity>
    </View>
  );
}
