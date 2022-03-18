import type { AppProps } from 'next/app';
import Head from 'next/head';
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
                    <Header />
                    <Component {...pageProps} />
                </ModalsProvider>
            </MantineProvider>
        </>
    );
}

export default MyApp;
