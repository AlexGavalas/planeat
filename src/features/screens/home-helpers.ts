import { parse, parseISO, startOfDay } from 'date-fns';

import { ROWS } from '~constants/calendar';
import { type MealZoneTimes } from '~types/meal-zone';

type TimelinePoint = { x: string; y: number | null };

export type TimelineTrend = {
    change: number | null;
    current: number | null;
    firstDate: string | null;
    latestDate: string | null;
    values: number[];
};

export const getFirstName = (fullName: string): string =>
    fullName.trim().split(/\s+/u)[0] || fullName;

export const getGreetingPeriod = (
    hour: number,
): 'afternoon' | 'evening' | 'morning' => {
    if (hour < 12) {
        return 'morning';
    }
    if (hour < 18) {
        return 'afternoon';
    }
    return 'evening';
};

export const getNextMealIndex = (
    date: string,
    mealZoneTimes: MealZoneTimes,
): number => {
    const now = parseISO(date);
    const start = startOfDay(now);

    return ROWS.findIndex(({ key }) => {
        const mealTime = parse(mealZoneTimes[key], 'HH:mm', start);
        return mealTime.getTime() > now.getTime();
    });
};

export const getTimelineTrend = (
    timeline: TimelinePoint[] | null | undefined,
): TimelineTrend => {
    const points =
        timeline?.filter(
            (point): point is { x: string; y: number } =>
                typeof point.y === 'number' && Number.isFinite(point.y),
        ) ?? [];
    const first = points[0];
    const latest = points.at(-1);

    return {
        change:
            first && latest && points.length > 1 ? latest.y - first.y : null,
        current: latest?.y ?? null,
        firstDate: first?.x ?? null,
        latestDate: latest?.x ?? null,
        values: points.map(({ y }) => y),
    };
};

export const toSparklinePoints = (values: number[]): string => {
    if (values.length < 2) {
        return '';
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * 100;
            const y = 24 - ((value - min) / range) * 20;
            return `${x},${y}`;
        })
        .join(' ');
};
