import { Flex, Title } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { endOfWeek, format, isToday, startOfWeek } from 'date-fns';
import { Running } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

import { fetchActivities } from '~api/activity';
import { useProfile } from '~hooks/use-profile';
import { useCurrentWeek } from '~store/hooks';
import { type ActivitysMap } from '~types/activity';
import { type Database } from '~types/supabase';
import { getDaysOfWeek } from '~util/date';

import styles from './header.module.css';

export const Header = () => {
    const { i18n } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const { profile } = useProfile();
    const supabase = useSupabaseClient<Database>();

    const currentWeekKey = format(currentWeek, 'yyyy-MM-dd');

    const daysOfWeek = getDaysOfWeek(
        currentWeek,
        'EEE dd/MM',
        i18n.language === 'en' ? 'en' : 'gr',
    );

    const { data: activities = [] } = useQuery(
        ['activities', currentWeekKey],
        async () => {
            const startDate = format(
                startOfWeek(currentWeek, { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            );

            const endDate = format(
                endOfWeek(currentWeek, { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            );

            const result = await fetchActivities({
                endDate,
                startDate,
                supabase,
                userId: profile.id,
            });

            return result.data || [];
        },
    );

    const activitiesMap = activities.reduce<ActivitysMap>((acc, activity) => {
        const dateKey = activity.date;

        acc[dateKey] = activity;

        return acc;
    }, {});

    return (
        <div className={styles.wrapper}>
            <div></div>
            {daysOfWeek.map(({ timestamp, label }) => (
                <Flex
                    key={label}
                    align="center"
                    justify="center"
                    pb="sm"
                    gap="xs"
                    style={{ position: 'relative' }}
                >
                    <Title
                        c={isToday(timestamp) ? 'green.8' : undefined}
                        ta="center"
                        order={4}
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
