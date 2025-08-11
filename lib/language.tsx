'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from './i18n';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/lang=(\w+)/);
      return (match?.[1] as Lang) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.cookie = `lang=${lang}; path=/`;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}
