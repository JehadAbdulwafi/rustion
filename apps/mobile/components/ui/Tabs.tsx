import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LayoutAnimationConfig,
  LinearTransition,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { IconNames } from "@/ptypes";
import Icon from "../icon";
import { useTheme } from "tamagui";
import { useLingui } from "@lingui/react";
import { View } from "./View";

type Tab = {
  name: string;
  icon: IconNames;
  route: string;
};

const Tabs = ({
  tabs,
  selectedIndex,
  setSelectedIndex,
}: {
  tabs: Tab[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { _, i18n } = useLingui();

  return (
    <View style={styles.tabBar} flexDirection="row">
      {tabs.map((tab, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <Animated.View
            key={tab.route}
            layout={LinearTransition.springify().damping(80).stiffness(100)}
            style={{
              backgroundColor: isSelected
                ? theme.color3.val
                : undefined,

              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSelectedIndex(idx);
                router.push(tab.route as any);
              }}
              style={[styles.tab]}
            >
              {i18n.locale === "en" && <Icon name={tab.icon} />}
              <LayoutAnimationConfig skipEntering>
                {isSelected && (
                  <Animated.Text
                    entering={i18n.locale === "ar" ? FadeInRight.springify().damping(80).stiffness(100) : FadeInLeft.springify().damping(80).stiffness(100)}
                    exiting={i18n.locale === "ar" ? FadeOutRight.springify().damping(80).stiffness(100) : FadeOutLeft.springify().damping(80).stiffness(100)}
                    style={{
                      color: theme.color12.val,
                      fontSize: 12,
                    }}
                  >
                    {_(tab.name)}
                  </Animated.Text>
                )}
              </LayoutAnimationConfig>
              {i18n.locale === "ar" && <Icon name={tab.icon} />}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default Tabs;
