import { getFeaturedSectionsWithArticles } from "@/api/FeaturedSectionApi";
import { getTags } from "@/api/TagApi";
import { getTvShows } from "@/api/TvShowApi";
import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import FeaturedRows from "@/components/featuredRows";
import { View } from "@/components/ui/View";
import { navigationHeight } from "@/constants";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StatusBar } from "react-native";
import { useTheme } from "tamagui";

export default function HomeScreen() {
  const [categories, setCategories] = useState<Tag[]>([]);
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionWithArticles[]>([]);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [_tvShows, _categories, _featuredSections] = await Promise.all([getTvShows(), getTags(), getFeaturedSectionsWithArticles()]);
        setTvShows(_tvShows);
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
            <Carousel data={tvShows} />
            {/* <Categories data={categories} /> */}
            <FeaturedRows data={featuredSections} />
          </>
        }
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: navigationHeight + 20,
          backgroundColor: theme.background.val
        }}
      />
    </View>
  );
}
