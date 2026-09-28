import { useTranslation } from 'react-i18next';

import { ProgressIndicator } from '~components/progress';
import { useMeasurementSummary } from '~hooks/use-measurement-summary';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';

export const CurrentFat = () => {
    const { t } = useTranslation();

    const { data: summary } = useMeasurementSummary();
    const fatPercent = summary?.currentFat ?? 0;

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
