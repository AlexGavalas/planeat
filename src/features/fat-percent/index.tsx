import dynamic from 'next/dynamic';
import { Box, Center, LoadingOverlay, Title } from '@mantine/core';
import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useTranslation } from 'next-i18next';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';
import { ProgressIndicator } from '@components/progress/indicator';
import { useUser } from '@supabase/auth-helpers-react';
import { sub } from 'date-fns';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

export const FatPercent = () => {
    const { t } = useTranslation();

    const { user } = useUser();

    const { data: fatPercent = 0 } = useQuery(
        ['current-fat-percent'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from<Measurement>('measurements')
                .select('fat_percentage')
                .eq('user_id', user.id)
                .not('fat_percentage', 'is', null)
                .order('date', { ascending: false })
                .limit(1);
        },
        {
            enabled: Boolean(user),
            select: ({ data }) => data?.[0]?.fat_percentage,
        }
    );

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`fat_sections.${section.key}`),
    }));

    return (
        <ProgressIndicator
            label={t('fat_label')}
            value={fatPercent}
            percent={(fatPercent * 100) / MAX_FAT_PERCENT}
            sections={translatedSections}
        />
    );
};

export const FatPercentTimeline = () => {
    const { t } = useTranslation();

    const { user } = useUser();

    const { data, isFetching } = useQuery(
        ['fat-percent-timeline'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from<Measurement>('measurements')
                .select('date, fat_percentage')
                .eq('user_id', user.id)
                .not('fat_percentage', 'is', null)
                .gte('date', sub(new Date(), { days: 100 }).toISOString())
                .order('date', { ascending: true });
        },
        {
            enabled: Boolean(user),
            select: ({ data }) =>
                data?.length
                    ? data.map(({ date, fat_percentage }) => ({
                          y: fat_percentage,
                          x: date,
                      }))
                    : null,
        }
    );

    return (
        <>
            <Title order={4} pt={20}>
                {t('fat_change')}
            </Title>
            <Box
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart unit="%" data={[{ id: 'fat-percent', data }]} />
                )}
                {!isFetching && !data && (
                    <Center style={{ height: '100%' }}>
                        <Title order={4}>{t('no_measurements_yet')}</Title>
                    </Center>
                )}
            </Box>
        </>
    );
};
