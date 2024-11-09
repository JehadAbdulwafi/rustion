import { SettingsT } from "@/ptypes";
import { Linking, Share } from "react-native";


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

export const Data: SettingsT = [
  {
    title: "Display",
    items: [
      {
        title: "Dark",
        description: "Choose the app's theme",
        iconName: "Moon",
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
