import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const { _, i18n } = useLingui();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="live"
      />
      <Stack.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: _(msg`Account`),
          headerLargeTitle: true,
          headerShown: true,
          headerRight: () => i18n.locale === "ar" && (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowRight color={"white"} style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          ),
          headerLeft: () => i18n.locale === "en" && (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color={"white"} style={{ marginRight: 12 }} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
