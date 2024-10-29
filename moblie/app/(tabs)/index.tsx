import { getCategories } from "@/api/CategoryApi";
import { getFeaturedSectionsWithArticles } from "@/api/FeaturedSectionApi";
import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import FeaturedRows from "@/components/featuredRows";
import { View } from "@/components/ui/View";
import { navigationHeight } from "@/constants";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StatusBar } from "react-native";

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionWithArticles[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [_categories, _featuredSections] = await Promise.all([getCategories(), getFeaturedSectionsWithArticles()]);
        setCategories(_categories);
        setFeaturedSections(_featuredSections);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    )();
  }, []);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="white" />
    </View>;
  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        data={[""]}
        renderItem={() =>
          <>
            <Carousel />
            <Categories data={categories} />
            <FeaturedRows data={featuredSections} />
          </>
        }
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: navigationHeight + 20,
        }}


      />
    </View>
  );
}
