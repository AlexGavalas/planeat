import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { dehydrate } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';
import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { getCurrentUser, getRequestDate, getServerSession } from '~api/session';
import { Providers } from '~features/providers';
import { getResources, getT } from '~util/i18n';
import { createQueryClient } from '~util/query-client';

import '../styles/globals.css';

export const metadata: Metadata = { title: 'Planeat' };
export default async function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    const [session, profile] = await Promise.all([
        getServerSession(),
        getCurrentUser(),
    ]);
    const language = profile?.language === 'gr' ? 'gr' : 'en';
    const { i18n } = await getT('common', { lng: language });
    const queryClient = createQueryClient();
    queryClient.setQueryData(['user'], profile);
    return (
        <html lang={language === 'gr' ? 'el' : 'en'} {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Providers
                    key={profile?.id ?? 'anonymous'}
                    dehydratedState={dehydrate(queryClient)}
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
            </body>
        </html>
    );
}
