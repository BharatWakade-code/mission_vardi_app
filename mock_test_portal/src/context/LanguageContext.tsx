import React, { createContext, useContext, useState, useEffect } from 'react';

type UILanguage = 'en' | 'mr';

interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  t: (enText: string, mrText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<UILanguage>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pariksha_lang') as UILanguage;
      if (saved) setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pariksha_lang', lang);
    }
  };

  const t = (enText: string, mrText?: string): string => {
    if (language === 'mr' && mrText) {
      return mrText;
    }
    return enText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
