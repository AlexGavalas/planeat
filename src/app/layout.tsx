// sort-imports-ignore -- Mantine extension styles must load after core styles.
import '@fontsource-variable/noto-sans';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { dehydrate } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';
import { type Metadata, type Viewport } from 'next';
import { Suspense, type ReactNode } from 'react';

import { getCurrentUser, getRequestDate, getServerSession } from '~api/session';
import { AppStartup } from '~components/app-startup';
import { Providers } from '~features/providers';
import { foodDatabaseSearch } from '~flags';
import { getResources, getT } from '~util/i18n';
import { createQueryClient } from '~util/query-client';

import '../styles/globals.css';

export const metadata: Metadata = {
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Planeat',
    },
    applicationName: 'Planeat',
    description: 'Plan meals, track health, and eat better together.',
    title: 'Planeat',
};

export const viewport: Viewport = {
    colorScheme: 'light',
    themeColor: '#047d55',
    viewportFit: 'cover',
};
async function AppContent({ children }: Readonly<{ children: ReactNode }>) {
    const [session, profile, isFoodDatabaseSearchEnabled] = await Promise.all([
        getServerSession(),
        getCurrentUser(),
        foodDatabaseSearch(),
    ]);

    const language = profile?.language === 'gr' ? 'gr' : 'en';

    const { i18n } = await getT('common', { lng: language });

    const queryClient = createQueryClient();

    queryClient.setQueryData(['user'], profile);

    return (
        <Providers
            key={profile?.id ?? 'anonymous'}
            dehydratedState={dehydrate(queryClient)}
            featureFlags={{ isFoodDatabaseSearchEnabled }}
            initialWeek={format(
                startOfWeek(getRequestDate(), { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            )}
            language={language}
            resources={getResources(i18n, ['common'])}
            session={session}
        >
            {children}
        </Providers>
    );
}

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html data-scroll-behavior="smooth" lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Suspense fallback={<AppStartup />}>
                    <AppContent>{children}</AppContent>
                </Suspense>
            </body>
        </html>
    );
}
