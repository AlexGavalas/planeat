import { useTranslation } from 'next-i18next';
import { type Step } from 'react-joyride';

const commonStepProps: Partial<Step> = {
    disableBeacon: true,
    placement: 'auto',
};

export const useSteps = (): Step[] => {
    const { t } = useTranslation();

    const steps: Step[] = [
        {
            content: t('onboarding.content.daily_meals'),
            target: '#daily-meals-container',
            ...commonStepProps,
        },
        {
            content: t('onboarding.content.fat_timeline'),
            target: '#fat-container',
            ...commonStepProps,
        },
        {
            content: t('onboarding.content.weight_timeline'),
            target: '#weight-container',
            ...commonStepProps,
        },
        {
            content: t('onboarding.content.meal_plan'),
            target: '#meal-plan-container',
            ...commonStepProps,
        },
        {
            content: t('onboarding.content.measurements'),
            target: '#settings-tab-measurements',
            ...commonStepProps,
        },
        {
            content: t('onboarding.content.personal_settings'),
            target: '#settings-tab-personal',
            ...commonStepProps,
        },
        {
            content: t('onboarding.content.advanced_settings'),
            target: '#settings-tab-advanced',
            ...commonStepProps,
        },
    ];

    return steps;
};
