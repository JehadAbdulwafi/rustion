import { StyleSheet, Text, View } from "react-native";
import { Image } from "tamagui";
type Props = {
  error: any;
};
const PlayerError = ({ error }: Props) => {
  if (error) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/img/error-icon.png")}
          style={styles.icon}
        />
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
  },
  icon: {
    marginBottom: 16,
  },
  text: {
    backgroundColor: "transparent",
    color: "#f27474",
  },
});
