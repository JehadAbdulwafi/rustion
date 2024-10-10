import List from "@/components/list";
import { View } from "@/components/ui/View";
import { usePlayerContext } from "@/providers/PlayerProvider";
import React from "react";

export default function Player() {
  const { selectedItem, setSelectedItem, translateY } = usePlayerContext();
  return (
    <View style={{ flex: 1 }}>
      <List
        translateY={translateY}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
      />
    </View>
  );
}
