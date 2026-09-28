import { Box, Center, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { LineChart } from '~components/charts/line';
import { LoadingOverlay } from '~components/loading-overlay';
import { useMeasurementSummary } from '~hooks/use-measurement-summary';
import { useProfile } from '~hooks/use-profile';

export const BMITimeline = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();

    const { data: summary, isFetching } = useMeasurementSummary();
    const data = summary?.weightTimeline;

    return (
        <>
            <Title order={4} pt={20}>
                {t('weight_change')}
            </Title>
            <Box
                bg="transparent"
                px={0}
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart
                        data={[{ data, id: 'bmi-timeline' }]}
                        target={Number(profile?.target_weight)}
                        unit={t('kg')}
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
