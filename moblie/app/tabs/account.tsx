import Icon from "@/components/icon";
import { navigationHeight } from "@/constants";
import { Data } from "@/constants/settings";
import useTheme from "@/hooks/useTheme";
import { TouchableOpacity } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";
import { StatusBar } from "expo-status-bar"

export default function Account() {
  const { toggleTheme } = useTheme();

  return (
    <ScrollView f={1} bg={"$color2"} $theme-dark={{ bg: "$color1" }} contentContainerStyle={{ padding: 16, paddingBottom: navigationHeight + 16 }} showsVerticalScrollIndicator={false}>
      <StatusBar />
      <YStack gap="$4">
        {Data.map((d) => (
          <YStack key={d.title} p="$4" gap="$4" br={"$4"} bg={"$color1"} $theme-dark={{ bg: "$color2" }}>
            <Text fontSize={"$7"} fontWeight={"700"}>{d.title}</Text>
            {d.items.map((i) => (
              <TouchableOpacity key={i.title} onPress={() => i.title === "Dark" ? toggleTheme() : i.onPress?.()}>
                <XStack key={i.title} gap="$4" alignItems="center">
                  <Icon name={i.iconName} />
                  <YStack flex={1} justifyContent="center">
                    <Text fontSize={"$5"}>{i.title}</Text>
                    {i.description && <Text color={"$color11"}>{i.description}</Text>}
                  </YStack>
                </XStack>
              </TouchableOpacity>
            ))}
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  );
}

