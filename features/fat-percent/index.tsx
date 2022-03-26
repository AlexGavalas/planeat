import dynamic from 'next/dynamic';
import { Box, Center, LoadingOverlay, Title } from '@mantine/core';
import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useTranslation } from 'next-i18next';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';
import { ProgressIndicator } from '@components/progress/indicator';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

export const FatPercent = ({ value }: { value: number }) => {
    const { t } = useTranslation();

    const translatedSections = SECTIONS.map((section) => ({
        ...section,
        label: t(`fat_sections.${section.key}`),
    }));

    return (
        <ProgressIndicator
            label={t('fat_label')}
            value={value}
            percent={(value * 100) / MAX_FAT_PERCENT}
            sections={translatedSections}
        />
    );
};

export const FatPercentTimeline = () => {
    const { t } = useTranslation();

    const { data, isFetching } = useQuery(['fat-percent'], async () => {
        // const {} = await supabaseClient.from('weight-measurements');
    });

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
