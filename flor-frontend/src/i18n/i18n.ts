import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationsES from './es.json';
// import translationsEN from './i18n/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
    //   en: {
    //     translation: translationsEN,
    //   },
      es: {
        translation: translationsES,
      },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
