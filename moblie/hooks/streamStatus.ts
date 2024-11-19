import { create } from "zustand";

type StreamState = {
  streamStatus: StreamStatus
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
  setStreamStatus: (streamStatus: StreamStatus) => void
};

const useStream = create<StreamState>(
  (set) => ({
    streamStatus: {
      stream_id: "",
      title: "",
      description: "",
      viewers_count: 0,
      status: "",
      viewers: 0,
      thumbnail: "",
    },
    isConnected: false,
    setIsConnected: (isConnected: boolean) => {
      set({ isConnected });
    },
    setStreamStatus: (streamStatus: StreamStatus) => {
      set({ streamStatus });
    },
  })
);

export default useStream;

