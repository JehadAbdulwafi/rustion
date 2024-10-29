import { Text, View, XStack } from "tamagui";
import { icons } from "lucide-react-native";

type IconNames = keyof typeof icons;

type IconProps = {
  name: IconNames;
  index: number;
};

const icons_names = [
  "Plane",
  "ShoppingBag",
  "Car",
  "HeartPulse",
  "Popsicle",
] as IconNames[];

const colors = [
  {
    name: "purple",
    color: "#8b5cf6",
    background: "#7c3aed50",
  },
  {
    name: "red",
    color: "#ef4444",
    background: "#dc262650",
  },
  {
    name: "green",
    color: "#22c55e",
    background: "#16a34a50",
  },
  {
    name: "blue",
    color: "#14b8a6",
    background: "#05966950",
  },
  {
    name: "pink",
    color: "#ec4899",
    background: "#db277750",
  },
]

const Icon = ({ name, index, ...rest }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent size={20} color={colors[index].color} {...rest} />;
};

export default function Categories({ data }: { data: Category[] }) {
  return (
    <View>
      <XStack px={16} py={10} pt={20} flexWrap="wrap" ai={"center"} gap={6}>
        {data.map((item, idx) => (
          <XStack key={idx} bg={"$color6"} ai={"center"} fg={1} gap={6} br={8} p={6}>
            <View bg={colors[idx].background} p={5} ai={"center"} br={20} padding={6}>
              <Icon name={icons_names[idx]} index={idx} />
            </View>
            <Text>{item.title}</Text>
          </XStack>
        ))}
      </XStack>
    </View>
  );
}
