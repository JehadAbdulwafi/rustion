import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SharedValue, withSpring } from "react-native-reanimated";
import { View } from "./ui/View";
import { Text } from "./ui/Text";
import { springConfig } from "@/constants/utils";

const { width } = Dimensions.get("screen");

const listData = Array(50)
  .fill(null)
  .map((_, i) => `https://picsum.photos/200/300?random=${i}`);

const ListItem = ({
  onSelect,
}: {
  onSelect: (item: string | null) => void;
}) => {
  return (
    <FlatList
      keyExtractor={(item) => item}
      data={listData}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item}
          onPress={() => onSelect(item)}
          activeOpacity={0.9}
        >
          <View style={styles.videoTumbnail}>
            <Image
              style={styles.tumbnail}
              source={{ uri: item }}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.title}>Some title</Text>
          <Text style={styles.subTitle}>Some description</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default function List({
  translateY,
  setSelectedItem,
  selectedItem,
}: {
  translateY: SharedValue<number>;
  setSelectedItem: (item: string | null) => void;
  selectedItem: string | null;
}) {
  const onSelect = (item: string | null) => {
    if (!item) {
      setSelectedItem(null);
      return;
    }
    if (item === selectedItem) {
      translateY.value = withSpring(0, springConfig(2));
      return;
    }
    translateY.value = withSpring(0, springConfig(2));
    setSelectedItem(item);
  };
  return (
    <View style={styles.flex}>
      <ListItem onSelect={onSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    overflow: "hidden",
  },
  subContainer: {
    backgroundColor: "#fff",
    ...StyleSheet.absoluteFillObject,
  },
  fillWidth: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexRow: {
    flexDirection: "row",
  },
  tumbnail: {
    height: "100%",
    width: "100%",
  },
  videoTumbnail: {
    height: width / 2,
    backgroundColor: "#000",
  },
  title: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 13,
    color: "#aaa",
    marginHorizontal: 20,
    marginBottom: 25,
  },
  selectedItemDetails: {
    backgroundColor: "#fff",
  },
  logo: {
    height: 50,
    width: 150,
  },
  close: {
    alignSelf: "center",
  },
});
