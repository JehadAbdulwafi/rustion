import { StyleSheet } from 'react-native';
import Control from './control';
import { PauseIcon, PlayIcon } from '../../assets/icons';
import { ViewStyle } from '@tamagui/core';

type Props = {
  paused: boolean
  togglePlayPause: () => void
  styles: ViewStyle
}

export default function PlayPause({ paused, togglePlayPause, styles }: Props) {
  const style = { ...styles, ...s.playPause };
  let source =
    paused === true
      ? <PlayIcon height={18} width={18} />
      : <PauseIcon height={18} width={18} />;
  return (
    <Control
      children={source}
      callback={togglePlayPause}
      style={style}
    />
  );
}

const s = StyleSheet.create({
  playPause: {
    position: 'relative',
    zIndex: 0,
  },
})
