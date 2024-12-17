import { Stack } from "expo-router";

export default function ArticlesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Article", headerShown: false }} />
      <Stack.Screen name="details" options={{ title: "Articles", headerShown: false }} />
    </Stack>
  );
}

