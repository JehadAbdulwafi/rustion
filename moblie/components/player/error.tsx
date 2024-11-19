import { CircleX, Cloud, CloudOff } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "tamagui";
type Props = {
  error: any;
  isLive: boolean;
};
const PlayerError = ({ error, isLive }: Props) => {
  if (!isLive) {
    return (
      <View style={styles.container}>
        <CloudOff size={24} color="#eee" />
        <Text style={styles.text}>Stream not available now!</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <CircleX size={24} color="#eee" />
        <Text style={styles.text}>Stream is offline</Text>
      </View>
    );
  }
  return null;
};

export default PlayerError;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba( 0, 0, 0, 0.5 )",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  text: {
    backgroundColor: "transparent",
    color: "#eee",
  },
});
