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
}: AppProps<{
    session: SessionProviderProps['session'];
}>) => {
    const [supabaseClient] = useState(() =>
        createPagesBrowserClient<Database>(),
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
                <SessionContextProvider supabaseClient={supabaseClient}>
                    <SessionProvider session={pageProps.session}>
                        <QueryClientProvider client={queryClient}>
                            <ModalsProvider>
                                <UserContext>
                                    <Header />
                                    <Component {...pageProps} />
                                </UserContext>
                                <Notifications />
                            </ModalsProvider>
                        </QueryClientProvider>
                    </SessionProvider>
                </SessionContextProvider>
            </MantineProvider>
        </>
    );
};

export default appWithTranslation(App);
