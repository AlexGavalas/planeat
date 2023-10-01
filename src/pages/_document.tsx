import { ServerStyles, createStylesServer } from '@mantine/next';
import Document, { type DocumentContext } from 'next/document';

const stylesServer = createStylesServer();

export default class _Document extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                <ServerStyles
                    key="styles"
                    html={initialProps.html}
                    server={stylesServer}
                />,
            ],
        };
    }
}
