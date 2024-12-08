import { create } from "zustand";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

type ThemeColorProps = {
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
}

export type LocateState = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  getThemeColor: (props: ThemeColorProps) => string;
};

const THEME_STORAGE_KEY = "app-theme";
const DefaultTheme = "dark";

const initializeTheme = async () => {
  try {
    const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme ? JSON.parse(storedTheme) : DefaultTheme;
  } catch (error) {
    console.warn("Error loading theme:", error);
    return DefaultTheme;
  }
};

const persistTheme = async (theme: "light" | "dark") => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.warn("Error saving theme:", error);
  }
};

const useTheme = create<LocateState>((set, get) => ({
  theme: DefaultTheme,
  setTheme: (theme: "light" | "dark") => {
    Appearance.setColorScheme(theme);
    set({ theme });
    persistTheme(theme);
  },
  toggleTheme: () => {
    const newTheme = get().theme === "light" ? "dark" : "light";
    Appearance.setColorScheme(newTheme);
    set({ theme: newTheme });
    persistTheme(newTheme);
  },
  getThemeColor: ({ props, colorName }) => {
    const theme = get().theme;
    const colorFromProps = props[theme];
    return colorFromProps || Colors[theme][colorName];
  }
}));

initializeTheme().then(theme => {
  useTheme.getState().setTheme(theme);
});

export default useTheme;
