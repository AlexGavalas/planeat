import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

import { ProgressIndicator } from '~components/progress/indicator';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';

export const CurrentFat = () => {
    const { t } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();
    const { profile: user } = useProfile();

    const { data: fatPercent = 0 } = useQuery(
        ['current-fat-percent'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from('measurements')
                .select('fat_percentage')
                .eq('user_id', user.id)
                .not('fat_percentage', 'is', null)
                .order('date', { ascending: false })
                .limit(1);
        },
        {
            enabled: Boolean(user),
            select: ({ data }) => data?.[0]?.fat_percentage,
        },
    );

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`fat_sections.${section.key}`),
    }));

    return (
        <ProgressIndicator
            label={t('fat_label')}
            value={fatPercent}
            percent={fatPercent && (fatPercent * 100) / MAX_FAT_PERCENT}
            sections={translatedSections}
        />
    );
};
