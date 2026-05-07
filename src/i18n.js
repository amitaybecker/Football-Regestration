import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  he: {
    appTitle: 'הרשמה למשחק',
    noActiveGame: 'אין משחק פעיל כרגע',
    createGameCta: 'צור משחק חדש',
    newGame: 'משחק חדש',
    createNewGameTitle: 'יצירת משחק',
    date: 'תאריך',
    time: 'שעה',
    maxPlayers: 'מקסימום שחקנים',
    create: 'צור',
    cancel: 'בטל',
    save: 'שמור',
    gameOn: 'משחק ב-{date} בשעה {time}',
    registeredPlayers: 'שחקנים רשומים',
    yourName: 'השם שלך',
    register: 'הירשם',
    spotsRemaining: 'נותרו {n} מקומות',
    gameFull: 'המשחק מלא',
    replaceGameWarning: 'יצירת משחק חדש תמחק את ההרשמות הנוכחיות. להמשיך?',
    nameRequired: 'נא להזין שם',
    alreadyRegistered: 'שם זה כבר רשום — ערוך או מחק את הרישום הקיים',
    confirmDelete: 'למחוק את ההרשמה של {name}?',
    edit: 'ערוך',
    delete: 'מחק',
    of: 'מתוך',
    notConfigured: 'Firebase לא מוגדר. הוסף את המשתנים ב-.env והפעל מחדש.',
    loading: 'טוען...',
    invalidMaxPlayers: 'מספר שחקנים חייב להיות בין 1 ל-50',
    invalidDateTime: 'נא לבחור תאריך ושעה',
    languageSwitch: 'EN',
  },
  en: {
    appTitle: 'Game Registration',
    noActiveGame: 'No active game right now',
    createGameCta: 'Create a new game',
    newGame: 'New game',
    createNewGameTitle: 'Create game',
    date: 'Date',
    time: 'Time',
    maxPlayers: 'Max players',
    create: 'Create',
    cancel: 'Cancel',
    save: 'Save',
    gameOn: 'Game on {date} at {time}',
    registeredPlayers: 'Registered players',
    yourName: 'Your name',
    register: 'Register',
    spotsRemaining: '{n} spots remaining',
    gameFull: 'Game is full',
    replaceGameWarning: 'Creating a new game will delete current registrations. Continue?',
    nameRequired: 'Please enter a name',
    alreadyRegistered: 'This name is already registered — edit or remove the existing entry',
    confirmDelete: "Remove {name}'s registration?",
    edit: 'Edit',
    delete: 'Delete',
    of: 'of',
    notConfigured: 'Firebase is not configured. Add env vars to .env and restart.',
    loading: 'Loading...',
    invalidMaxPlayers: 'Max players must be between 1 and 50',
    invalidDateTime: 'Please pick date and time',
    languageSwitch: 'עב',
  },
};

const LangContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'he');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((next) => {
    localStorage.setItem('lang', next);
    setLangState(next);
  }, []);

  const t = useCallback(
    (key, params) => {
      let text = translations[lang][key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, v);
        }
      }
      return text;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useT must be used inside <LanguageProvider>');
  return ctx;
}
