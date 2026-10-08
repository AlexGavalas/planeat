'use client';

import {
    ActionIcon,
    Box,
    Button,
    type ButtonProps,
    Stack,
} from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { EditPencil, Plus, Running } from 'iconoir-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

    const handleToggleMenu = () => {
        setShouldShowMenu((prev) => !prev);
    };

    const handleMeasurementSave = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ['measurement-summary'],
            }),
            queryClient.invalidateQueries({ queryKey: ['measurements'] }),
            queryClient.invalidateQueries({ queryKey: ['measurements-count'] }),
        ]);
    };

    const handleActivitySave = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['activities-count'],
        });

        await queryClient.invalidateQueries({
            queryKey: ['activities'],
        });
    };

    const handleAddMeasurement = () => {
        handleToggleMenu();

        openMeasurementModal({
            innerProps: {
                onSave: handleMeasurementSave,
            },
            size: 'md',
            title: t('add_measurement'),
        });
    };

    const handleAddActivity = () => {
        handleToggleMenu();

        openNewActivityModal({
            innerProps: {
                onSave: handleActivitySave,
            },
            size: 'md',
            title: t('add_activity'),
        });
    };

    return (
        <Box className={styles.container}>
            {shouldShowMenu && (
                <Stack align="end" gap="sm" mb="xs">
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
                aria-expanded={shouldShowMenu}
                aria-label={t(
                    shouldShowMenu ? 'fab.close_actions' : 'fab.open_actions',
                )}
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
