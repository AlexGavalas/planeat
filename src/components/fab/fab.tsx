import { ActionIcon, Box, Button, Stack } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EditPencil, Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { MeasurementModal } from '~features/modals/measurement';
import { useProfile } from '~hooks/use-profile';

export const Fab = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [showMenu, setShowMenu] = useState(false);

    if (!profile) {
        return null;
    }

    const handleNewMeasurement = async () => {
        await queryClient.invalidateQueries(['bmi-timeline']);
        await queryClient.invalidateQueries(['fat-percent-timeline']);
        await queryClient.invalidateQueries(['measurements']);
    };

    return (
        <Box style={{ position: 'fixed', bottom: 20, left: 20 }}>
            {showMenu && (
                <Stack spacing="sm" mb={10}>
                    <Button
                        style={{ maxWidth: 'fit-content' }}
                        size="sm"
                        radius="xl"
                        variant="filled"
                        onClick={() => {
                            setShowMenu(!showMenu);

                            modals.openModal({
                                title: t('add_measurement'),
                                size: 'md',
                                children: (
                                    <MeasurementModal
                                        userId={profile.id}
                                        onSave={handleNewMeasurement}
                                    />
                                ),
                            });
                        }}
                        leftIcon={<EditPencil />}
                    >
                        {t('add_measurement')}
                    </Button>
                </Stack>
            )}
            <ActionIcon
                color="brand"
                size="xl"
                radius="xl"
                variant="filled"
                onClick={() => setShowMenu(!showMenu)}
            >
                <Plus />
            </ActionIcon>
        </Box>
    );
};
