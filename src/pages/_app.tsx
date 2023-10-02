import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { type SessionProviderProps } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { type DehydratedState } from 'react-query';

import { Header } from '~features/header';
import { Onboarding } from '~features/onboarding';
import { Providers } from '~features/providers';

import '../styles/globals.css';

const App = ({
    Component,
    pageProps,
}: AppProps<{
    session: SessionProviderProps['session'];
    dehydratedState: DehydratedState;
}>) => {
    return (
        <>
            <Head>
                <title>Planeat</title>
            </Head>
            <Providers
                dehydratedState={pageProps.dehydratedState}
                session={pageProps.session}
            >
                <Onboarding />
                <Header />
                <div className="container">
                    <Component {...pageProps} />
                </div>
            </Providers>
        </>
    );
};

export default appWithTranslation(App);
