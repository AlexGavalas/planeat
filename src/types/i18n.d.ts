import type enCommon from '../../public/locales/en/common.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            common: typeof enCommon;
        };
    }
}
