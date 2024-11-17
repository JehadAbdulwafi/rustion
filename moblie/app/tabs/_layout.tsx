import { Stack } from "expo-router";

export default function TabLayout() {
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
          title: "Account",
          headerLargeTitle: true,
          headerShown: true,
        }}
      />
    </Stack>
  );
}
