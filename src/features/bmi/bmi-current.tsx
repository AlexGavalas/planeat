import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

import { fetchLatestWeightMeasurement } from '~api/measurement';
import { ProgressIndicator } from '~components/progress';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

import { MAX_BMI, SECTIONS } from './constants';
import { calculateBMI } from './helpers';

export const CurrentBMI = () => {
    const { t } = useTranslation();
    const supabase = useSupabaseClient<Database>();
    const { profile } = useProfile();

    const { data: weight = 0 } = useQuery(
        ['current-weight'],
        async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const result = await fetchLatestWeightMeasurement({
                supabase,
                userId: profile.id,
            });

            return result.data?.[0]?.weight;
        },
        {
            enabled: Boolean(profile),
        },
    );

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`bmi_sections.${section.key}`),
    }));

    const userBMI = +calculateBMI({
        height: profile?.height ?? 0,
        weight,
    }).toFixed(1);

    return (
        <ProgressIndicator
            label={t('bmi_label')}
            percent={(userBMI * 100) / MAX_BMI}
            sections={translatedSections}
            value={userBMI}
        />
    );
};
