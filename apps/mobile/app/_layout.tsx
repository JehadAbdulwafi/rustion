import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { Provider } from "@/providers";
import TabBar from "@/components/ui/TabBar";
import { initializeI18n } from "@/i18n/config";
import { useLingui } from "@lingui/react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react-native";
import { msg } from "@lingui/core/macro";
import { useNotifications } from "@/providers/NotificationsProvider";
import { useQuickAction, useSetupQuickActions } from "@/utils/quick-actions";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();
initializeI18n();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    if (loaded) {
      setAppIsReady(true);
    }
  }, [loaded]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider>
      <App onLayout={onLayoutRootView} />
    </Provider>
  );
}

function App({ onLayout }: { onLayout?: () => void }) {
  const { i18n, _ } = useLingui();
  const router = useRouter();
  const { hasNotifications } = useNotifications();

  // needs i18n context
  useSetupQuickActions();

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <StatusBar />
      <QuickActions />
      <Stack screenOptions={{
        headerShown: false,
        animation: i18n.locale === "ar" ? "slide_from_left" : "slide_from_right",
      }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="notifications"
          options={{
            title: _(msg`Notifications`),
            headerLargeTitle: true,
            headerShown: true,
            headerRight: () => i18n.locale === "ar" ? (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowRight color={"white"} style={{ marginLeft: 12 }} />
              </TouchableOpacity>
            ) : (
              hasNotifications && (
                <TouchableOpacity onPress={() => router.push("/notifications?action=clear")}>
                  <Trash2 color="white" style={{ marginLeft: 12 }} />
                </TouchableOpacity>
              )
            ),
            headerLeft: () => i18n.locale === "en" ? (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft color={"white"} style={{ marginRight: 12 }} />
              </TouchableOpacity>
            ) : (
              hasNotifications && (
                <TouchableOpacity onPress={() => router.push("/notifications?action=clear")}>
                  <Trash2 color={"white"} style={{ marginRight: 12 }} />
                </TouchableOpacity>
              )
            ),
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="articles" />
      </Stack>
      <TabBar />
    </SafeAreaProvider>
  );
}


const QuickActions = () => {
  const fired = useRef<string | null>(null);
  const router = useRouter();
  const action = useQuickAction();

  const href = action?.params?.href;

  useEffect(() => {
    if (typeof href !== "string" || fired.current === href) return;
    fired.current = href;
    // @ts-ignore
    router.push(href);
  }, [href, router]);

  return null;
};
