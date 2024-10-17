import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import FeaturedRows from "@/components/featuredRows";
import { View } from "@/components/ui/View";
import { navigationHeight } from "@/constants";
import { FEATURED_ROWS } from "@/constants/data";
import { ScrollView } from "tamagui";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        f={1}
        contentContainerStyle={{
          paddingBottom: navigationHeight + 20,
        }}
      >
        <Carousel />
        <Categories />
        <FeaturedRows data={FEATURED_ROWS} />
      </ScrollView>
    </View>
  );
}
