import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

type Props = {
  loading: boolean;
}

const PlayerLoader = ({ loading }: Props) => {
  const rotate = useRef(new Animated.Value(0)).current;
  const MAX_VALUE = 360;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotate, {
          toValue: MAX_VALUE,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    } else {
      rotate.setValue(0);
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.Image
          source={require('../../assets/img/loader-icon.png')}
          style={[
            styles.icon,
            {
              transform: [
                {
                  rotate: rotate.interpolate({
                    inputRange: [0, MAX_VALUE],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 7,
  },
});

export default PlayerLoader;
