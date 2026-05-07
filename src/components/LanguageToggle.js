import { useT } from '../i18n';

export default function LanguageToggle() {
  const { lang, setLang, t } = useT();
  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
      aria-label="switch language"
    >
      {t('languageSwitch')}
    </button>
  );
}
