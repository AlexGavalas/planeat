import {
    Autocomplete,
    Button,
    Card,
    Container,
    Group,
    NumberInput,
    Select,
    Space,
    Switch,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useQuery } from 'react-query';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { LoadingOverlay } from '~components/loading-overlay';
import { DeleteAccount } from '~features/delete-account';
import { MeasurementsTable } from '~features/measurements/table';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

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
            ...(await serverSideTranslations(profile?.language || 'en', [
                'common',
            ])),
        },
    };
};

export default function Settings() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [height, setHeight] = useState<number>();
    const [targetWeight, setTargetWeight] = useState<number>();
    const [language, setLanguage] = useState<string>();
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 250);
    const { profile, updateProfile } = useProfile();
    const supabaseClient = useSupabaseClient<Database>();

    const { data: nutritionists = [], isFetching } = useQuery(
        ['nutritionists', debouncedSearchQuery],
        async () => {
            return supabaseClient
                .from('users')
                .select('*')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .neq('email', profile?.email)
                .limit(5);
        },
        {
            select: ({ data }) =>
                (data || []).map(({ full_name }) => full_name),
            enabled: Boolean(debouncedSearchQuery),
        },
    );

    const nothingFoundLabel =
        debouncedSearchQuery && !isFetching && !nutritionists?.length
            ? t('no_data')
            : '';

    return (
        <Container>
            <Title order={3}>
                {t('account_settings.sections.general.title')}
            </Title>
            <Group position="apart">
                <Switch
                    label={t('am_nutritionist')}
                    checked={profile?.is_nutritionist}
                    onChange={({ target: { checked } }) =>
                        updateProfile({ isNutritionist: checked })
                    }
                />
                <Autocomplete
                    label={t('find_your_nutritionist')}
                    placeholder={t('search')}
                    data={nutritionists}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    nothingFound={nothingFoundLabel}
                />
            </Group>
            <Space h="lg" />
            {profile ? (
                <Group grow align="end">
                    <NumberInput
                        label={t('height_input')}
                        defaultValue={profile.height ?? undefined}
                        onChange={(value) => setHeight(Number(value))}
                    />
                    <NumberInput
                        label={t('target_weight_input')}
                        defaultValue={profile.target_weight ?? undefined}
                        onChange={(value) => setTargetWeight(Number(value))}
                    />
                    <Select
                        label={t('languages.label')}
                        placeholder={t('languages.placeholder')}
                        defaultValue={profile.language}
                        onChange={(value) => {
                            setLanguage(value ?? undefined);
                        }}
                        data={[
                            {
                                value: 'en',
                                label: t('languages.options.en'),
                            },
                            {
                                value: 'gr',
                                label: t('languages.options.el'),
                            },
                        ]}
                    />
                    <Button
                        onClick={() => {
                            updateProfile({
                                language,
                                height,
                                targetWeight,
                            });
                        }}
                    >
                        {t('save')}
                    </Button>
                </Group>
            ) : (
                <Card style={{ height: 60 }}>
                    <LoadingOverlay visible />
                </Card>
            )}
            <Space h="lg" />
            <MeasurementsTable />
            <Space h="lg" />
            <DeleteAccount />
        </Container>
    );
}
