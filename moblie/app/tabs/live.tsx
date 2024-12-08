import React, { useEffect, useRef } from "react";
import Player from "@/components/player";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BackHandler, StatusBar } from "react-native";
import * as Orientation from "expo-screen-orientation";
import { streamConfig } from "@/constants/config";
import useStream from "@/hooks/streamStatus";
import { osBuildFingerprint } from "expo-device";
import config from "@/api/config";

export default function PlayerScreen() {
  const router = useRouter();
  const { setStreamStatus, setIsConnected } = useStream();
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const fingerprint = osBuildFingerprint!.replaceAll("/", "-");
    const ws = new WebSocket(
      `ws://${config.api.host}/api/v1/streams/${streamConfig.stream.id}/ws?viewer_id=${fingerprint}`
    );
    wsRef.current = ws;

    ws.onopen = (event) => {
      setIsConnected(true);
      console.log("WebSocket opened:", streamConfig.stream.id, event);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStreamStatus(data.payload);
      console.log("New message:", data);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      wsRef.current = null;
      setTimeout(connect, 1000);
    };
  };

  const closeConnection = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    connect();
    const backAction = () => {
      router.replace("/");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      closeConnection();
      backHandler.remove();
      StatusBar.setHidden(false, "slide");
      Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Player />
    </SafeAreaView>
  );
}
