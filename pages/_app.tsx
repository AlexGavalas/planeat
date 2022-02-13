import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { Header } from '../features/header';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
