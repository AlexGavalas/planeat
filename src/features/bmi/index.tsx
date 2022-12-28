import { Box, Center, LoadingOverlay, Title } from '@mantine/core';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { sub } from 'date-fns';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';

import { ProgressIndicator } from '~components/progress/indicator';
import { useProfile } from '~hooks/use-profile';

import { MAX_BMI, SECTIONS } from './constants';

const LineChart = dynamic(() => import('~components/charts/line'), {
    ssr: false,
});

const calculateBMI = ({ weight, height }: { weight: number; height: number }) =>
    weight / (height / 100) ** 2;

export const CurrentBMI = () => {
    const { t } = useTranslation();

    const { user } = useUser();

    const { profile } = useProfile();

    const { data: weight = 0 } = useQuery(
        ['current-weight'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from<Measurement>('measurements')
                .select('weight')
                .eq('user_id', user.id)
                .not('weight', 'is', null)
                .order('date', { ascending: false })
                .limit(1);
        },
        {
            enabled: Boolean(user),
            select: ({ data }) => data?.[0]?.weight,
        },
    );

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`bmi_sections.${section.key}`),
    }));

    const userBMI = +calculateBMI({
        weight,
        height: profile?.height || 0,
    }).toFixed(1);

    return (
        <ProgressIndicator
            label={t('bmi_label')}
            value={userBMI}
            percent={(userBMI * 100) / MAX_BMI}
            sections={translatedSections}
        />
    );
};

export const BMITimeline = () => {
    const { t } = useTranslation();

    const { user } = useUser();

    const { data, isFetching } = useQuery(
        ['bmi-timeline'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from<Measurement>('measurements')
                .select('date, weight')
                .eq('user_id', user.id)
                .not('weight', 'is', null)
                .gte('date', sub(new Date(), { days: 100 }).toISOString())
                .order('date', { ascending: true });
        },
        {
            enabled: Boolean(user),
            select: ({ data }) =>
                data?.length
                    ? data.map(({ date, weight }) => ({
                          y: weight,
                          x: date,
                      }))
                    : null,
        },
    );

    return (
        <>
            <Title order={4} pt={20}>
                {t('weight_change')}
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
