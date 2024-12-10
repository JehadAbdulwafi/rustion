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
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === "dark" ? "dark" : "light"}
      {...rest}
    >
      <I18nProvider>
        <PortalProvider shouldAddRootHost>
          <ToastProvider swipeDirection="vertical" duration={6000}>
            <ThemeProvider
              value={colorScheme === "dark" ? sDarkTheme : sDefaultTheme}
            >
              {children}
            </ThemeProvider>
            <ToastViewport top={100} left={0} right={0} />
          </ToastProvider>
        </PortalProvider>
      </I18nProvider>
    </TamaguiProvider>
  );
}
