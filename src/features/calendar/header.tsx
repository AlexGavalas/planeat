import { Flex, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { endOfWeek, format, isToday, startOfWeek } from 'date-fns';
import { Running } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { useProfile } from '~hooks/use-profile';
import { useCurrentWeek } from '~store/hooks';
import { type ActivitysMap } from '~types/activity';
import { getDaysOfWeek } from '~util/date';

import styles from './header.module.css';

export const Header = () => {
    const { i18n } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const { profile } = useProfile();

    const currentWeekKey = format(currentWeek, 'yyyy-MM-dd');

    const daysOfWeek = getDaysOfWeek(
        currentWeek,
        'EEE dd/MM',
        i18n.language === 'en' ? 'en' : 'gr',
    );

    const { data: activities = [] } = useQuery({
        queryFn: async () => {
            if (!profile?.id) {
                return;
            }

            const startDate = format(
                startOfWeek(currentWeek, { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            );

            const endDate = format(
                endOfWeek(currentWeek, { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            );

            const response = await fetch(
                `/api/v1/activity?startDate=${startDate}&endDate=${endDate}`,
            );
            const { data } = (await response.json()) as {
                data: ActivitysMap[keyof ActivitysMap][];
            };
            return data;
        },
        queryKey: ['activities', currentWeekKey],
    });

    const activitiesMap = activities.reduce<ActivitysMap>((acc, activity) => {
        acc[activity.date] = activity;

        return acc;
    }, {});

    return (
        <div className={styles.wrapper}>
            <div></div>
            {daysOfWeek.map(({ timestamp, label }) => (
                <Flex
                    key={label}
                    align="center"
                    gap="xs"
                    justify="center"
                    pb="sm"
                    style={{ position: 'relative' }}
                >
                    <Title
                        c={isToday(timestamp) ? 'green.8' : undefined}
                        order={4}
                        ta="center"
                    >
                        {label}
                    </Title>
                    {activitiesMap[format(timestamp, 'yyyy-MM-dd')] && (
                        <Running />
                    )}
                </Flex>
            ))}
        </div>
    );
};
