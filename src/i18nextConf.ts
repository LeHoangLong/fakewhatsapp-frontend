import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const fallbackLng = ['vn'];
const availableLanguages = ['en', 'vn'];

i18n
  .use(Backend) // load translations using http (default                                               public/assets/locals/en/translations)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    fallbackLng,
    debug: true,
    nsSeparator: false,
    keySeparator: false,
    whitelist: availableLanguages,
    backend: {
      loadPath: '/language/{{lng}}.json'
    }
  });

console.log('init')

export default i18n;
