import { Autocomplete } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

export const FindUsers = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 250);
    const { profile } = useProfile();
    const supabase = useSupabaseClient<Database>();

    const { data: nutritionists = [], isFetching } = useQuery(
        ['nutritionists', debouncedSearchQuery],
        async () => {
            const { data } = await supabase
                .from('users')
                .select('*')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .neq('email', profile?.email)
                .limit(5);

            return data?.map(({ full_name }) => full_name) ?? [];
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        },
    );

    const nothingFoundLabel =
        debouncedSearchQuery && !isFetching && !nutritionists?.length
            ? t('no_data')
            : '';

    return (
        <Autocomplete
            label={t('find_your_nutritionist')}
            placeholder={t('search')}
            data={nutritionists}
            value={searchQuery}
            onChange={setSearchQuery}
            nothingFound={nothingFoundLabel}
        />
    );
};
