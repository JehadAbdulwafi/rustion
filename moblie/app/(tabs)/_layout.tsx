import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="player"
        options={{
          title: "Player",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
    </Stack>
  );
}
