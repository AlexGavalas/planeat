import { Container, Stack, Title } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Card } from '~components/card';
import { FindUsers } from '~features/find-users';
import { ManageConnectionRequests } from '~features/manage-connection-requests';
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
            <Stack spacing="md">
                <Title order={3}>{t('connections.title')}</Title>
                <Card>
                    <FindUsers />
                </Card>
                <Card>
                    <Title order={3}>
                        {t('connections.manage_connection_requests.title')}
                    </Title>
                    <ManageConnectionRequests />
                </Card>
            </Stack>
        </Container>
    );
}
