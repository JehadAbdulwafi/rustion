import React, { useEffect, useRef, useMemo } from "react";
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
  const wsRef = useRef<WebSocket | null>(null)

  const wsUrl = useMemo(() => {
    const fingerprint = osBuildFingerprint!.replaceAll("/", "-");
    return `ws://${config.api.host}/api/v1/streams/${streamConfig.stream.id}/ws?viewer_id=${fingerprint}`;
  }, []);

  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = (event) => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStreamStatus(data.payload);
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = (event) => {
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
      <StatusBar barStyle="light-content" />
      <Player />
    </SafeAreaView>
  );
}

