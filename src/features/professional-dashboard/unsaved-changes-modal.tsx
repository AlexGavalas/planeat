import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import styles from './professional-dashboard.module.css';

type UnsavedChangesModalProps = Readonly<{
    opened: boolean;
    onCancel: () => void;
    onDiscard: () => void;
    onSave: () => void;
}>;

export const UnsavedChangesModal = ({
    opened,
    onCancel,
    onDiscard,
    onSave,
}: UnsavedChangesModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            centered
            onClose={onCancel}
            opened={opened}
            size="lg"
            title={t('professional.unsaved.title')}
            zIndex={400}
        >
            <Stack>
                <Text>{t('professional.unsaved.description')}</Text>
                <Group className={styles.modalActions} justify="end">
                    <Button onClick={onCancel} variant="default">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Button
                        color="danger"
                        onClick={onDiscard}
                        variant="outline"
                    >
                        {t('professional.unsaved.discard')}
                    </Button>
                    <Button onClick={onSave}>
                        {t('professional.unsaved.save')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};
