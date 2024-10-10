import { StyleSheet } from 'react-native';
import Control from './control';
import { XIcon } from '../../assets/icons';
import { ViewStyle } from '@tamagui/core';

type Props = {
  hideControls: () => void
  styles: ViewStyle
}

export default function HideContorls({ hideControls, styles }: Props) {
  const style = { ...styles, ...s.playPause };
  return (
    <Control
      children={<XIcon height={18} width={18} />}
      callback={hideControls}
      style={style}
    />
  );
}

const s = StyleSheet.create({
  playPause: {
    zIndex: 0,
  },
})

