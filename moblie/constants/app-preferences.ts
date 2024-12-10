import { useCallback, useEffect, useMemo } from "react";
import { Appearance, ColorSchemeName, Platform } from "react-native";
import { type MMKV } from "react-native-mmkv";
import * as Localization from "expo-localization";
import * as NavigationBar from "expo-navigation-bar";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { z } from "zod";
import { create, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { store } from "@/hooks/storage"


export const availableAppLanguages = [
  "en",
  "ar",
] as const;

const appLanguageSchema = z.enum(availableAppLanguages);

let defaultAppLanguage: z.infer<typeof appLanguageSchema> = "en";

const localeTag = Localization.getLocales()[0]?.languageTag;
const localeCode = Localization.getLocales()[0]?.languageCode;

const parseTag = appLanguageSchema.safeParse(localeTag);
const parseCode = appLanguageSchema.safeParse(localeCode);

if (parseTag.success) {
  defaultAppLanguage = parseTag.data;
} else if (parseCode.success) {
  defaultAppLanguage = parseCode.data;
}

export const appPrefsSchema = z.object({
  // language
  appLanguage: appLanguageSchema.default(defaultAppLanguage),
  primaryLanguage: z
    .string()
    .default(Localization.getLocales()[0]?.languageCode ?? "en"),
  contentLanguages: z.array(z.string()).default(
    Localization.getLocales()
      .filter((l) => l.languageCode)
      .map((l) => l.languageCode!),
  ),
  mostRecentLanguage: z.string().optional(),
  // pro stuff
  colorScheme: z.enum(["system", "light", "dark"]).default("system"),
});

export type AppPreferences = z.infer<typeof appPrefsSchema>;

// migrate from old store
const oldPrefs = mirgrateFromOldAppPreferences(store);

export const appPreferencesStore = create<AppPreferences>()(
  persist(() => ({ ...(oldPrefs ?? appPrefsSchema.parse({})) }), {
    name: "app-preferences",
    storage: createJSONStorage(() => ({
      setItem: (name, value) => store.set(name, value),
      getItem: (name) => store.getString(name) ?? null,
      removeItem: (name) => store.delete(name),
    })),
  }),
);

const createHookName = (str: string) =>
  "use" + str.at(0)?.toUpperCase() + str.slice(1);

function createSelectorHooks() {
  return Object.fromEntries(
    (Object.keys(appPrefsSchema.shape) as (keyof AppPreferences)[]).map(
      (key) => {
        const selector = (s: AppPreferences) => s[key];
        return [
          createHookName(key),
          () => useStore(appPreferencesStore, selector),
        ];
      },
    ),
  ) as Required<{
    [K in keyof AppPreferences as `use${Capitalize<K>}`]: () => AppPreferences[K];
  }>;
}

export const {
  useColorScheme,
  useContentLanguages,
  useAppLanguage,
  usePrimaryLanguage,
  useMostRecentLanguage,
} = createSelectorHooks();

export const useSetAppPreferences = () => {
  return useCallback((change: Partial<AppPreferences>) => {
    return appPreferencesStore.setState(change);
  }, []);
};

export const useThemeSetup = () => {
  const colorSchemePreference = useColorScheme();

  // sync nativewind
  useEffect(() => {
    Appearance.setColorScheme(colorSchemePreference as ColorSchemeName);
  }, [colorSchemePreference]);

  // sync navbar
  // TODO - investigate this being per-page
  // certain screens would look nicer with the dark style
  // or perhaps transparent navbar
  // (landing screen, image lightbox, etc)
  useEffect(() => {
    if (Platform.OS === "android") {
      if (colorSchemePreference === "light") {
        void NavigationBar.setButtonStyleAsync("dark");
        void NavigationBar.setBackgroundColorAsync(DefaultTheme.colors.card);
        void NavigationBar.setBorderColorAsync(DefaultTheme.colors.card);
      } else {
        void NavigationBar.setButtonStyleAsync("light");
        void NavigationBar.setBackgroundColorAsync(DarkTheme.colors.card);
        void NavigationBar.setBorderColorAsync(DarkTheme.colors.card);
      }
    }
  }, [colorSchemePreference]);

  return useMemo(() => {
    const base = colorSchemePreference === "dark" ? DarkTheme : DefaultTheme;
    return base;
  }, [colorSchemePreference]);
};

// fetch, parse, and delete old app preferences
function mirgrateFromOldAppPreferences(store: MMKV) {
  const oldPrefsStr = store.getString("app-prefs");
  if (oldPrefsStr) {
    store.delete("app-prefs");
    try {
      return appPrefsSchema.parse(JSON.parse(oldPrefsStr));
    } catch {
      return null;
    }
  }
  return null;
}
