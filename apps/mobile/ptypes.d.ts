import { MessageDescriptor } from "@lingui/core";
import { icons } from "lucide-react-native";
declare module 'react-native-mmkv';
type IconNames = keyof typeof icons;

type SettingsT = {
  title: MessageDescriptor;
  items: ({
    title: MessageDescriptor;
    description?: MessageDescriptor | string;
    iconName: IconNames;
    onPress: () => void;
  } | null)[]
}[]

