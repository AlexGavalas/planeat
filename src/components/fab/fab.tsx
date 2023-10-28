import {
    ActionIcon,
    Box,
    Button,
    type ButtonProps,
    Stack,
} from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { EditPencil, Plus, Running } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';

import { useOpenContextModal } from '~util/modal';

import styles from './fab.module.css';

const buttonProps = {
    className: styles.button,
    radius: 'xl',
    size: 'sm',
    variant: 'filled',
} satisfies ButtonProps;

export const Fab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [shouldShowMenu, setShouldShowMenu] = useState(false);
    const openNewActivityModal = useOpenContextModal('activity');
    const openMeasurementModal = useOpenContextModal('measurement');

    const handleToggleMenu = useCallback(() => {
        setShouldShowMenu((prev) => !prev);
    }, []);

    const handleMeasurementSave = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ['bmi-timeline'],
        });

        await queryClient.invalidateQueries({
            queryKey: ['measurements'],
        });

        await queryClient.invalidateQueries({
            queryKey: ['fat-percent-timeline'],
        });
    }, [queryClient]);

    const handleActivitySave = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ['activities-count'],
        });

        await queryClient.invalidateQueries({
            queryKey: ['activities'],
        });
    }, [queryClient]);

    const handleAddMeasurement = useCallback(() => {
        handleToggleMenu();

        openMeasurementModal({
            innerProps: {
                onSave: handleMeasurementSave,
            },
            size: 'md',
            title: t('add_measurement'),
        });
    }, [openMeasurementModal, handleMeasurementSave, t, handleToggleMenu]);

    const handleAddActivity = useCallback(() => {
        handleToggleMenu();

        openNewActivityModal({
            innerProps: {
                onSave: handleActivitySave,
            },
            size: 'md',
            title: t('add_activity'),
        });
    }, [openNewActivityModal, handleActivitySave, t, handleToggleMenu]);

    return (
        <Box className={styles.container}>
            {shouldShowMenu && (
                <Stack gap="sm" mb={10}>
                    <Button
                        {...buttonProps}
                        leftSection={<EditPencil />}
                        onClick={handleAddMeasurement}
                    >
                        {t('add_measurement')}
                    </Button>
                    <Button
                        {...buttonProps}
                        leftSection={<Running />}
                        onClick={handleAddActivity}
                    >
                        {t('add_activity')}
                    </Button>
                </Stack>
            )}
            <ActionIcon
                color="brand"
                onClick={handleToggleMenu}
                radius="xl"
                size="xl"
                variant="filled"
            >
                <Plus />
            </ActionIcon>
        </Box>
    );
};
