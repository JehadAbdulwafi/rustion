import { create } from "zustand";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";
import { store } from "./storage";

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
    const storedTheme = store.getString(THEME_STORAGE_KEY);
    return storedTheme ? JSON.parse(storedTheme) : DefaultTheme;
  } catch (error) {
    console.warn("Error loading theme:", error);
    return DefaultTheme;
  }
};

const persistTheme = (theme: "light" | "dark") => {
   store.set(THEME_STORAGE_KEY, JSON.stringify(theme));
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
  getThemeColor: (props: ThemeColorProps) => {
    const theme = get().theme;
    const colorFromProps = props.props[theme];
    return colorFromProps || Colors[theme][props.colorName];
  }
}));

initializeTheme().then(theme => {
  useTheme.getState().setTheme(theme);
});

export default useTheme;
