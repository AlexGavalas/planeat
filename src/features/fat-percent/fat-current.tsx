import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { fetchLatestFatMeasurement } from '~api/measurement';
import { ProgressIndicator } from '~components/progress';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';

export const CurrentFat = () => {
    const { t } = useTranslation();
    const supabase = useSupabaseClient<Database>();
    const { profile } = useProfile();

    const { data: fatPercent = 0 } = useQuery({
        enabled: Boolean(profile),
        queryFn: async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const result = await fetchLatestFatMeasurement({
                supabase,
                userId: profile.id,
            });

            return result.data?.[0]?.fat_percentage;
        },
        queryKey: ['current-fat-percent'],
    });

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`fat_sections.${section.key}`),
    }));

    return (
        <ProgressIndicator
            label={t('fat_label')}
            percent={fatPercent && (fatPercent * 100) / MAX_FAT_PERCENT}
            sections={translatedSections}
            value={fatPercent}
        />
    );
};
