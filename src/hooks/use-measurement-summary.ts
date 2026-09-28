import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type MeasurementSummary } from '~types/measurement';

import { useProfile } from './use-profile';

export const useMeasurementSummary = (): UseQueryResult<MeasurementSummary> => {
    const { profile } = useProfile();
    return useQuery({
        enabled: Boolean(profile),
        queryFn: async (): Promise<MeasurementSummary> => {
            const response = await fetch('/api/v1/measurement?type=summary');
            if (!response.ok) throw new Error('Could not load measurements');
            const result = (await response.json()) as {
                data: MeasurementSummary;
            };
            return result.data;
        },
        queryKey: ['measurement-summary'],
    });
};
