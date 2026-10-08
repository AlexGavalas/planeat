import { Menu, UnstyledButton } from '@mantine/core';
import { Copy, MoreHoriz, Notes, ThreeStars } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import styles from './mobile-content.module.css';

type MobileMealActionsProps = Readonly<{
    canEditAnnotations: boolean;
    onCopy: () => void;
    onEditNote: () => void;
    onEditRating: () => void;
}>;

export const MobileMealActions = ({
    canEditAnnotations,
    onCopy,
    onEditNote,
    onEditRating,
}: MobileMealActionsProps) => {
    const { t } = useTranslation();

    return (
        <Menu position="bottom-end" width={180}>
            <Menu.Target>
                <UnstyledButton
                    aria-label={t('meal_plan.more_actions')}
                    className={styles.actionButton}
                >
                    <MoreHoriz />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                {canEditAnnotations && (
                    <>
                        <Menu.Item leftSection={<Notes />} onClick={onEditNote}>
                            {t('tooltip.edit_note')}
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<ThreeStars />}
                            onClick={onEditRating}
                        >
                            {t('tooltip.rate')}
                        </Menu.Item>
                    </>
                )}
                <Menu.Item leftSection={<Copy />} onClick={onCopy}>
                    {t('generic.actions.copy')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
