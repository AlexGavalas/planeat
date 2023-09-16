import { Container, Space, Tabs } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Activities } from '~features/activities';
import { AdvancedSettings } from '~features/advanced-settings';
import { DeleteAccount } from '~features/delete-account';
import { FoodPreferences } from '~features/food-preferences';
import { Measurements } from '~features/measurements';
import { PersonalSettings } from '~features/personal-settings';
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

    return {
        props: {
            ...(await getServerSideTranslations({ locale: profile?.language })),
        },
    };
};

export default function Settings() {
    const { t } = useTranslation();

    return (
        <Container>
            <Tabs defaultValue="measurements">
                <Tabs.List>
                    <Tabs.Tab value="measurements">
                        {t('measurements')}
                    </Tabs.Tab>
                    <Tabs.Tab value="personal">{t('personal_info')}</Tabs.Tab>
                    <Tabs.Tab value="advanced">
                        {t('advanced_settings')}
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="measurements" pt="md">
                    <Measurements />
                    <Space h="lg" />
                    <Activities />
                </Tabs.Panel>
                <Tabs.Panel value="personal" pt="md">
                    <PersonalSettings />
                    <Space h="lg" />
                    <FoodPreferences />
                </Tabs.Panel>
                <Tabs.Panel value="advanced" pt="md">
                    <AdvancedSettings />
                    <Space h="lg" />
                    <DeleteAccount />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
