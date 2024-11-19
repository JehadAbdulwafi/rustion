import React, { useEffect, useRef } from "react";
import Player from "@/components/player";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BackHandler, StatusBar } from "react-native";
import * as Orientation from "expo-screen-orientation";
import { streamConfig } from "@/constants/config";
import useStream from "@/hooks/streamStatus";

export default function PlayerScreen() {
  const router = useRouter();
  const { streamStatus, setStreamStatus, setIsConnected } = useStream();
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(
      `ws://192.168.1.5:9973/api/v1/streams/${streamConfig.stream.id}/ws`
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

    return () => {
      closeConnection();
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/");
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
      <Player isLive={streamStatus.status === "published"} />
    </SafeAreaView>
  );
}

