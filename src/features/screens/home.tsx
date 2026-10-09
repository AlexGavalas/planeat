'use client';

import { Button, Group, Text, Title } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { el } from 'date-fns/locale/el';
import { enGB } from 'date-fns/locale/en-GB';
import { EditPencil, Running } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import { ROWS } from '~constants/calendar';
import { useMeasurementSummary } from '~hooks/use-measurement-summary';

import { HealthSummary } from './home-health-summary';
import {
    getFirstName,
    getGreetingPeriod,
    getNextMealIndex,
    getTimelineTrend,
} from './home-helpers';
import { TodayMeals } from './home-meals';
import { SummaryCards } from './home-summary-cards';
import { type HomeProps, type MealItem } from './home-types';
import styles from './home.module.css';
import { useHomeActions } from './use-home-actions';

export function Home({
    dailyMeals,
    date,
    fullName,
    mealZoneTimes,
    targetWeight,
}: HomeProps) {
    const { t, i18n } = useTranslation();
    const { handleAddActivity, handleAddMeasurement } = useHomeActions();
    const { data: summary } = useMeasurementSummary();
    const now = parseISO(date);
    const day = format(now, 'yyyy-MM-dd');
    const nextMealIndex = getNextMealIndex(date, mealZoneTimes);
    const mealItems: MealItem[] = ROWS.map(({ key }) => {
        const sectionKey = `${key}_${format(now, 'EEE dd/MM/yyyy')}`;
        return {
            key,
            meal: dailyMeals[sectionKey]?.meal.trim() || null,
            time: mealZoneTimes[key],
        };
    });
    const plannedMeals = mealItems.filter(({ meal }) => meal).length;
    const nextMeal =
        nextMealIndex >= 0 ? (mealItems[nextMealIndex] ?? null) : null;
    const currentWeight = summary?.currentWeight || null;
    const weightTrend = getTimelineTrend(summary?.weightTimeline);

    return (
        <main className={styles.layout}>
            <header className={styles.hero}>
                <div>
                    <Title order={1} size="h2">
                        {t(
                            `home_dashboard.greeting.${getGreetingPeriod(now.getHours())}`,
                            { name: getFirstName(fullName) },
                        )}
                    </Title>
                    <Text c="dimmed">
                        {t('home_dashboard.subtitle', {
                            date: format(now, 'EEEE, d MMMM', {
                                locale: i18n.language === 'gr' ? el : enGB,
                            }),
                        })}
                    </Text>
                </div>
                <Group className={styles.heroActions} gap="sm" wrap="nowrap">
                    <Button
                        leftSection={<EditPencil aria-hidden />}
                        onClick={handleAddMeasurement}
                    >
                        {t('home_dashboard.add_measurement')}
                    </Button>
                    <Button
                        leftSection={<Running aria-hidden />}
                        onClick={handleAddActivity}
                        variant="outline"
                    >
                        {t('home_dashboard.add_activity')}
                    </Button>
                </Group>
            </header>

            <SummaryCards
                currentWeight={currentWeight}
                nextMeal={nextMeal}
                plannedMeals={plannedMeals}
                targetWeight={targetWeight}
                weightTrend={weightTrend}
            />

            <section className={styles.contentGrid}>
                <TodayMeals
                    day={day}
                    mealItems={mealItems}
                    nextMealIndex={nextMealIndex}
                />
                <HealthSummary
                    onAddMeasurement={handleAddMeasurement}
                    targetWeight={targetWeight}
                />
            </section>
        </main>
    );
}
