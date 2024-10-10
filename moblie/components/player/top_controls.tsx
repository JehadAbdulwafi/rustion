import { Animated, ImageBackground, StyleSheet, View } from "react-native";
import { animationsTypes } from "./player";
import HideContorls from "./hide_controls";
import Fullscreen from "./full_screen";

type Props = {
  animations: animationsTypes;
  hideControls: () => void;
  toggleFullscreen: () => void;
  isFullScreen: boolean;
};

export default function TopControls({
  animations,
  hideControls,
  toggleFullscreen,
  isFullScreen,
}: Props) {
  return (
    <Animated.View
      style={[
        styles.top,
        {
          opacity: animations.topControl.opacity,
          marginTop: animations.topControl.marginTop,
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
            <HideContorls
              hideControls={hideControls}
              styles={{
                backgroundColor: "rgba(156,156,156,0.2)",
                borderRadius: 10,
              }}
            />
            <Fullscreen
              isFullScreen={isFullScreen}
              toggleFullscreen={toggleFullscreen}
              styles={{
                backgroundColor: "rgba(156,156,156,0.2)",
                borderRadius: 10,
              }}
            />
          </View>
          <HideContorls
            hideControls={hideControls}
            styles={{
              backgroundColor: "rgba(156,156,156,0.2)",
              borderRadius: 10,
            }}
          />
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
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
  pullRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    alignItems: "stretch",
    justifyContent: "center",
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
