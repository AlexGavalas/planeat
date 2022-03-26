import dynamic from 'next/dynamic';
import { Box, Center, LoadingOverlay, Title } from '@mantine/core';
import { sub } from 'date-fns';
import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useTranslation } from 'next-i18next';

import { MAX_BMI, SECTIONS } from './constants';
import { ProgressIndicator } from '@components/progress/indicator';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

export const CurrentBMI = ({ value }: { value: number }) => {
    const { t } = useTranslation();

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`bmi_sections.${section.key}`),
    }));

    return (
        <ProgressIndicator
            label={t('bmi_label')}
            value={value}
            percent={(value * 100) / MAX_BMI}
            sections={translatedSections}
        />
    );
};

export const BMITimeline = () => {
    const { t } = useTranslation();

    const { data, isFetching } = useQuery(
        ['bmi-timeline'],
        async () => {
            return supabaseClient
                .from<WeightMeasurement>('weight-measurements')
                .select('*')
                .gte('date', sub(new Date(), { days: 100 }).toISOString())
                .order('date', { ascending: true });
        },
        {
            select: ({ data }) =>
                data?.length
                    ? data.map(({ date, weight }) => ({
                          y: weight,
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
                    <LineChart
                        unit={t('kg')}
                        target={85}
                        data={[{ id: 'bmi-timeline', data }]}
                    />
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
