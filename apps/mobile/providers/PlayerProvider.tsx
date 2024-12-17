import { navigationHeight, videoMinHeight } from "@/constants";
import React, { createContext, useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { View } from "tamagui";

interface PlayerContextType {
  translateY: SharedValue<number>;
  isFullScreen: boolean;
  selectedItem: string | null;
  setIsFullScreen: (isFullScreen: boolean) => void;
  setSelectedItem: (item: string | null) => void;
  containerHeight: SharedValue<number>;
  movableHeight: SharedValue<number>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const translateY = useSharedValue(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const containerHeight = useSharedValue(0);
  const movableHeight = useDerivedValue(() => {
    return Math.max(
      containerHeight.value - videoMinHeight - navigationHeight,
      0
    );
  });

  useEffect(() => {
    setSelectedItem(null);
  }, [containerHeight]);

  return (
    <PlayerContext.Provider
      value={{
        translateY,
        isFullScreen,
        selectedItem,
        setIsFullScreen,
        setSelectedItem,
        containerHeight,
        movableHeight
      }}
    >
      <GestureHandlerRootView>
        <View
          style={{
            flex: 1,
            overflow: "hidden",
          }}
          onLayout={(e) =>
            (containerHeight.value = e.nativeEvent.layout.height)
          }
        >
          {children}
        </View>
      </GestureHandlerRootView>
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
