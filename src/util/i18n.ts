import { createServerI18next } from 'next-i18next/server';
import 'server-only';

import en from '../../public/locales/en/common.json';
import gr from '../../public/locales/gr/common.json';

export const { getT, getResources } = createServerI18next({
    defaultNS: 'common',
    fallbackLng: 'en',
    resources: { en: { common: en }, gr: { common: gr } },
    supportedLngs: ['en', 'gr'],
});
