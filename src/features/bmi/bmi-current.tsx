import { useTranslation } from 'react-i18next';

import { ProgressIndicator } from '~components/progress';
import { useMeasurementSummary } from '~hooks/use-measurement-summary';
import { useProfile } from '~hooks/use-profile';

import { MAX_BMI, SECTIONS } from './constants';
import { calculateBMI } from './helpers';

export const CurrentBMI = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const { data: summary } = useMeasurementSummary();

    const weight = summary?.currentWeight ?? 0;

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
