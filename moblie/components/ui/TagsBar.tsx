import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { Text } from 'tamagui';

import { useTheme } from "tamagui";

type TagsBarProps = {
  tags: Tag[];
  handleSort: (items: string[]) => void;
}

export default function TagsBar({ tags: _tags, handleSort }: TagsBarProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tags, setTags] = useState(_tags);
  const theme = useTheme();

  const handleTagPress = (tag: Tag) => {
    let res;
    let finalRes;
    if (selectedTags.includes(tag)) {
      res = selectedTags.filter((t) => t !== tag)
      setTags([...tags.filter((t) => t !== tag), tag]);

    } else {
      res = [...selectedTags, tag]
      setTags([tag, ...tags.filter((t) => t !== tag)]);
    }

    setSelectedTags(res);
    finalRes = res.map((t) => t.title);
    handleSort(finalRes)

  };

  return (
    <View>
      <Animated.FlatList
        data={tags}
        horizontal
        contentContainerStyle={{ paddingTop: 16, gap: 6 }}
        itemLayoutAnimation={LinearTransition.springify().damping(80).stiffness(200)}
        skipEnteringExitingAnimations
        layout={FadeIn}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              handleTagPress(item)
            }}
          >
            <Animated.View
              style={{
                padding: 8,
                backgroundColor: selectedTags.includes(item) ? theme.blue7.val : theme.color3.val,
                borderRadius: 8
              }}
            >
              <Text
                style={{
                  color: selectedTags.includes(item) ? "white" : theme.color.val
                }}
              >
                {item.title}
              </Text>
            </Animated.View>
          </Pressable>
        )
        }
        keyExtractor={(item) => item.id}

      />
    </View>
  );
}
