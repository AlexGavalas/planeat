import { type GetStaticProps } from 'next';

import { getServerSideTranslations } from '~util/i18n';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            ...(await getServerSideTranslations({
                locale: 'en',
            })),
        },
    };
};

export default function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for could not be found.</p>
        </div>
    );
}
