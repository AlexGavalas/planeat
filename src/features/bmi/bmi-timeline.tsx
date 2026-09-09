import { Box, Center, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { LineChart } from '~components/charts/line';
import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';

export const BMITimeline = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();

    const { data, isFetching } = useQuery({
        queryFn: async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const response = await fetch(
                '/api/v1/measurement?type=weight-timeline',
            );
            const { data } = (await response.json()) as {
                data: { date: string; weight: number }[];
            };
            return data.length
                ? data.map(({ date: x, weight: y }) => ({ x, y }))
                : null;
        },
        queryKey: ['bmi-timeline'],
    });

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
