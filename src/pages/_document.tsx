import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
    <Html lang="en" {...mantineHtmlProps}>
        <Head>
            <ColorSchemeScript />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
);

export default Document;
