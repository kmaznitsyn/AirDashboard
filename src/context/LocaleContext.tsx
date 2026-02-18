import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Translations, translations } from '../constants/i18n';

const STORAGE_KEY = '@air_dashboard_language';
const DEFAULT_LANG: Language = 'uk';   // Ukrainian is the default

interface LocaleContextValue {
  lang:         Language;
  t:            Translations;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  lang:         DEFAULT_LANG,
  t:            translations[DEFAULT_LANG],
  toggleLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(DEFAULT_LANG);

  // Load persisted language on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'uk' || saved === 'en') setLang(saved);
    });
  }, []);

  const toggleLocale = () => {
    setLang((prev) => {
      const next: Language = prev === 'uk' ? 'en' : 'uk';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <LocaleContext.Provider value={{ lang, t: translations[lang], toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
