import { SettingsT } from "@/ptypes";
import { Linking, Share } from "react-native";
import { msg } from "@lingui/core/macro";

import { version } from "@/package.json";

const handleOpenLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log(`Unable to open URL: ${url}`);
  }
};

const handleShare = async (url: string) => {
  try {
    await Share.share({
      message: "Check out this app: " + "\n" + url,
    });
  } catch (error) {
    console.log(error);
  }
}

export const getSettingsData = (appConfig?: Config): SettingsT => [
  {
    title: msg`Help`,
    items: [
      // TODO: ADD them in app config
      appConfig?.faqs_url ? {
        title: msg`FAQ`,
        description: appConfig?.faqs_url,
        iconName: "Info",
        onPress: () => {
          handleOpenLink(appConfig?.faqs_url)
        }
      } : null,
      appConfig?.forum_url ? {
        title: msg`Forum`,
        description: appConfig?.forum_url,
        iconName: "MessagesSquare",
        onPress: () => {
          handleOpenLink(appConfig?.forum_url)
        }
      } : null,
      appConfig?.contact_url ? {
        title: msg`Contact us`,
        description: appConfig?.contact_url,
        iconName: "Mail",
        onPress: () => {
          handleOpenLink(appConfig?.contact_url)
        }
      } : null
    ]
  },
  {
    title: msg`About`,
    items: [
      appConfig?.play_store_url ? {
        title: msg`Share app`,
        description: msg`Spread the word!`,
        iconName: "Share2",
        onPress: () => handleShare(appConfig?.play_store_url)
      } : null,
      {
        title: msg`Rate us`,
        description: msg`Rate the app on the store`,
        iconName: "Star",
        onPress: () => {
          handleOpenLink("market://details?id=com.rustion.app&showAllReviews=true")
        }
      },
      appConfig?.privacy_policy_url ? {
        title: msg`Privacy Policy`,
        description: undefined,
        iconName: "BadgeCheck",
        onPress: () => {
          handleOpenLink(appConfig?.privacy_policy_url!)
        }
      } : null,
      appConfig?.terms_url ? {
        title: msg`Terms of Service`,
        description: undefined,
        iconName: "ListCheck",
        onPress: () => {
          handleOpenLink(appConfig?.terms_url!)
        }
      } : null,
      {
        title: msg`Version`,
        description: appConfig?.app_version || version,
        iconName: "Tag",
        onPress: () => { }
      }
    ]
  }
]
