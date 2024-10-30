import { IconNames } from "@/types";
import { LucideProps, icons } from "lucide-react-native";

type IconProps = {
  name: IconNames;
} & LucideProps;

const Icon = ({ name, ...rest }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent size={20} {...rest} />;
};

export default Icon;
