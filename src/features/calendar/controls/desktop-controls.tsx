import { Button, type ButtonProps, Group } from '@mantine/core';
import {
    Copy,
    FastArrowLeft,
    FastArrowRight,
    FloppyDisk,
    Plus,
    PrintingPage,
    StatsReport,
    Xmark,
} from 'iconoir-react';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './controls.module.css';

type DesktopControlsProps = Readonly<{
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

const buttonProps = { size: 'xs' } satisfies ButtonProps;

export const DesktopControls = (props: DesktopControlsProps) => {
    const { t } = useTranslation();

    return (
        <Group className={styles.desktopControls} justify="space-between">
            <Group gap="sm">
                <Button
                    {...buttonProps}
                    leftSection={<FastArrowLeft />}
                    onClick={props.onPreviousWeek}
                >
                    {t('week.previous')}
                </Button>
                <Button
                    {...buttonProps}
                    onClick={props.onNextWeek}
                    rightSection={<FastArrowRight />}
                >
                    {t('week.next')}
                </Button>
                <Button
                    {...buttonProps}
                    onClick={props.onOverview}
                    rightSection={<StatsReport />}
                    variant="white"
                >
                    {t('see_overview')}
                </Button>
                <Button
                    {...buttonProps}
                    onClick={props.onCreateMeal}
                    rightSection={<Plus />}
                >
                    {t('create_meal')}
                </Button>
                <Button
                    {...buttonProps}
                    onClick={props.onPrint}
                    rightSection={<PrintingPage />}
                >
                    {t('generic.actions.print')}
                </Button>
            </Group>
            <Group gap="sm">
                <Button
                    {...buttonProps}
                    onClick={props.onCopy}
                    rightSection={<Copy />}
                >
                    {t('week.copy_to_next_week')}
                </Button>
                {props.hasUnsavedChanges && (
                    <>
                        <Button
                            {...buttonProps}
                            onClick={props.onRevert}
                            rightSection={<Xmark />}
                        >
                            {t('generic.actions.cancel')}
                        </Button>
                        <Button
                            {...buttonProps}
                            onClick={props.onSave}
                            rightSection={<FloppyDisk />}
                        >
                            {t('generic.actions.save')}
                        </Button>
                    </>
                )}
            </Group>
        </Group>
    );
};
