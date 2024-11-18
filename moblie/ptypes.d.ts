import { icons } from "lucide-react-native";

type IconNames = keyof typeof icons;

type SettingsT = {
  title: string
  items: {
    title: string;
    description?: string;
    iconName: IconNames;
    onPress: () => void;
  }[]
}[]

