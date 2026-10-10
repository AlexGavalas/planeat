'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useOpenContextModal } from '~util/modal';

type HomeActions = {
    handleAddActivity: () => void;
    handleAddMeasurement: () => void;
};

export function useHomeActions(): HomeActions {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const openActivityModal = useOpenContextModal('activity');
    const openMeasurementModal = useOpenContextModal('measurement');

    const handleAddMeasurement = (): void => {
        openMeasurementModal({
            innerProps: {
                onSave: async () => {
                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: ['measurement-summary'],
                        }),
                        queryClient.invalidateQueries({
                            queryKey: ['measurements'],
                        }),
                        queryClient.invalidateQueries({
                            queryKey: ['measurements-count'],
                        }),
                    ]);
                },
            },
            size: 'sm',
            title: t('add_measurement'),
        });
    };

    const handleAddActivity = (): void => {
        openActivityModal({
            innerProps: {
                onSave: async () => {
                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: ['activities'],
                        }),
                        queryClient.invalidateQueries({
                            queryKey: ['activities-count'],
                        }),
                    ]);
                },
            },
            size: 'sm',
            title: t('add_activity'),
        });
    };

    return { handleAddActivity, handleAddMeasurement };
}
