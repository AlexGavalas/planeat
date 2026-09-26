import { type SSRConfig } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import nextI18NextConfig from '../../next-i18next.config';

const allLocales = ['gr', 'en'];

export const getServerSideTranslations = async ({
    locale,
}: {
    locale?: string;
}): Promise<SSRConfig> =>
    serverSideTranslations(
        locale ?? 'en',
        ['common'],
        nextI18NextConfig,
        allLocales,
    );
