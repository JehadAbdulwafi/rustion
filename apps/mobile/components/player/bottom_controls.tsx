import {
  Animated,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { animationsTypes } from "./player";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { FullScreenEnterIcon, FullScreenExitIcon } from "@/assets/icons";
import useStream from "@/hooks/streamStatus";
import { useLingui } from "@lingui/react";

type Props = {
  isFullScreen: boolean;
  toggleFullscreen: () => void;
  animations: animationsTypes;
};

export default function BottomControls({
  toggleFullscreen,
  animations,
  isFullScreen,
}: Props) {
  const { streamStatus } = useStream();
  const { _, i18n } = useLingui();
  const opacity = animations.bottomControl.opacity;

  return (
    <Animated.View
      style={[
        styles.bottom,
        {
          opacity,
        },
      ]}
    >
      <ImageBackground
        source={require("../../assets/img/bottom-vignette.png")}
        style={[styles.column]}
        imageStyle={[styles.vignette]}
      >
        <SafeAreaView style={[styles.row, styles.bottomControlGroup, { flexDirection: i18n.locale === "ar" ? "row-reverse" : "row" }]}>
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <Text style={{ color: "white", fontSize: 16 }}>{streamStatus.title}</Text>
            <Text style={{ color: "white", fontSize: 14 }}>
              {streamStatus.description}
            </Text>
          </View>
          <View style={{ gap: 12, backgroundColor: "transparent" }}>
            <TouchableOpacity onPress={toggleFullscreen}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: "rgba(150,150,150,0.2)",
                  borderRadius: 20,
                }}
              >
                {isFullScreen
                  ? <FullScreenExitIcon width={24} height={24} fill={"white"} color="white" />
                  : <FullScreenEnterIcon width={24} height={24} fill={"white"} color="white" />}
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: null,
    width: null,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: null,
    width: null,
  },
  vignette: {
    resizeMode: "stretch",
  },
  bottom: {
    alignItems: "stretch",
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomControlGroup: {
    alignSelf: "stretch",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 12,
    gap: 12,
  },
});
