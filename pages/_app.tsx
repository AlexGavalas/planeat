import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import '../styles/globals.css';

import { Header } from '@features/header';

function MyApp({ Component, pageProps }: AppProps) {
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
                    <UserProvider supabaseClient={supabaseClient}>
                        <Header />
                        <Component {...pageProps} />
                    </UserProvider>
                </ModalsProvider>
            </MantineProvider>
        </>
    );
}

export default MyApp;
