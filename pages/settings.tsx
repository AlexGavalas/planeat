import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useUser } from '@supabase/supabase-auth-helpers/react';

import {
    supabaseClient,
    withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs';

import {
    Container,
    Group,
    Text,
    Switch,
    Divider,
    Autocomplete,
} from '@mantine/core';

import { WeightTable } from '@features/measurements/weight';

export const getServerSideProps = withAuthRequired({
    redirectTo: '/',
});

const Settings = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 250);

    const { data: profile } = useQuery(
        ['user'],
        async () => {
            if (!user) return;

            const { data } = await supabaseClient
                .from('users')
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
                .from('users')
                .update({ is_nutritionist: value })
                .eq('id', user.id);

            if (error) {
                throw error;
            }

            return data;
        },
        {
            onMutate: () => {
                queryClient.setQueryData(['user'], {
                    ...profile,
                    is_nutritionist: !profile.is_nutritionist,
                });
            },
            onError: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );

    const { data, isFetching } = useQuery(
        ['nutritionists', debouncedSearchQuery],
        async () => {
            const { data } = await supabaseClient
                .from('users')
                .select('*')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .limit(5);

            return data;
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        }
    );

    return (
        <Container>
            <Group position="apart" mt={10}>
                <Switch
                    checked={profile?.is_nutritionist || false}
                    onChange={({ target: { checked } }) => mutate(checked)}
                    label="Είμαι διαιτολόγος"
                />
                <Text>ή</Text>
                <Autocomplete
                    label="Βρες τον διαιτολόγο σου"
                    placeholder="Αναζήτηση"
                    data={(data || []).map(({ full_name }) => full_name)}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    nothingFound={
                        debouncedSearchQuery && !isFetching && !data?.length
                            ? 'Δεν βρέθηκαν αποτελέσματα'
                            : ''
                    }
                />
            </Group>
            <Divider my={20} />
            <WeightTable />
        </Container>
    );
};

export default Settings;
