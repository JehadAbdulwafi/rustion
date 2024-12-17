import { useThemeActions } from "@/hooks/app-preferences";
import { IconNames } from "@/ptypes";
import { LucideProps, icons } from "lucide-react-native";

type IconProps = {
  name: IconNames;
} & LucideProps;

const Icon = ({ name, ...rest }: IconProps) => {
  const { getThemeColor } = useThemeActions();
  const color = getThemeColor({ props: { light: undefined, dark: undefined }, colorName: "tabIconDefault" });
  const IconComponent = icons[name];
  return <IconComponent size={20} {...rest} color={color} />;
};

export default Icon;
