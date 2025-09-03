import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const resources = {
  en: {
    common: '/locales/en/common.json',
    pages: '/locales/en/pages.json',
    components: '/locales/en/components.json'
  },
  ar: {
    common: '/locales/ar/common.json',
    pages: '/locales/ar/pages.json',
    components: '/locales/ar/components.json'
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'styleai-language',
      caches: ['localStorage'],
    },
    
    // Fallback language
    fallbackLng: 'en',
    
    // Available languages
    supportedLngs: ['en', 'ar'],
    
    // Debug mode (set to false in production)
    debug: false,
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'pages', 'components'],
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for better error handling
      bindI18n: 'languageChanged',
      bindI18nStore: false,
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },
    
    // Load resources immediately
    initImmediate: false,
  });

export default i18n;