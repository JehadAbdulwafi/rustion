/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef } from "react";
import { I18nManager } from "react-native";
import { i18n } from "@lingui/core";
import { I18nProvider as DefaultI18nProvider } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { messages as messagesAr } from "@/i18n/locales/ar/messages";
import { messages as messagesEn } from "@/i18n/locales/en/messages";
import { appPreferencesStore, useAppLanguage, type AppPreferences } from "@/hooks/app-preferences";

export const LANGUAGES = [
  { value: "ar", label: msg`Arabic` },
  { value: "en", label: msg`English` },
]

export function languageCodeToName(code: AppPreferences["appLanguage"]) {
  switch (code) {
    case "en": {
      return "English";
    }
    case "ar": {
      return "العربية";
    }
    default:
      throw new Error(`Unknown language code: ${code as string}`);
  }
}

export function loadAndActivateLanguage(locale: AppPreferences["appLanguage"]) {
  if (locale === "ar") {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } else {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
  switch (locale) {
    case "ar": {
      i18n.loadAndActivate({ locale, messages: messagesAr });
      break;
    }
    default: {
      i18n.loadAndActivate({ locale, messages: messagesEn });
      break;
    }
  }
}

export function initializeI18n() {
  loadAndActivateLanguage(appPreferencesStore.getState().appLanguage);
}

export function getLocalizedText(translations: { ar?: string; en?: string }, fallbackToOtherLanguage: boolean = true): string {
  const currentLocale = i18n.locale as 'ar' | 'en';

  if (translations[currentLocale]) {
    return translations[currentLocale]!;
  }

  if (fallbackToOtherLanguage) {
    const otherLocale = currentLocale === 'ar' ? 'en' : 'ar';
    if (translations[otherLocale]) {
      return translations[otherLocale]!;
    }
  }

  return '';
}

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = useAppLanguage();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    loadAndActivateLanguage(language);
  }, [language]);

  return <DefaultI18nProvider i18n={i18n}>{children}</DefaultI18nProvider>;
}
