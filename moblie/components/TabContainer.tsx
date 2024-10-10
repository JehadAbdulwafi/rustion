import React from "react";
import { usePlayerContext } from "@/providers/PlayerProvider";
import TabBar from "@/components/ui/TabBar";
import { VideoPlayerContainer } from "./models/VideoPlayerContainer";

const TabContainer = () => {
  const {
    selectedItem,
    setSelectedItem,
    translateY,
    movableHeight,
    isFullScreen,
  } = usePlayerContext();

  return (
    <>
      {selectedItem && (
        <VideoPlayerContainer
          translateY={translateY}
          movableHeight={movableHeight.value}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
          isFullScreen={isFullScreen}
        />
      )}
      <TabBar translateY={translateY} movableHeight={movableHeight.value} />
    </>
  );
};

export default TabContainer;
