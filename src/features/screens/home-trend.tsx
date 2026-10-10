'use client';

import { Text } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { el } from 'date-fns/locale/el';
import { enGB } from 'date-fns/locale/en-GB';
import { useTranslation } from 'react-i18next';

import styles from './home.module.css';

type TrendProps = Readonly<{
    change: number | null;
    date: string | null;
    unit: string;
}>;

export function Trend({ change, date, unit }: TrendProps) {
    const { t, i18n } = useTranslation();

    if (change === null || !date) {
        return null;
    }

    const amount = new Intl.NumberFormat(i18n.language, {
        maximumFractionDigits: 1,
    }).format(Math.abs(change));
    const direction = change < 0 ? 'down' : change > 0 ? 'up' : 'unchanged';
    const since = format(parseISO(date), 'd MMM', {
        locale: i18n.language === 'gr' ? el : enGB,
    });

    return (
        <Text className={styles.trend} size="sm">
            {t(`home_dashboard.trend.${direction}`, {
                amount,
                since,
                unit,
            })}
        </Text>
    );
}
