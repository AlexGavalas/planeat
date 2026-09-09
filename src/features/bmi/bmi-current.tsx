import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { ProgressIndicator } from '~components/progress';
import { useProfile } from '~hooks/use-profile';

import { MAX_BMI, SECTIONS } from './constants';
import { calculateBMI } from './helpers';

export const CurrentBMI = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();

    const { data: weight = 0 } = useQuery({
        enabled: Boolean(profile),
        queryFn: async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const response = await fetch(
                '/api/v1/measurement?type=latest-weight',
            );
            const { data } = (await response.json()) as { data: number };
            return data;
        },
        queryKey: ['current-weight'],
    });

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
