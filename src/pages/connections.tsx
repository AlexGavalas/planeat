import { Container, Title } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Card } from '~components/card';
import { FindUsers } from '~features/find-users';
import { type Database } from '~types/supabase';
import { getServerSideTranslations } from '~util/i18n';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);

    const session = await getServerSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { user } = session;

    invariant(user?.email, 'User email must exist in session');

    const profile = await fetchUser({ email: user.email, supabase });

    invariant(profile, `Profile was not found for user email ${user.email}`);

    return {
        props: {
            ...(await getServerSideTranslations({ locale: profile.language })),
        },
    };
};

export default function Connections() {
    const { t } = useTranslation();

    return (
        <Container>
            <Title order={3}>{t('connections.label')}</Title>
            <Card>
                <FindUsers />
            </Card>
        </Container>
    );
}
