import { Button, Group, Menu, Stack, Title } from '@mantine/core';
import {
    Copy,
    FastArrowLeft,
    FastArrowRight,
    FloppyDisk,
    MoreHoriz,
    Plus,
    PrintingPage,
    StatsReport,
    Xmark,
} from 'iconoir-react';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './controls.module.css';

type MobileControlsProps = Readonly<{
    hasUnsavedChanges: boolean;
    onCopy: () => void;
    onCreateMeal: () => void;
    onNextWeek: () => void;
    onOverview: () => void;
    onPreviousWeek: () => void;
    onPrint: MouseEventHandler<HTMLButtonElement>;
    onRevert: () => void;
    onSave: MouseEventHandler<HTMLButtonElement>;
}>;

export const MobileControls = (props: MobileControlsProps) => {
    const { t } = useTranslation();

    return (
        <Stack className={styles.mobileControls} gap="sm">
            <Title order={2}>{t('view_weekly_meal')}</Title>
            <Group grow gap="sm" wrap="nowrap">
                <Button
                    leftSection={<FastArrowLeft />}
                    onClick={props.onPreviousWeek}
                    variant="outline"
                >
                    {t('week.previous')}
                </Button>
                <Button
                    onClick={props.onNextWeek}
                    rightSection={<FastArrowRight />}
                    variant="outline"
                >
                    {t('week.next')}
                </Button>
            </Group>
            <Group grow gap="sm" wrap="nowrap">
                <Button leftSection={<Plus />} onClick={props.onCreateMeal}>
                    {t('create_meal')}
                </Button>
                <Menu position="bottom-end" width={220}>
                    <Menu.Target>
                        <Button rightSection={<MoreHoriz />} variant="outline">
                            {t('meal_plan.more_actions')}
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<StatsReport />}
                            onClick={props.onOverview}
                        >
                            {t('see_overview')}
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Copy />}
                            onClick={props.onCopy}
                        >
                            {t('week.copy_to_next_week')}
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<PrintingPage />}
                            onClick={props.onPrint}
                        >
                            {t('generic.actions.print')}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
            {props.hasUnsavedChanges && (
                <Group grow className={styles.saveBar} wrap="nowrap">
                    <Button
                        leftSection={<Xmark />}
                        onClick={props.onRevert}
                        variant="outline"
                    >
                        {t('generic.actions.cancel')}
                    </Button>
                    <Button leftSection={<FloppyDisk />} onClick={props.onSave}>
                        {t('generic.actions.save')}
                    </Button>
                </Group>
            )}
        </Stack>
    );
};
