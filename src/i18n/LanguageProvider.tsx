import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { defaultLanguage, isSupportedLanguage, locales, SupportedLanguage } from '../locales';

const LANGUAGE_STORAGE_KEY = 'sudoku-mystery:language';

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  text: (typeof locales)[SupportedLanguage];
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function detectDefaultLanguage(): SupportedLanguage {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const language = locale.split('-')[0]?.toLowerCase();
  return isSupportedLanguage(language) ? language : defaultLanguage;
}

async function loadStoredLanguage() {
  const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(storedLanguage) ? storedLanguage : undefined;
}

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => detectDefaultLanguage());

  useEffect(() => {
    let mounted = true;

    void loadStoredLanguage().then((storedLanguage) => {
      if (mounted && storedLanguage) {
        setLanguageState(storedLanguage);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      text: locales[language],
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
