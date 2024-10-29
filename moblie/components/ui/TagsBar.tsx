import { DarkTheme } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { Text } from 'tamagui';

const _tags = ["go", "rust", "fitness", "programming", "E-sport", "hiking", "travel", "crypto", "finance", "news"];

export default function TagsBar() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState(_tags);

  const handleTagPress = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
      setTags([...tags.filter((t) => t !== tag), tag]);
    } else {
      setSelectedTags([...selectedTags, tag]);
      setTags([tag, ...tags.filter((t) => t !== tag)]);
    }
  };

  return (
    <View>
      <Animated.FlatList
        data={tags}
        horizontal
        contentContainerStyle={{ padding: 16, gap: 6 }}
        itemLayoutAnimation={LinearTransition.springify().damping(80).stiffness(200)}
        skipEnteringExitingAnimations
        layout={FadeIn}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleTagPress(item)}
          >
            <Animated.View
              style={{ padding: 8, backgroundColor: selectedTags.includes(item) ? "skyblue" : DarkTheme.colors.card, borderRadius: 12 }}
            >
              <Text
              >
                {item}
              </Text>
            </Animated.View>
          </Pressable>
        )
        }
        keyExtractor={(item) => item}

      />
    </View>
  );
}
