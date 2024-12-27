import Icon from "@/components/icon";
import { navigationHeight } from "@/constants";
import { getSettingsData } from "@/constants/settings";
import { TouchableOpacity } from "react-native";
import { ScrollView, YStack } from "tamagui";
import { StatusBar } from "expo-status-bar"
import { Trans, useLingui } from "@lingui/react";
import { useAppLanguage, useSetAppPreferences, useTheme } from "@/hooks/app-preferences";
import { LANGUAGES } from "@/i18n/config";
import { Selector } from "@/components/ui/Selector";
import { useEffect, useState } from "react";
import { languageCodeToName } from "@/i18n/config";
import { msg } from "@lingui/core/macro";
import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";
import { getAppConfig } from "@/api/AppConfigApi";
import { THEMES_LIST } from "@/constants/Colors";

export default function Account() {
  const theme = useTheme();
  const lang = useAppLanguage();
  const setAppPreferences = useSetAppPreferences();

  const { _ } = useLingui();
  const [appConfig, setAppConfig] = useState<AppConfig>();

  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getAppConfig();
        const parsedConfig = JSON.parse(config.config)
        setAppConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to fetch AppConfig:', error);
      }
    };
    fetchConfig();
  }, []);

  const handeSelect = (val: "ar" | "en") => {
    setAppPreferences({ appLanguage: val })
    setOpen(false);
  }

  const handleSelectTheme = (val: "dark" | "light") => {
    setAppPreferences({ theme: val })
    setThemeOpen(false);
  }

  return (
    <>
      <ScrollView f={1} bg={"$color2"} $theme-dark={{ bg: "$color1" }} contentContainerStyle={{ padding: 16, paddingBottom: navigationHeight + 16 }} showsVerticalScrollIndicator={false}>
        <StatusBar />
        <YStack gap="$4">
          <YStack key={"display"} p="$4" gap="$4" br={"$4"} bg={"$color1"} $theme-dark={{ bg: "$color2" }}>
            <Text fontSize={"$7"} fontWeight={"700"}>{_(msg`Display`)}</Text>
            <TouchableOpacity key={"change-theme"} onPress={() => setThemeOpen(true)}>
              <View gap="$4" flexDirection="row" style={{ backgroundColor: "transparent" }} alignItems="center">
                <Icon name={"Moon"} />
                <YStack flex={1} justifyContent="center">
                  <Text fontSize={"$5"}><Trans id="Theme">Theme</Trans></Text>
                  <Text color={"$color11"}>{theme === "light" ? _("Light") : _("Dark")}</Text>
                </YStack>
              </View>
            </TouchableOpacity>

            <TouchableOpacity key={"change-language"} onPress={() => setOpen(true)}>
              <View gap="$4" flexDirection="row" style={{ backgroundColor: "transparent" }} alignItems="center">
                <Icon name={"Languages"} />
                <YStack flex={1} justifyContent="center">
                  <Text fontSize={"$5"}><Trans id="Language">Language</Trans></Text>
                  <Text color={"$color11"}>{languageCodeToName(lang)}</Text>
                </YStack>
              </View>
            </TouchableOpacity>
          </YStack>

          {/* @ts-ignore */}
          {getSettingsData(appConfig).map((section, index) => (section && section.items.filter((item) => item !== null).length > 0) && (
            <YStack key={index} p="$4" gap="$4" br={"$4"} bg={"$color1"} $theme-dark={{ bg: "$color2" }}>
              <Text fontSize={"$7"} fontWeight={"700"}>{_(section.title)}</Text>
              {section.items.map((item, idx) => item && (
                <TouchableOpacity key={idx} onPress={() => item.onPress?.()}>
                  <View gap="$4" flexDirection="row" style={{ backgroundColor: "transparent" }} alignItems="center">
                    <Icon name={item.iconName} />
                    <YStack flex={1} justifyContent="center">
                      <Text fontSize={"$5"}>{_(item.title)}</Text>
                      {item.description && <Text color={"$color11"}>{typeof item.description === "string" ? item.description : _(item.description)}</Text>}
                    </YStack>
                  </View>
                </TouchableOpacity>
              ))}
            </YStack>
          ))}
        </YStack>
      </ScrollView>
      <Selector
        showTrigger={false}
        open={open}
        onOpenChange={() => setOpen(false)}
        onValueChange={(val: "ar" | "en") => handeSelect(val)}
        // @ts-ignore
        label={msg`Select Language`}
        defaultValue={lang}
        value={lang}
        // @ts-ignore
        data={LANGUAGES}
      />

      <Selector
        showTrigger={false}
        open={themeOpen}
        onOpenChange={() => setThemeOpen(false)}
        onValueChange={(val: "dark" | "light") => handleSelectTheme(val)}
        // @ts-ignore
        label={msg`Select Theme`}
        defaultValue={theme}
        value={theme}
        // @ts-ignore
        data={THEMES_LIST}
      />
    </>
  );
}
