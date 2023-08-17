import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import {
    type Session,
    SessionContextProvider,
} from '@supabase/auth-helpers-react';
import { appWithTranslation } from 'next-i18next';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Header } from '~features/header';
import { UserContext } from '~store/user-context';
import { type Database } from '~types/supabase';

import '../styles/globals.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const App = ({
    Component,
    pageProps,
}: AppProps<{ initialSession: Session }>) => {
    const [supabaseClient] = useState(() =>
        createBrowserSupabaseClient<Database>(),
    );

    return (
        <>
            <Head>
                <title>Planeat</title>
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'light',
                }}
            >
                <ModalsProvider>
                    <SessionContextProvider
                        supabaseClient={supabaseClient}
                        initialSession={pageProps.initialSession}
                    >
                        <QueryClientProvider client={queryClient}>
                            <UserContext>
                                <Header />
                                <Component {...pageProps} />
                            </UserContext>
                        </QueryClientProvider>
                    </SessionContextProvider>
                </ModalsProvider>
                <Notifications />
            </MantineProvider>
        </>
    );
};

export default appWithTranslation(App);
