import Icon from "@/components/icon";
import { navigationHeight } from "@/constants";
import { IconNames } from "@/ptypes";
import { Linking, Share, TouchableOpacity } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

export default function Account() {
  return (
    <ScrollView f={1} contentContainerStyle={{ padding: 16, paddingBottom: navigationHeight + 16 }}>
      <YStack gap="$4">
        {Data.map((d) => (
          <YStack key={d.title} p="$4" gap="$4" br={"$4"} bg={"$color3"}>
            <Text fontSize={"$7"} fontWeight={"700"}>{d.title}</Text>
            {d.items.map((i) => (
              <TouchableOpacity key={i.title} onPress={() => i.onPress?.()}>
                <XStack key={i.title} gap="$4" alignItems="center">
                  <Icon name={i.iconName} color={"#fff"} />
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

type DataT = {
  title: string
  items: {
    title: string;
    description?: string;
    iconName: IconNames;
    onPress: () => void;
  }[]
}[]

const handleOpenLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log(`Unable to open URL: ${url}`);
  }
};


const handleShare = async () => {
  const url =
    "https://play.google.com/store/apps/details?id=com.rustion.app";
  try {
    await Share.share({
      message: "Check out this app: " + "\n" + url,
    });
  } catch (error) {
    console.log(error);
  }
}

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
        onPress: () => {
          handleOpenLink("http://faq.rustion.com")
        }
      },
      {
        title: "Forum",
        description: "https://community.rustion.com",
        iconName: "MessagesSquare",
        onPress: () => {
          handleOpenLink("https://community.rustion.com")
        }
      },
      {
        title: "Contact us",
        description: "info@rustion.com",
        iconName: "Mail",
        onPress: () => {
          const url = `mailto:info@rustion.com`;
          Linking.openURL(url);
        }
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
        onPress: handleShare
      },
      {
        title: "Rate us",
        description: "Rate the app on the store",
        iconName: "Star",
        onPress: () => { 
          handleOpenLink("market://details?id=com.rustion.app&showAllReviews=true")
        }
      },
      {
        title: "Privacy Policy",
        description: undefined,
        iconName: "BadgeCheck",
        onPress: () => {
          handleOpenLink("https://legal.rustion.com/privacy-policy")
        }
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

