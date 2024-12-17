import { getArticles } from '@/api/ArticlesApi';
import { getTags } from '@/api/TagApi';
import ArticleCard from '@/components/featuredRows/articleCard';
import SearchHeader from '@/components/ui/SearchHeader';
import TagsBar from '@/components/ui/TagsBar';
import { navigationHeight } from '@/constants';
import { View } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { StatusBar } from "expo-status-bar"
import { useTheme } from "tamagui";

import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * TabTwoScreen
 *
 * This component renders the explore tab, which displays all the articles
 * in a list. The articles can be filtered by tags, and the user can search
 * for a specific article by title.
 *
 * The component first fetches all the articles and tags, and then renders
 * a list of articles filtered by the user's selected tags. The user can
 * select multiple tags to filter the articles. The component also renders
 * a search bar at the top of the screen, which allows the user to search
 * for a specific article by title.
 *
 * The component uses the `Animated.FlatList` component from `react-native-reanimated`
 * to animate the list of articles when the user filters the list.
 *
 * @example
 * <TabTwoScreen />
 */

export default function TabTwoScreen() {
  const theme = useTheme();
  const [articles, setArticles] = useState<Article[]>();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [_tags, _articles] = await Promise.all([getTags(), getArticles()]);
        setTags(_tags);
        setArticles(_articles);
        setFilteredArticles(_articles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    )();
  }, []);

  const handleSort = (selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      setFilteredArticles(articles);
    } else {
      // resort the article
      if (!articles) return setFilteredArticles(articles);
      const sortedArticles = [
        // Filter articles containing any of the selected tags
        ...articles.filter(article =>
          selectedTags.some(tag => article.tags?.split(',').includes(tag))
        ),
        // Include the rest of the articles
        ...articles.filter(article =>
          !selectedTags.some(tag => article.tags?.split(',').includes(tag))
        )
      ];
      setFilteredArticles(sortedArticles);
    }
  };

  const handleSearch = (text: string) => {
    if (text.length === 0) {
      setFilteredArticles(articles);
    } else {
      if (!articles) return setFilteredArticles(articles);
      const filtered = articles.filter((article) => article.title.toLowerCase().includes(text.toLowerCase()));
      setFilteredArticles(filtered);
    }
  }

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="white" />
    </View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <SearchHeader handleSearch={handleSearch} />

      <Animated.FlatList
        data={filteredArticles}
        itemLayoutAnimation={LinearTransition.springify().damping(80).stiffness(200)}
        skipEnteringExitingAnimations
        layout={FadeIn}
        renderItem={({ item }) => <ArticleCard item={item} />}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: navigationHeight + 16,
          gap: 16,
          backgroundColor: theme.background.val
        }}
        ListHeaderComponent={
          <TagsBar tags={tags} handleSort={handleSort} />
        }
      />
    </SafeAreaView>
  );
}
