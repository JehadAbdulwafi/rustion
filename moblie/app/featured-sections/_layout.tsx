import { Stack } from "expo-router";

export default function ArticlesLayout() {
  return (
    <Stack screenOptions={{ animationDuration: 1000, animation: "slide_from_right" }}>
      <Stack.Screen name="index" options={{ title: "Article", headerShown: false }} />
    </Stack>
  );
}

