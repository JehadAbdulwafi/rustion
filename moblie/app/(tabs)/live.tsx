import React, { useEffect, useState } from "react";
import Player from "@/components/player";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BackHandler, StatusBar } from "react-native";
import * as Orientation from "expo-screen-orientation";

export default function PlayerScreen() {
  const router = useRouter();
  const [allowFullscreen, setAllowFullscreen] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(tabs)/");
        setAllowFullscreen(false);
        return true;
      }
    );

    // Lock orientation to portrait when the component unmounts
    return () => {
      backHandler.remove();
      StatusBar.setHidden(false, "slide");
      Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT); // Ensure portrait mode
    };
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Player allowFullscreen={allowFullscreen} />
    </SafeAreaView>
  );
}
