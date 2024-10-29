import { getArticles } from '@/api/ArticlesApi';
import ArticleCard from '@/components/featuredRows/articleCard';
import SearchHeader from '@/components/ui/SearchHeader';
import TagsBar from '@/components/ui/TagsBar';
import { navigationHeight } from '@/constants';
import { DarkTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [articles, setArticles] = useState<Article[]>();

  async function fetchArticles() {
    const _articles = await getArticles();
    setArticles(_articles);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={DarkTheme.colors.card} />
      <SearchHeader />
      <TagsBar />
      <FlatList
        data={articles}
        renderItem={({ item }) => <ArticleCard item={item} />}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: navigationHeight + 16,
          gap: 16
        }}
      />
    </SafeAreaView>
  );
}
