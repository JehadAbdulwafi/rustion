import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

type BackdropImageProps = {
  item: TvShow;
  idx: number;
  scrollX: any;
};

const BackdropImage = ({ item, idx, scrollX }: BackdropImageProps) => {
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
      source={{ uri: item.image }}
      style={[StyleSheet.absoluteFillObject, stylez]}
      blurRadius={100}
    />
  );
};

export default BackdropImage;
