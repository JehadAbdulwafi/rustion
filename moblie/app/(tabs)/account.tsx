import { navigationHeight } from "@/constants";
import { LucideProps, icons } from "lucide-react-native";
import { Pressable } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

type IconNames = keyof typeof icons;

type IconProps = {
  name: IconNames;
} & LucideProps;

const Icon = ({ name, ...rest }: IconProps) => {
  // @ts-ignore
  const IconComponent = icons[name];
  return <IconComponent size={20} {...rest} />;
};

export default function Account() {
  return (
    <ScrollView f={1} contentContainerStyle={{ padding: 16, paddingBottom: navigationHeight + 16 }}>
      <YStack gap="$4">
        {Data.map((d) => (
          <YStack key={d.title} p="$4" gap="$4" br={"$4"} bg={"$color3"}>
            <Text fontSize={"$7"} fontWeight={"700"}>{d.title}</Text>
            {d.items.map((i) => (
              <Pressable key={i.title} onPress={() => i.onPress?.()}>
                <XStack key={i.title} gap="$4" alignItems="center">
                  <Icon name={i.iconName} color={"#fff"} />
                  <YStack flex={1} justifyContent="center">
                    <Text fontSize={"$5"}>{i.title}</Text>
                    {i.description && <Text color={"$color11"}>{i.description}</Text>}
                  </YStack>
                </XStack>
              </Pressable>
            ))}
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  );
}

type DataT = {
  title: string
  items: {
    title: string;
    description?: string;
    iconName: IconNames;
    onPress: () => void;
  }[]
}[]

const Data: DataT = [
  {
    title: "Display",
    items: [
      {
        title: "Dark",
        description: "Choose the app's theme",
        iconName: "Moon",
        onPress: () => { }
      },
      {
        title: "Language",
        description: "Choose the display language",
        iconName: "Languages",
        onPress: () => { }
      }
    ]
  },
  {
    title: "Setup",
    items: [
      {
        title: "FAQ",
        description: "http://faq.rustion.com",
        iconName: "Info",
        onPress: () => { }
      },
      {
        title: "Forum",
        description: "https://community.rustion.com",
        iconName: "MessagesSquare",
        onPress: () => { }
      },
      {
        title: "Contact us",
        description: "info@rustion.com",
        iconName: "Mail",
        onPress: () => { }
      }
    ]
  },
  {
    title: "About",
    items: [
      {
        title: "Share app",
        description: "Spread the word!",
        iconName: "Share2",
        onPress: () => { }
      },
      {
        title: "Rate app",
        description: "Rate the app!",
        iconName: "Play",
        onPress: () => { }
      },
      {
        title: "Privacy Policy",
        description: undefined,
        iconName: "BadgeCheck",
        onPress: () => { }
      },
      {
        title: "Version",
        description: "0.61.0",
        iconName: "Tag",
        onPress: () => { }
      }
    ]
  }
]

