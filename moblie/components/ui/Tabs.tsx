import { StyleSheet, View, TouchableOpacity } from "react-native";
import Animated, {
  FadeInLeft,
  FadeOutLeft,
  LayoutAnimationConfig,
  LinearTransition,
} from "react-native-reanimated";
import { icons } from "lucide-react-native";
import { MotiProps } from "moti";
import { motifySvg } from "moti/svg";
import { useRouter } from "expo-router";

type IconNames = keyof typeof icons;
type Tab = {
  name: string;
  icon: IconNames;
  route: string;
};

type IconProps = {
  name: IconNames;
} & MotiProps;

const Icon = ({ name, ...rest }: IconProps) => {
  // @ts-ignore
  const IconComponent = motifySvg(icons[name])();
  return <IconComponent size={20} {...rest} />;
};

const TAB_COLORS = {
  activeColor: "#ddd",
  inactiveColor: "#fff",
  activeBackgroundColor: "#1b1b1b",
  inactiveBackgroundColor: "#121212",
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

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <Animated.View
            key={tab.route}
            layout={LinearTransition.springify().damping(80).stiffness(100)}
            style={{
              backgroundColor: isSelected
                ? TAB_COLORS.activeBackgroundColor
                : TAB_COLORS.inactiveBackgroundColor,

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
              <Icon
                name={tab.icon}
                animate={{
                  color: isSelected
                    ? TAB_COLORS.activeColor
                    : TAB_COLORS.inactiveColor,
                }}
                delay={200}
              />
              <LayoutAnimationConfig skipEntering>
                {isSelected && (
                  <Animated.Text
                    entering={FadeInLeft.springify().damping(80).stiffness(100)}
                    exiting={FadeOutLeft.springify().damping(80).stiffness(100)}
                    style={{
                      color: isSelected
                        ? TAB_COLORS.activeColor
                        : TAB_COLORS.inactiveColor,
                      fontSize: 12,
                    }}
                  >
                    {tab.name}
                  </Animated.Text>
                )}
              </LayoutAnimationConfig>
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
    flexDirection: "row",
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
