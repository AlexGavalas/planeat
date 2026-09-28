import { Center, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { LineChart } from '~components/charts/line';
import { LoadingOverlay } from '~components/loading-overlay';
import { useMeasurementSummary } from '~hooks/use-measurement-summary';

export const FatTimeline = () => {
    const { t } = useTranslation();
    const { data: summary, isFetching } = useMeasurementSummary();

    const data = summary?.fatTimeline;

    return (
        <>
            <Title order={4} pt={20}>
                {t('fat_change')}
            </Title>
            <div
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart data={[{ data, id: 'fat-percent' }]} unit="%" />
                )}
                {!isFetching && !data && (
                    <Center style={{ height: '100%' }}>
                        <Title order={4}>{t('no_measurements_yet')}</Title>
                    </Center>
                )}
            </div>
        </>
    );
};
