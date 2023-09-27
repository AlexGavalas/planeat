import { useTranslation } from 'next-i18next';
import { type Step } from 'react-joyride';

const commonStepProps: Partial<Step> = {
    disableBeacon: true,
    placement: 'auto',
};

export const useSteps = () => {
    const { t } = useTranslation();

    const steps: Step[] = [
        {
            target: '#daily-meals-container',
            content: t('onboarding.content.daily_meals'),
            ...commonStepProps,
        },
        {
            target: '#fat-container',
            content: t('onboarding.content.fat_timeline'),
            ...commonStepProps,
        },
        {
            target: '#weight-container',
            content: t('onboarding.content.weight_timeline'),
            ...commonStepProps,
        },
        {
            target: '#meal-plan-container',
            content: t('onboarding.content.meal_plan'),
            ...commonStepProps,
        },
        {
            target: '#settings-tab-measurements',
            content: t('onboarding.content.measurements'),
            ...commonStepProps,
        },
        {
            target: '#settings-tab-personal',
            content: t('onboarding.content.personal_settings'),
            ...commonStepProps,
        },
        {
            target: '#settings-tab-advanced',
            content: t('onboarding.content.advanced_settings'),
            ...commonStepProps,
        },
    ];

    return steps;
};
