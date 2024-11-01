import { getFeaturedSectionWithArticles } from "@/api/FeaturedSectionApi";
import { Text } from "@/components/ui/Text";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "tamagui";

export default function ArticlesPage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [featuredSectionWithArticles, setFeaturedSectionWithArticles] = useState<FeaturedSectionWithArticles>();


  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const res = await getFeaturedSectionWithArticles(id as string);
          setFeaturedSectionWithArticles(res);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      })()
    }
  }, [])

  if (loading || !featuredSectionWithArticles) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="white" />
    </View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={featuredSectionWithArticles.articles}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 10,
        }}
        ListHeaderComponent={() => <Text>{featuredSectionWithArticles.featured_section.title}</Text>}
      />
    </SafeAreaView>
  );
}

