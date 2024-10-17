import { Image, StyleSheet, View } from "react-native";

type Props = {
  volumeFillWidth: number,
  volumeTrackWidth: number,
  volumePosition: number,
  volumePanResponder: any
}

const Volume = ({ volumeFillWidth, volumeTrackWidth, volumePosition, volumePanResponder }: Props) => {

  return (
    <View style={styles.container}>
      <View
        style={[styles.fill, { width: volumeFillWidth }]}
      />
      <View
        style={[styles.track, { width: volumeTrackWidth }]}
      />
      <View
        style={[styles.handle, { left: volumePosition }]}
        {...volumePanResponder.panHandlers}>
        <Image
          style={styles.icon}
          source={require('../../assets/img/volume.png')}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    height: 1,
    marginLeft: 20,
    marginRight: 20,
    width: 150,
  },
  track: {
    backgroundColor: '#333',
    height: 1,
    marginLeft: 7,
  },
  fill: {
    backgroundColor: '#FFF',
    height: 1,
  },
  handle: {
    position: 'absolute',
    marginTop: -24,
    marginLeft: -24,
    padding: 16,
  },
  icon: {
    marginLeft: -7,
  },
})
export default Volume; 
