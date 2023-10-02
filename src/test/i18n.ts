import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enMessages from '../../public/locales/en/common.json';

i18n.use(initReactI18next)
    .init({
        lng: 'en',
        resources: {
            en: {
                translation: enMessages,
            },
        },
    })
    .catch(console.error);

export { i18n };
