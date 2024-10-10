import { useState } from 'react'
import { View } from 'tamagui'
import {
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';

import {
  Directions,
  Gesture,
  GestureDetector,
  State,
} from 'react-native-gesture-handler';

import {
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { DATA } from '../../constants/data';
import CarouselItem from './item';
import CarouselImg from './img';

const { width } = Dimensions.get('screen');
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
// const VISIBLE_ITEMS = 3;
const OVERFLOW_HEIGHT = 75;
const Carousel = () => {
  const [data] = useState(DATA);
  const [index, setIndex] = useState(0);
  const scrollXAnimated = useSharedValue(0);


  const rFling = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onFinalize((event) => {
      if (event.state === State.ACTIVE) return;
      if (event.state === State.END) {
        const nextIndex = Math.round(scrollXAnimated.value + 1);
        if (nextIndex - 1 >= data.length - 1) {
          return;
        }
        scrollXAnimated.value = withSpring(Math.floor(nextIndex), { damping: 50, stiffness: 100 });
      }
    })


  const lFling = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd((event) => {
      if (event.state === State.ACTIVE) return;
      if (event.state === State.END) {
        const prevIndex = Math.round(scrollXAnimated.value - 1)
        if (prevIndex + 1 <= 0) {
          return;
        }
        scrollXAnimated.value = withSpring(Math.floor(prevIndex), { damping: 50, stiffness: 100 });
      }
    });

  return (
    <GestureDetector gesture={rFling}>
      <GestureDetector gesture={lFling}>
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(item) => `trans.${item.id}.img`}
            horizontal
            inverted
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              padding: SPACING * 2,
            }}
            scrollEnabled={false}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index: idx,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, { zIndex: calculateZIndex(index, idx) }];
              return (
                <View style={newStyle} key={idx} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({ item, index: idx }) => {
              return (
                <CarouselImg item={item} idx={idx} scrollXAnimated={scrollXAnimated} />
              );
            }}
          />
          <CarouselItem data={data} scrollXAnimated={scrollXAnimated} />
        </View>
      </GestureDetector>
    </GestureDetector>
  )
}

export default Carousel;

function calculateZIndex(index: number, idx: number) {
  const distance = Math.abs(index - idx);
  const baseZIndex = 9999;
  const zIndexOffset = 99;

  return baseZIndex - zIndexOffset * distance;
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_WIDTH + OVERFLOW_HEIGHT + SPACING * 3,
    justifyContent: 'center',
  },
});
