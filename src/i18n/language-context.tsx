"use client";

import * as React from "react";

type Locale = "en" | "bn";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

// Import translations
import enMessages from "../../messages/en.json";
import bnMessages from "../../messages/bn.json";

const messages: Record<Locale, Record<string, any>> = {
  en: enMessages,
  bn: bnMessages,
};

function translate(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: any = messages[locale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return key if not found
    }
  }

  if (typeof value === "string") {
    // Replace {placeholder} with provided params
    return value;
  }
  return key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  // Load saved locale from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved === "bn" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Update html lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = React.useCallback(
    (key: string) => translate(locale, key),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}
