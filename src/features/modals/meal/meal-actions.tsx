import { Button } from '@mantine/core';
import { Trash } from 'iconoir-react';
import type { ReactElement } from 'react';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './meal.module.css';

type Props = Readonly<{
    canDelete: boolean;
    onCancel: () => void;
    onDelete: MouseEventHandler<HTMLButtonElement>;
}>;

export const MealActions = ({
    canDelete,
    onCancel,
    onDelete,
}: Props): ReactElement => {
    const { t } = useTranslation();

    return (
        <div className={styles.actions}>
            {canDelete ? (
                <Button
                    className={styles.deleteButton}
                    color="danger"
                    leftSection={<Trash />}
                    onClick={onDelete}
                    type="button"
                    variant="subtle"
                >
                    {t('modals.meal_edit.actions.delete')}
                </Button>
            ) : (
                <span />
            )}
            <div className={styles.primaryActions}>
                <Button
                    color="gray"
                    onClick={onCancel}
                    type="button"
                    variant="default"
                >
                    {t('generic.actions.cancel')}
                </Button>
                <Button type="submit">
                    {t('modals.meal_edit.actions.save')}
                </Button>
            </div>
        </div>
    );
};
