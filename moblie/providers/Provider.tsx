import { useColorScheme } from "react-native";
import {
  PortalProvider,
  TamaguiProvider,
  type TamaguiProviderProps,
} from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import config from "../tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

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
      <PortalProvider shouldAddRootHost>
        <ToastProvider swipeDirection="vertical" duration={6000}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            {children}
          </ThemeProvider>
          <ToastViewport top={100} left={0} right={0} />
        </ToastProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}
