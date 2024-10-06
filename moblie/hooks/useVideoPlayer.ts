import { create } from "zustand"; // Import Zustand
import { SharedValue, useSharedValue } from "react-native-reanimated";

type VideoPlayerStore = {
  selectedItem: string | null;
  fetching: boolean;
  translateY: SharedValue<number>; // Add translateY to the store
  setSelectedItem: (item: string | null) => void;
  setFetching: (fetching: boolean) => void;
};

const useVideoPlayer = create<VideoPlayerStore>((set) => {
  const translateY = useSharedValue(0); // Initialize translateY here

  return {
    selectedItem: null,
    fetching: true,
    translateY, // Add translateY to the store
    setSelectedItem: (item) => set({ selectedItem: item }),
    setFetching: (fetching) => set({ fetching }),
  };
});

export default useVideoPlayer;
