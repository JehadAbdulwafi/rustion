import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Appearance } from "react-native";
import storage from "./storage";
import { Colors } from "@/constants/Colors";

type ThemeColorProps = {
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark

}

export type LocateState = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  getThemeColor: (props: ThemeColorProps) => string
};

const DefaultTheme = "dark";

const useTheme = create(
  persist<LocateState>(
    (set, get) => ({
      theme: DefaultTheme,
      setTheme: (theme: "light" | "dark") => {
        Appearance.setColorScheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const theme = get().theme === "light" ? "dark" : "light";
        Appearance.setColorScheme(theme);
        set({ theme });
      },
      getThemeColor: ({ props, colorName }) => {
        const theme = get().theme;
        const colorFromProps = props[theme];

        if (colorFromProps) {
          return colorFromProps;
        } else {
          return Colors[theme][colorName];
        }
      }
    }),
    {
      name: "locale",
      storage,
    }
  )
);

export default useTheme;

