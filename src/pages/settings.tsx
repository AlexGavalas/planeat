import {
    Autocomplete,
    Button,
    Container,
    Group,
    NumberInput,
    Space,
    Switch,
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
            <Group position="apart" mt={10}>
                <Switch
                    color="green.1"
                    label={t('am_nutritionist')}
                    checked={profile?.is_nutritionist || false}
                    onChange={({ target: { checked } }) => {
                        updateProfile({ isNutritionist: checked });
                    }}
                />
                <Autocomplete
                    label={t('find_your_nutritionist')}
                    placeholder={t('search').toString()}
                    data={nutritionists}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    nothingFound={nothingFoundLabel}
                />
            </Group>
            <Space h="lg" />
            {profile && (
                <Group align="end">
                    <NumberInput
                        label={t('height_input')}
                        style={{ width: '25%' }}
                        defaultValue={profile?.height ?? undefined}
                        onChange={(value) => setHeight(Number(value))}
                    />
                    <Button
                        className="button"
                        onClick={() => {
                            updateProfile({ height });
                        }}
                    >
                        {t('save')}
                    </Button>
                </Group>
            )}
            <Space h="lg" />
            <MeasurementsTable />
        </Container>
    );
}
