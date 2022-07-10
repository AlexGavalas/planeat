import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from 'react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
    getUser,
    supabaseClient,
    supabaseServerClient,
    withPageAuth,
} from '@supabase/auth-helpers-nextjs';

import {
    Container,
    Group,
    Button,
    Switch,
    Divider,
    Autocomplete,
    NumberInput,
} from '@mantine/core';

import { MeasurementsTable } from '@features/measurements/table';
import { useProfile } from '@hooks/use-profile';

export const getServerSideProps = withPageAuth({
    redirectTo: '/',
    getServerSideProps: async (context) => {
        const { user } = await getUser(context);

        if (!user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const { data: profile } = await supabaseServerClient(context)
            .from<Profile>('users')
            .select('language')
            .eq('id', user.id)
            .single();

        return {
            props: {
                ...(await serverSideTranslations(profile?.language || 'en', [
                    'common',
                ])),
            },
        };
    },
});

const Settings = () => {
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');
    const [height, setHeight] = useState<number>();

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 250);

    const { profile, updateProfile } = useProfile();

    const { data: nutritionists = [], isFetching } = useQuery(
        ['nutritionists', debouncedSearchQuery],
        async () => {
            return supabaseClient
                .from<Profile>('users')
                .select('*')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .limit(5);
        },
        {
            select: ({ data }) =>
                (data || []).map(({ full_name }) => full_name),
            enabled: Boolean(debouncedSearchQuery),
        }
    );

    const nothingFoundLabel =
        debouncedSearchQuery && !isFetching && !nutritionists?.length
            ? t('no_data')
            : '';

    return (
        <Container>
            <Group position="apart" mt={10}>
                <Switch
                    label={t('am_nutritionist')}
                    checked={profile?.is_nutritionist || false}
                    onChange={({ target: { checked } }) => {
                        updateProfile({ isNutritionist: checked });
                    }}
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
            <Divider my={20} />
            {profile && (
                <Group align="end">
                    <NumberInput
                        label={t('height_input')}
                        style={{ width: '25%' }}
                        defaultValue={profile?.height}
                        onChange={setHeight}
                    />
                    <Button
                        onClick={() => {
                            updateProfile({ height });
                        }}
                    >
                        {t('save')}
                    </Button>
                </Group>
            )}
            <Divider my={20} />
            <MeasurementsTable />
        </Container>
    );
};

export default Settings;
