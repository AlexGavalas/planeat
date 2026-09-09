import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { ProgressIndicator } from '~components/progress';
import { useProfile } from '~hooks/use-profile';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';

export const CurrentFat = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();

    const { data: fatPercent = 0 } = useQuery({
        enabled: Boolean(profile),
        queryFn: async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const response = await fetch('/api/v1/measurement?type=latest-fat');
            const { data } = (await response.json()) as { data: number };
            return data;
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
