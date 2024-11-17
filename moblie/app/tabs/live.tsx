import React, { useEffect, useState } from "react";
import Player from "@/components/player";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BackHandler, StatusBar } from "react-native";
import * as Orientation from "expo-screen-orientation";
import useWebSocket from "@/hooks/useWebSocket";
import { streamConfig } from "@/constants/config";

export default function PlayerScreen() {
  const router = useRouter();
  const [allowFullscreen, setAllowFullscreen] = useState(true);

  const { sendMessage } = useWebSocket('ws://192.168.1.6:9973/api/v1/streams/ws', {
    onOpen: () => {
      console.log('WebSocket opened:', streamConfig.stream.id);
      sendMessage(JSON.stringify({ stream_id: streamConfig.stream.id }))
    },
    onMessage: (event) => console.log('New message:', event.data),
    onClose: () => console.log('WebSocket closed'),
    onError: (event) => console.error('WebSocket error:', event),
  });


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/");
        setAllowFullscreen(false);
        return true;
      }
    );

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
