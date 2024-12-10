import useTheme from "@/hooks/useTheme";
import { IconNames } from "@/ptypes";
import { LucideProps, icons } from "lucide-react-native";

type IconProps = {
  name: IconNames;
} & LucideProps;

const Icon = ({ name, ...rest }: IconProps) => {
  const IconComponent = icons[name];
  const color = useTheme().getThemeColor({ props: { light: undefined, dark: undefined }, colorName: "tabIconDefault" });
  return <IconComponent size={20} {...rest} color={color} />;
};

export default Icon;
