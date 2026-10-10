import '@fontsource-variable/noto-sans';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
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

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';

const APPLE_STARTUP_SCREENS = [
    [320, 568, 2],
    [375, 667, 2],
    [414, 736, 3],
    [375, 812, 3],
    [414, 896, 2],
    [414, 896, 3],
    [390, 844, 3],
    [393, 852, 3],
    [402, 874, 3],
    [430, 932, 3],
    [440, 956, 3],
    [744, 1133, 2],
    [768, 1024, 2],
    [810, 1080, 2],
    [820, 1180, 2],
    [834, 1112, 2],
    [834, 1194, 2],
    [834, 1210, 2],
    [1024, 1366, 2],
    [1032, 1376, 2],
] as const;

const appleStartupImages = [
    '/images/apple-startup/apple-startup-1320x2868.png',
    ...APPLE_STARTUP_SCREENS.flatMap(([width, height, pixelRatio]) => {
        const media = `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${pixelRatio})`;
        const portraitWidth = width * pixelRatio;
        const portraitHeight = height * pixelRatio;

        return [
            {
                media: `${media} and (orientation: portrait)`,
                url: `/images/apple-startup/apple-startup-${portraitWidth}x${portraitHeight}.png`,
            },
            {
                media: `${media} and (orientation: landscape)`,
                url: `/images/apple-startup/apple-startup-${portraitHeight}x${portraitWidth}.png`,
            },
        ];
    }),
];

export const metadata: Metadata = {
    appleWebApp: {
        capable: true,
        startupImage: appleStartupImages,
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
    const [session, profile, isFoodDatabaseSearchEnabled, requestDate] =
        await Promise.all([
            getServerSession(),
            getCurrentUser(),
            foodDatabaseSearch(),
            getRequestDate(),
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
                startOfWeek(requestDate, { weekStartsOn: 1 }),
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
