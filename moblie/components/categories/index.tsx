import { Text, View, XStack } from "tamagui";
import {
  Plane,
  ShoppingBag,
  Car,
  HeartPulse,
  Popsicle,
} from "@tamagui/lucide-icons";

export default function Categories() {
  return (
    <View>
      <XStack px={16} py={10} pt={20} ai={"center"} gap={6}>
        {/* item */}
        <XStack bg={"$color6"} ai={"center"} fg={1} gap={6} br={8} p={6}>
          <View bg={"$purple3"} p={5} ai={"center"} br={20} padding={6}>
            <Plane color={"$purple9"} size={20} />
          </View>
          <Text>Travel</Text>
        </XStack>

        {/* item */}
        <XStack bg={"$color6"} ai={"center"} fg={1} gap={6} br={8} p={6}>
          <View bg={"$pink3"} p={5} ai={"center"} br={20} padding={6}>
            <ShoppingBag color={"$pink9"} size={20} />
          </View>
          <Text>Shopping</Text>
        </XStack>

        {/* item */}
        <XStack bg={"$color6"} ai={"center"} fg={1} gap={6} br={8} p={6}>
          <View bg={"$blue3"} p={5} ai={"center"} br={20} padding={6}>
            <Car color={"$blue9"} size={20} />
          </View>
          <Text>Deliver</Text>
        </XStack>
      </XStack>

      <XStack px={16} ai={"center"} gap={6}>
        {/* item */}
        <XStack bg={"$color6"} ai={"center"} fg={1} gap={6} br={8} p={6}>
          <View bg={"$red3"} p={5} ai={"center"} br={20} padding={6}>
            <Popsicle color={"$red9"} size={20} />
          </View>
          <Text>Popsicle</Text>
        </XStack>

        {/* item */}
        <XStack bg={"$color6"} ai={"center"} fg={1} gap={6} br={8} p={6}>
          <View bg={"$green3"} p={5} ai={"center"} br={20} padding={6}>
            <HeartPulse color={"$green9"} size={20} />
          </View>
          <Text>Healthy</Text>
        </XStack>
      </XStack>
    </View>
  );
}
