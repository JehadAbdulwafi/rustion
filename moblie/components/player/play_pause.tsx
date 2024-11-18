import { Pause, Play } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { animationsTypes } from "./player";

type Props = {
  togglePlayPause: () => void;
  paused: boolean;
  showControls: boolean;
  animations: animationsTypes;
};

const PlayPause = ({
  togglePlayPause,
  paused,
  animations,
}: Props) => {
  return (
    <Animated.View
      style={[styles.container, { opacity: animations.topControl.opacity }]}
    >
      <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
        {paused ? (
          <Play size={32} color="white" />
        ) : (
          <Pause size={32} color="white" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 99,
  },
});

export default PlayPause;
