import { getFeaturedSectionsWithArticles } from "@/api/FeaturedSectionApi";
import { getTvShows } from "@/api/TvShowApi";
import Carousel from "@/components/carousel";
import FeaturedRows from "@/components/featuredRows";
import { View } from "@/components/ui/View";
import { navigationHeight } from "@/constants";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useTheme } from "tamagui";

export default function HomeScreen() {
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionWithArticles[]>([]);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [_tvShows, _featuredSections] = await Promise.all([getTvShows(), getFeaturedSectionsWithArticles()]);
        setTvShows(_tvShows);
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
      <StatusBar backgroundColor="transparent" translucent style="light" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[""]}
        renderItem={() =>
          <>
            <Carousel data={tvShows} />
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
