import React, { memo } from 'react'
import { Image } from 'tamagui'
import Animated, { SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { Dimensions } from 'react-native';
import { DATA_ITEM_TYPE } from '../../constants/data';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1;
const VISIBLE_ITEMS = 3;

type Props = {
  idx: number;
  item: DATA_ITEM_TYPE;
  scrollXAnimated: SharedValue<number>;
}

const CarouselImg = ({ idx, item, scrollXAnimated }: Props) => {
  const imgStyle = useAnimatedStyle(() => {
    const inputRange = [idx - 1, idx, idx + 1];
    const translateX = interpolate(
      scrollXAnimated.value,
      inputRange,
      [ITEM_WIDTH + 2, 0, -ITEM_WIDTH - 2],
    );

    const scale = interpolate(
      scrollXAnimated.value,
      inputRange,
      [0.8, 1, 0.8],
    );

    const opacity = interpolate(
      scrollXAnimated.value,
      inputRange,
      [1 - 1 / VISIBLE_ITEMS, 1, 1 - 1 / VISIBLE_ITEMS],
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    }
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      // onPress={() => router.navigate({ pathname: `/programs/[id]`, params: item })}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: -ITEM_WIDTH / 2,
          },
          imgStyle
        ]}
      >
        <Image
          source={{ uri: item.poster }}
          style={{
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
            borderRadius: 14,
          }}
        />
      </Animated.View>
    </TouchableOpacity >
  )
}

export default memo(CarouselImg);
