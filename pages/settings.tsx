import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
    getUser,
    supabaseClient,
    supabaseServerClient,
    withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs';

import {
    Container,
    Group,
    Button,
    Switch,
    Divider,
    Autocomplete,
    NumberInput,
} from '@mantine/core';

import { WeightTable } from '@features/measurements/weight';

export const getServerSideProps = withAuthRequired({
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

    const { user } = useUser();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [height, setHeight] = useState<number>();

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 250);

    const { data: profile } = useQuery(
        ['user'],
        async () => {
            if (!user) return;

            const { data } = await supabaseClient
                .from<Profile>('users')
                .select('*')
                .eq('id', user.id)
                .single();

            return data;
        },
        {
            enabled: Boolean(user),
        }
    );

    const { mutate } = useMutation(
        async (value: boolean) => {
            if (!user) return;

            const { data, error } = await supabaseClient
                .from<Profile>('users')
                .update({
                    is_nutritionist: value,
                    ...(height && { height }),
                })
                .eq('id', user.id);

            if (error) throw error;

            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['user']);
            },
            // onMutate: () => {
            //     if (!profile) return;

            //     queryClient.setQueryData(['user'], {
            //         ...profile,
            //         is_nutritionist: !profile.is_nutritionist,
            //     });
            // },
            onError: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );

    const { data = [], isFetching } = useQuery(
        ['nutritionists', debouncedSearchQuery],
        async () => {
            return await supabaseClient
                .from<Profile>('users')
                .select('*')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .limit(5);
        },
        {
            select: ({ data }) => data || [],
            enabled: Boolean(debouncedSearchQuery),
        }
    );

    return (
        <Container>
            <Group position="apart" mt={10}>
                <Switch
                    checked={profile?.is_nutritionist || false}
                    onChange={({ target: { checked } }) => mutate(checked)}
                    label={t('am_nutritionist')}
                />
                <Autocomplete
                    label={t('find_your_nutritionist')}
                    placeholder={t('search')}
                    data={data.map(({ full_name }) => full_name)}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    nothingFound={
                        debouncedSearchQuery && !isFetching && !data?.length
                            ? t('no_data')
                            : ''
                    }
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
                            if (profile) {
                                mutate(profile.is_nutritionist);
                            }
                        }}
                    >
                        {t('save')}
                    </Button>
                </Group>
            )}
            <Divider my={20} />
            <WeightTable />
        </Container>
    );
};

export default Settings;
