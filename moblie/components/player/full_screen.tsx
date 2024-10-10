import { StyleSheet, ViewStyle } from "react-native";
import Control from "./control";
import { FullScreenEnterIcon, FullScreenExitIcon } from "../../assets/icons";

type Props = {
  isFullScreen: boolean
  toggleFullscreen: () => void
  styles: ViewStyle
}

const Fullscreen = ({ isFullScreen, toggleFullscreen, styles }: Props) => {
  const style = { ...styles, ...s.fullscreen };
  let source =
    !isFullScreen
      ? <FullScreenEnterIcon height={18} width={18} />
      : <FullScreenExitIcon height={18} width={18} />;
  return (
    <Control
      children={source}
      callback={toggleFullscreen}
      style={style}
    />
  );
}

export default Fullscreen;

const s = StyleSheet.create({
  fullscreen: {
    position: 'relative',
    zIndex: 0,
  },
})
