'use client';

import { Button, Group, Text, Title } from '@mantine/core';
import { Clock, NavArrowRight } from 'iconoir-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { MEAL_ICON } from '~constants/calendar';

import { type MealItem } from './home-types';
import styles from './home.module.css';

type MealRowProps = Readonly<{
    day: string;
    index: number;
    item: MealItem;
    nextMealIndex: number;
}>;

function MealRow({ day, index, item, nextMealIndex }: MealRowProps) {
    const { t } = useTranslation();
    const Icon = MEAL_ICON[item.key];
    const isNext = index === nextMealIndex;
    const isEarlier = nextMealIndex < 0 || index < nextMealIndex;
    const status = !item.meal
        ? t('home_dashboard.add_in_planner')
        : isNext
          ? t('home_dashboard.up_next_at', { time: item.time })
          : isEarlier
            ? t('home_dashboard.earlier_today')
            : t('home_dashboard.planned');

    return (
        <div className={styles.mealRow}>
            <Text c="dimmed" size="sm">
                {item.time}
            </Text>
            <span className={styles.mealIcon}>
                <Icon aria-hidden />
            </span>
            <div className={styles.mealCopy}>
                <Text fw="var(--mantine-font-weight-medium)">
                    {item.meal ?? t('home_dashboard.not_planned')}
                </Text>
                <Text c={isNext ? 'brand' : 'dimmed'} size="sm">
                    {status}
                </Text>
            </div>
            {item.meal && isEarlier && (
                <Clock
                    aria-label={t('home_dashboard.earlier_today')}
                    className={styles.mealStatusIcon}
                />
            )}
            {!item.meal && (
                <Button
                    aria-label={t('home_dashboard.plan_meal', {
                        meal: t(`row.${item.key}`),
                    })}
                    component={Link}
                    href={`/meal-plan?date=${day}&meal=${item.key}`}
                    size="compact-sm"
                    variant="subtle"
                >
                    {t('home_dashboard.plan')}
                </Button>
            )}
        </div>
    );
}

type TodayMealsProps = Readonly<{
    day: string;
    mealItems: MealItem[];
    nextMealIndex: number;
}>;

export function TodayMeals({ day, mealItems, nextMealIndex }: TodayMealsProps) {
    const { t } = useTranslation();

    return (
        <Card>
            <section aria-labelledby="todays-meals-title">
                <Group
                    className={styles.sectionHeader}
                    justify="space-between"
                    mb="sm"
                    wrap="nowrap"
                >
                    <Title id="todays-meals-title" order={2} size="h3">
                        {t('home_dashboard.todays_meals')}
                    </Title>
                    <Button
                        component={Link}
                        href={`/meal-plan?date=${day}`}
                        rightSection={<NavArrowRight aria-hidden />}
                        size="compact-sm"
                        variant="subtle"
                    >
                        {t('home_dashboard.view_meal_plan')}
                    </Button>
                </Group>
                <div className={styles.mealList}>
                    {mealItems.map((item, index) => (
                        <MealRow
                            day={day}
                            index={index}
                            item={item}
                            key={item.key}
                            nextMealIndex={nextMealIndex}
                        />
                    ))}
                </div>
            </section>
        </Card>
    );
}
