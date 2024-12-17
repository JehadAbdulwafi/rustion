import { StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  callback: () => void;
  style: ViewStyle
}

export default function Control({ children, callback, style }: Props) {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      activeOpacity={0.3}
      onPress={() => {
        // resetControlTimeout();
        callback();
      }}
      style={[s.control, style]}>
      {children}
    </TouchableHighlight>
  );
}

export function NullControl() {
  return <View style={[s.control]} />;
}

const s = StyleSheet.create({
  control: {
    padding: 12,
  },
})
