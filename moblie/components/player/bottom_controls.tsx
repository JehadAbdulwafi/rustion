import { Animated, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayPause from './play_pause';
import Fullscreen from './full_screen';
import { animationsTypes } from './player';

type Props = {
  paused: boolean;
  togglePlayPause: () => void;
  isFullScreen: boolean;
  toggleFullscreen: () => void;
  animations: animationsTypes;
}

export default function BottomControls({ paused, togglePlayPause, isFullScreen, toggleFullscreen, animations }: Props) {
  const marginBottom = animations.bottomControl.marginBottom;
  const opacity = animations.bottomControl.opacity;

  return (
    <Animated.View
      style={[
        styles.bottom,
        {
          opacity,
          marginBottom,
        },
      ]}>
      <ImageBackground
        source={require('../../assets/img/bottom-vignette.png')}
        style={[styles.column]}
        imageStyle={[styles.vignette]}>
        <SafeAreaView
          style={[styles.row, styles.bottomControlGroup]}>
          <PlayPause paused={paused} styles={{ backgroundColor: 'rgba(150,150,150,0.2)', borderRadius: 10 }} togglePlayPause={togglePlayPause} />
          <Fullscreen isFullScreen={isFullScreen} styles={{ backgroundColor: 'rgba(150,150,150,0.2)', borderRadius: 10 }} toggleFullscreen={toggleFullscreen} />
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: null,
    width: null,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: null,
    width: null,
  },
  vignette: {
    resizeMode: 'stretch',
  },
  bottom: {
    alignItems: 'stretch',
    flex: 2,
    justifyContent: 'flex-end',
  },
  bottomControlGroup: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
  },
})
