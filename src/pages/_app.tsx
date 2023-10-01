import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { useMemo } from 'react';
import {
    type DehydratedState,
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from 'react-query';

import { BRAND_COLORS } from '~constants/colors';
import { Header } from '~features/header';
import { Onboarding } from '~features/onboarding';
import { UserContext } from '~store/user-context';
import { type Database } from '~types/supabase';

import '../styles/globals.css';

const App = ({
    Component,
    pageProps,
}: AppProps<{
    session: SessionProviderProps['session'];
    dehydratedState: DehydratedState;
}>) => {
    const supabaseClient = useMemo(
        () => createPagesBrowserClient<Database>(),
        [],
    );

    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnMount: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
        [],
    );

    return (
        <>
            <Head>
                <title>Planeat</title>
            </Head>
            <MantineProvider
                theme={{
                    colors: {
                        brand: BRAND_COLORS,
                    },
                    primaryColor: 'brand',
                }}
            >
                <SessionContextProvider supabaseClient={supabaseClient}>
                    <SessionProvider session={pageProps.session}>
                        <QueryClientProvider client={queryClient}>
                            <Hydrate state={pageProps.dehydratedState}>
                                <ModalsProvider>
                                    <UserContext>
                                        <Onboarding />
                                        <Header />
                                        <div className="container">
                                            <Component {...pageProps} />
                                        </div>
                                    </UserContext>
                                    <Notifications />
                                </ModalsProvider>
                            </Hydrate>
                        </QueryClientProvider>
                    </SessionProvider>
                </SessionContextProvider>
            </MantineProvider>
        </>
    );
};

export default appWithTranslation(App);
