import { View, StyleSheet, ActivityIndicator } from "react-native";

type Props = {
  loading: boolean;
};

const PlayerLoader = ({ loading }: Props) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginLeft: 7,
  },
});

export default PlayerLoader;
