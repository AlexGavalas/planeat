import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const allLocales = ['gr', 'en'];

export const getServerSideTranslations = async ({
    locale,
}: {
    locale?: string;
}) => serverSideTranslations(locale || 'en', ['common'], null, allLocales);
