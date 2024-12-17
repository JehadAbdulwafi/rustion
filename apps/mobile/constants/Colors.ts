import { msg } from "@lingui/core/macro";
import {
  light,
  dark,
} from "../theme-output";

export const Colors = {
  light: {
    text: light.color,
    background: light.background,
    tint: light.accentColor,
    icon: light.color,
    card: light.background,
    tabIconDefault: light.color,
    tabIconSelected: light.accentColor,
  },
  dark: {
    text: dark.color,
    background: dark.background,
    tint: dark.accentColor,
    icon: dark.color,
    card: dark.background,
    tabIconDefault: dark.color,
    tabIconSelected: dark.accentColor,
  },
};


export const THEMES_LIST = [
  { value: "dark", label: msg`Dark` },
  { value: "light", label: msg`Light` },
]