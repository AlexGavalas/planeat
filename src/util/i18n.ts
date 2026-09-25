import { type SSRConfig } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

const allLocales = ['gr', 'en'];

export const getServerSideTranslations = async ({
    locale,
}: {
    locale?: string;
}): Promise<SSRConfig> =>
    serverSideTranslations(locale ?? 'en', ['common'], null, allLocales);
