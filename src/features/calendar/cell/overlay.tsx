import { ActionIcon, Center, Overlay } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EditPencil } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { ModalContent } from './edit-modal-content';

interface CellOverlayProps {
    handleDelete: () => Promise<void>;
    handleSave: (value: string) => Promise<void>;
    meal?: Meal | EditedMeal;
}

export const CellOverlay = ({
    handleDelete,
    handleSave,
    meal,
}: CellOverlayProps) => {
    const { t } = useTranslation();

    const modals = useModals();

    return (
        <Overlay opacity={0.05}>
            <Center style={{ height: '100%' }}>
                <ActionIcon
                    size="lg"
                    title={t('edit')}
                    onClick={() => {
                        modals.openModal({
                            title: t('edit_meal'),
                            centered: true,
                            children: (
                                <ModalContent
                                    handleSave={handleSave}
                                    initialMeal={meal?.meal || ''}
                                    deleteMeal={handleDelete}
                                />
                            ),
                        });
                    }}
                >
                    <EditPencil />
                </ActionIcon>
            </Center>
        </Overlay>
    );
};
