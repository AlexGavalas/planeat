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
import { useProfile } from '~hooks/use-profile';

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
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = useCallback(() => {
        setShowMenu((prev) => !prev);
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
        if (!profile) {
            return;
        }

        toggleMenu();

        modals.openModal({
            title: t('add_measurement'),
            size: 'md',
            children: (
                <MeasurementModal
                    userId={profile.id}
                    onSave={handleMeasurementSave}
                />
            ),
        });
    }, [handleMeasurementSave, modals, profile, t, toggleMenu]);

    const handleAddActivity = useCallback(() => {
        if (!profile) {
            return;
        }

        toggleMenu();

        modals.openModal({
            title: t('add_activity'),
            size: 'md',
            children: (
                <ActivityModal
                    userId={profile.id}
                    onSave={handleActivitySave}
                />
            ),
        });
    }, [handleActivitySave, modals, profile, t, toggleMenu]);

    return (
        <Box className={styles.container}>
            {showMenu && (
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
                size="xl"
                radius="xl"
                variant="filled"
                onClick={toggleMenu}
            >
                <Plus />
            </ActionIcon>
        </Box>
    );
};
