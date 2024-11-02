import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = {
  setItem: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.warn(e);
    }
  },
  getItem: async (key: string) => {
    let jsonValue;
    try {
      jsonValue = await AsyncStorage.getItem(key);
      return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.warn("error getting data from local storage", e);
    }
    return jsonValue;
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(e);
    }
  },
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn(e);
    }
  }
}

export default storage
