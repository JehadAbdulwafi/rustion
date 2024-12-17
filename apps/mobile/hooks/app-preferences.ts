import { useCallback } from "react";
import { type MMKV } from "react-native-mmkv";
import * as Localization from "expo-localization";
import { z } from "zod";
import { create, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { store } from "@/hooks/storage";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

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
  // theme
  theme: z.enum(["light", "dark"]).default("dark"),
});

export type AppPreferences = z.infer<typeof appPrefsSchema>;

// migrate from old storage
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
  useAppLanguage,
  useTheme,
} = createSelectorHooks();

export const useSetAppPreferences = () => {
  return useCallback((change: Partial<AppPreferences>) => {
    return appPreferencesStore.setState(change);
  }, []);
};

export const useThemeActions = () => {
  const setAppPreferences = useSetAppPreferences();
  const theme = useTheme();

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setAppPreferences({ theme: newTheme });
    Appearance.setColorScheme(newTheme);
  }, [setAppPreferences]);

  const getThemeColor = useCallback(({ props, colorName }: {
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
  }) => {
    const colorFromProps = props[theme];
    return colorFromProps || Colors[theme][colorName];
  }, [theme]);

  return {
    theme,
    setTheme,
    getThemeColor,
  };
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
