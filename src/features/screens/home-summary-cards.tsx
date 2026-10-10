'use client';

import { Progress, Text } from '@mantine/core';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { ROWS } from '~constants/calendar';

import { type TimelineTrend } from './home-helpers';
import { Trend } from './home-trend';
import { type MealItem } from './home-types';
import styles from './home.module.css';

type SummaryCardsProps = Readonly<{
    currentWeight: number | null;
    nextMeal: MealItem | null;
    plannedMeals: number;
    targetWeight: number | null;
    weightTrend: TimelineTrend;
}>;

export function SummaryCards({
    currentWeight,
    nextMeal,
    plannedMeals,
    targetWeight,
    weightTrend,
}: SummaryCardsProps) {
    const { t, i18n } = useTranslation();
    const formatter = new Intl.NumberFormat(i18n.language, {
        maximumFractionDigits: 1,
    });
    const targetSummary = getTargetSummary({
        currentWeight,
        formatter,
        targetWeight,
        translate: t,
    });

    return (
        <section
            aria-label={t('home_dashboard.at_a_glance')}
            className={styles.summaryGrid}
        >
            <Card>
                <Text c="dimmed" size="sm">
                    {t('home_dashboard.next_meal')}
                </Text>
                <Text className={styles.summaryValue}>
                    {nextMeal
                        ? `${t(`row.${nextMeal.key}`)} · ${nextMeal.time}`
                        : t('home_dashboard.day_finished')}
                </Text>
                <Text className={styles.summaryContext} size="sm">
                    {nextMeal?.meal ??
                        (nextMeal
                            ? t('home_dashboard.not_planned')
                            : t('home_dashboard.day_finished_hint'))}
                </Text>
            </Card>
            <Card>
                <Text c="dimmed" size="sm">
                    {t('home_dashboard.todays_plan')}
                </Text>
                <Text className={styles.summaryValue}>
                    {t('home_dashboard.planned_count', {
                        count: plannedMeals,
                        total: ROWS.length,
                    })}
                </Text>
                <Progress
                    aria-label={t('home_dashboard.planned_count', {
                        count: plannedMeals,
                        total: ROWS.length,
                    })}
                    className={styles.planProgress}
                    value={(plannedMeals / ROWS.length) * 100}
                />
            </Card>
            <Card>
                <Text c="dimmed" size="sm">
                    {t('home_dashboard.weight_target')}
                </Text>
                {!targetWeight ? (
                    <Text
                        className={`${styles.summaryValue} ${styles.targetLink}`}
                        component={Link}
                        href="/settings?tab=personal"
                    >
                        {targetSummary}
                    </Text>
                ) : (
                    <Text className={styles.summaryValue}>{targetSummary}</Text>
                )}
                {weightTrend.change !== null && weightTrend.firstDate && (
                    <Trend
                        change={weightTrend.change}
                        date={weightTrend.firstDate}
                        unit={t('kg')}
                    />
                )}
            </Card>
        </section>
    );
}

type TargetSummaryOptions = {
    currentWeight: number | null;
    formatter: Intl.NumberFormat;
    targetWeight: number | null;
    translate: ReturnType<typeof useTranslation>['t'];
};

function getTargetSummary({
    currentWeight,
    formatter,
    targetWeight,
    translate,
}: TargetSummaryOptions) {
    if (!targetWeight) {
        return translate('home_dashboard.set_target');
    }
    if (!currentWeight) {
        return translate('home_dashboard.target_value', {
            amount: formatter.format(targetWeight),
            unit: translate('kg'),
        });
    }

    const gap = Math.abs(currentWeight - targetWeight);
    return gap === 0
        ? translate('home_dashboard.target_reached')
        : translate('home_dashboard.to_target', {
              amount: formatter.format(gap),
              unit: translate('kg'),
          });
}
