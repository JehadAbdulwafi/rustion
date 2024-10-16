import {
  Animated,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { animationsTypes } from "./player";
import { Text } from "tamagui";
import { ArrowLeft, Eye } from "lucide-react-native";
import { useRouter } from "expo-router";

type Props = {
  animations: animationsTypes;
};

export default function TopControls({ animations }: Props) {
  const router = useRouter();
  const onGoBack = () => {
    router.navigate("/(tabs)/");
  };

  return (
    <Animated.View
      style={[
        styles.top,
        {
          opacity: animations.topControl.opacity,
          // marginTop: animations.topControl.marginTop,
        },
      ]}
    >
      <ImageBackground
        source={require("../../assets/img/top-vignette.png")}
        style={[styles.column]}
        imageStyle={[styles.vignette]}
      >
        <View style={styles.topControlGroup}>
          <View style={styles.pullRight}>
            <TouchableOpacity onPress={onGoBack}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: "rgba(150,150,150,0.2)",
                  borderRadius: 20,
                }}
              >
                <ArrowLeft size={22} fill={"white"} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              borderRadius: 20,
              backgroundColor: "rgba(150,150,150,0.2)",
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Eye size={16} color="white" />
            <Text style={{ color: "white", fontSize: 12 }}>140k</Text>
            <Text
              style={{
                color: "white",
                fontSize: 12,
                backgroundColor: "red",
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              Live
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  vignette: {
    resizeMode: "stretch",
  },
  pullRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    justifyContent: "center",
    flex: 1,
  },
  topControlGroup: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 12,
    marginTop: 12,
  },
});
