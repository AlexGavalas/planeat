import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import {
    type DehydratedState,
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from 'react-query';

import { Header } from '~features/header';
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
    const [supabaseClient] = useState(() =>
        createPagesBrowserClient<Database>(),
    );

    const [queryClient] = useState(() => {
        return new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnMount: false,
                },
            },
        });
    });

    return (
        <>
            <Head>
                <title>Planeat</title>
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colors: {
                        brand: [
                            '#04A670',
                            '#049766',
                            '#04895D',
                            '#047D55',
                            '#04724D',
                            '#046745',
                            '#045D3E',
                            '#045438',
                            '#044C32',
                        ],
                    },
                    primaryColor: 'brand',
                    colorScheme: 'light',
                }}
            >
                <SessionContextProvider supabaseClient={supabaseClient}>
                    <SessionProvider session={pageProps.session}>
                        <QueryClientProvider client={queryClient}>
                            <Hydrate state={pageProps.dehydratedState}>
                                <ModalsProvider>
                                    <UserContext>
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
