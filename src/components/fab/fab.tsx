import {
    ActionIcon,
    Box,
    Button,
    type ButtonProps,
    Stack,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EditPencil, Plus, Running } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';

import { ActivityModal } from '~features/modals/activity';
import { MeasurementModal } from '~features/modals/measurement';

import styles from './fab.module.css';

const buttonProps = {
    className: styles.button,
    size: 'sm',
    radius: 'xl',
    variant: 'filled',
} satisfies ButtonProps;

export const Fab = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const queryClient = useQueryClient();
    const [shouldShowMenu, setShouldShowMenu] = useState(false);

    const handleToggleMenu = useCallback(() => {
        setShouldShowMenu((prev) => !prev);
    }, []);

    const handleMeasurementSave = useCallback(async () => {
        await queryClient.resetQueries({ queryKey: ['bmi-timeline'] });
        await queryClient.resetQueries({ queryKey: ['measurements'] });
        await queryClient.resetQueries({
            queryKey: ['fat-percent-timeline'],
        });
    }, [queryClient]);

    const handleActivitySave = useCallback(async () => {
        await queryClient.resetQueries({ queryKey: ['activities-count'] });
        await queryClient.resetQueries({ queryKey: ['activities'] });
    }, [queryClient]);

    const handleAddMeasurement = useCallback(() => {
        handleToggleMenu();

        modals.openModal({
            title: t('add_measurement'),
            size: 'md',
            children: <MeasurementModal onSave={handleMeasurementSave} />,
        });
    }, [handleMeasurementSave, modals, t, handleToggleMenu]);

    const handleAddActivity = useCallback(() => {
        handleToggleMenu();

        modals.openModal({
            title: t('add_activity'),
            size: 'md',
            children: <ActivityModal onSave={handleActivitySave} />,
        });
    }, [handleActivitySave, modals, t, handleToggleMenu]);

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
