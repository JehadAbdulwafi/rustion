import { useColorScheme } from "react-native";
import {
  PortalProvider,
  TamaguiProvider,
  type TamaguiProviderProps,
} from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import config from "../tamagui.config";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { light, dark } from "../theme-output";
import I18nProvider from "@/i18n/config";
import FCMProvider from "./FCMProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { useTheme, useThemeActions } from "@/hooks/app-preferences";

const sDefaultTheme = {
  dark: false,
  colors: {
    primary: light.accentColor,
    background: light.background,
    card: light.background,
    text: light.color,
    border: light.borderColor,
    notification: light.accentColor,
  },
  fonts: DefaultTheme.fonts,
};

const sDarkTheme = {
  dark: true,
  colors: {
    primary: dark.accentColor,
    background: dark.background,
    card: dark.background,
    text: dark.color,
    border: dark.borderColor,
    notification: dark.accentColor,
  },
  fonts: DarkTheme.fonts,
};

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  const { theme } = useThemeActions();
  return (
    <FCMProvider>
      <I18nProvider>
        <ThemeProvider
          value={theme === "dark" ? sDarkTheme : sDefaultTheme}
        >
          <TamaguiProvider
            config={config}
            defaultTheme={theme === "dark" ? "dark" : "light"}
            {...rest}
          >
            <PortalProvider shouldAddRootHost>
              <ToastProvider swipeDirection="vertical" duration={6000}>
                <NotificationsProvider>
                  {children}
                  <ToastViewport top={100} left={0} right={0} />
                </NotificationsProvider>
              </ToastProvider>
            </PortalProvider>
          </TamaguiProvider>
        </ThemeProvider>
      </I18nProvider>
    </FCMProvider>
  );
}
