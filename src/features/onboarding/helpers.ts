import { type TourStepProps } from '@mantine/core';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type OnboardingStep = TourStepProps & {
    children: ReactNode;
    route: '/home' | '/meal-plan' | '/settings';
    target: string;
};

export const useSteps = (): OnboardingStep[] => {
    const { t } = useTranslation();

    const steps: OnboardingStep[] = [
        {
            children: t('onboarding.content.daily_meals'),
            route: '/home',
            target: '#daily-meals-container',
        },
        {
            children: t('onboarding.content.health_trend'),
            route: '/home',
            target: '#health-trend-container',
        },
        {
            children: t('onboarding.content.meal_plan'),
            route: '/meal-plan',
            target: '#meal-plan-container',
        },
        {
            children: t('onboarding.content.measurements'),
            route: '/settings',
            target: '#settings-tab-measurements',
        },
        {
            children: t('onboarding.content.personal_settings'),
            route: '/settings',
            target: '#settings-tab-personal',
        },
        {
            children: t('onboarding.content.advanced_settings'),
            route: '/settings',
            target: '#settings-tab-advanced',
        },
    ];

    return steps;
};
