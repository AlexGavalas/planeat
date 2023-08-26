import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

import { ProgressIndicator } from '~components/progress/indicator';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

import { MAX_BMI, SECTIONS } from './constants';
import { calculateBMI } from './helpers';

export const CurrentBMI = () => {
    const { t } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();
    const user = useUser();

    const { profile } = useProfile();

    const { data: weight = 0 } = useQuery(
        ['current-weight'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from('measurements')
                .select('weight')
                .eq('user_id', user.id)
                .not('weight', 'is', null)
                .order('date', { ascending: false })
                .limit(1);
        },
        {
            enabled: Boolean(user),
            select: ({ data }) => data?.[0]?.weight,
        },
    );

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`bmi_sections.${section.key}`),
    }));

    const userBMI = +calculateBMI({
        weight,
        height: profile?.height || 0,
    }).toFixed(1);

    return (
        <ProgressIndicator
            label={t('bmi_label')}
            value={userBMI}
            percent={(userBMI * 100) / MAX_BMI}
            sections={translatedSections}
        />
    );
};
