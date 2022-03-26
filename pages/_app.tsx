import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../styles/globals.css';

import { Header } from '@features/header';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const App = ({ Component, pageProps, router }: AppProps) => {
    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') {
                    router.push('/home');
                } else if (event === 'SIGNED_OUT') {
                    router.push('/');
                }
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

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
                <NotificationsProvider>
                    <ModalsProvider>
                        <UserProvider supabaseClient={supabaseClient}>
                            <QueryClientProvider client={queryClient}>
                                <Header />
                                <Component {...pageProps} />
                            </QueryClientProvider>
                        </UserProvider>
                    </ModalsProvider>
                </NotificationsProvider>
            </MantineProvider>
        </>
    );
};

export default App;
