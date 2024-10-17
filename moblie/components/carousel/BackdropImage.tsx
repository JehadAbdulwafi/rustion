import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const BackdropImage = ({ item, idx, scrollX }: any) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [idx - 1, idx, idx + 1],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.Image
      source={{ uri: item.poster }}
      style={[StyleSheet.absoluteFillObject, stylez]}
      blurRadius={100}
    />
  );
};

export default BackdropImage;
