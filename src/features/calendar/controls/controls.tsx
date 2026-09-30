import {
    Button,
    type ButtonProps,
    Group,
    Menu,
    Stack,
    Title,
} from '@mantine/core';
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
import { type MouseEventHandler, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
    useCurrentWeek,
    useMeals,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '~store/hooks';
import { useOpenContextModal } from '~util/modal';

import styles from './controls.module.css';

type ControlsProps = Readonly<{
    onPrint: MouseEventHandler<HTMLButtonElement>;
}>;

const defaultButtonProps = {
    size: 'xs',
} satisfies ButtonProps;

export const Controls = ({ onPrint }: ControlsProps) => {
    const { t } = useTranslation();
    const { nextWeek: handleNextWeek, previousWeek: handlePreviousWeek } =
        useCurrentWeek();
    const { hasUnsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { meals, revert: handleRevert, savePlan } = useMeals();
    const openMealPoolModal = useOpenContextModal('meal-pool');
    const openWeekOverviewModal = useOpenContextModal('week-overview');

    const toggleWeekOverview = useCallback(() => {
        openWeekOverviewModal({
            innerProps: {},
            size: 'lg',
            title: t('modals.week_overview.title'),
        });
    }, [openWeekOverviewModal, t]);

    const handleCopyToNextWeek = useCallback(() => {
        copyToNextWeek(meals);
    }, [copyToNextWeek, meals]);

    const handleSave = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await savePlan();
    }, [savePlan]);

    const handleMealCreation = useCallback(() => {
        openMealPoolModal({
            innerProps: {},
            size: 'lg',
            title: t('modals.meal_pool.title'),
        });
    }, [openMealPoolModal, t]);

    return (
        <>
            <Group className={styles.desktopControls} justify="space-between">
                <Group gap="sm">
                    <Button
                        {...defaultButtonProps}
                        leftSection={<FastArrowLeft />}
                        onClick={handlePreviousWeek}
                    >
                        {t('week.previous')}
                    </Button>
                    <Button
                        {...defaultButtonProps}
                        onClick={handleNextWeek}
                        rightSection={<FastArrowRight />}
                    >
                        {t('week.next')}
                    </Button>
                    <Button
                        {...defaultButtonProps}
                        onClick={toggleWeekOverview}
                        rightSection={<StatsReport />}
                        variant="white"
                    >
                        {t('see_overview')}
                    </Button>
                    <Button
                        {...defaultButtonProps}
                        onClick={handleMealCreation}
                        rightSection={<Plus />}
                    >
                        {t('create_meal')}
                    </Button>
                    <Button
                        {...defaultButtonProps}
                        onClick={onPrint}
                        rightSection={<PrintingPage />}
                    >
                        {t('generic.actions.print')}
                    </Button>
                </Group>
                <Group gap="sm">
                    <Button
                        {...defaultButtonProps}
                        onClick={handleCopyToNextWeek}
                        rightSection={<Copy />}
                    >
                        {t('week.copy_to_next_week')}
                    </Button>
                    {hasUnsavedChanges && (
                        <>
                            <Button
                                {...defaultButtonProps}
                                onClick={handleRevert}
                                rightSection={<Xmark />}
                            >
                                {t('generic.actions.cancel')}
                            </Button>
                            <Button
                                {...defaultButtonProps}
                                onClick={handleSave}
                                rightSection={<FloppyDisk />}
                            >
                                {t('generic.actions.save')}
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
            <Stack className={styles.mobileControls} gap="sm">
                <Title order={2}>{t('view_weekly_meal')}</Title>
                <Group grow gap="sm" wrap="nowrap">
                    <Button
                        leftSection={<FastArrowLeft />}
                        onClick={handlePreviousWeek}
                        variant="outline"
                    >
                        {t('week.previous')}
                    </Button>
                    <Button
                        onClick={handleNextWeek}
                        rightSection={<FastArrowRight />}
                        variant="outline"
                    >
                        {t('week.next')}
                    </Button>
                </Group>
                <Group grow gap="sm" wrap="nowrap">
                    <Button leftSection={<Plus />} onClick={handleMealCreation}>
                        {t('create_meal')}
                    </Button>
                    <Menu position="bottom-end" width={220}>
                        <Menu.Target>
                            <Button
                                rightSection={<MoreHoriz />}
                                variant="outline"
                            >
                                {t('meal_plan.more_actions')}
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<StatsReport />}
                                onClick={toggleWeekOverview}
                            >
                                {t('see_overview')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<Copy />}
                                onClick={handleCopyToNextWeek}
                            >
                                {t('week.copy_to_next_week')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<PrintingPage />}
                                onClick={onPrint}
                            >
                                {t('generic.actions.print')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
                {hasUnsavedChanges && (
                    <Group grow className={styles.saveBar} wrap="nowrap">
                        <Button
                            leftSection={<Xmark />}
                            onClick={handleRevert}
                            variant="outline"
                        >
                            {t('generic.actions.cancel')}
                        </Button>
                        <Button
                            leftSection={<FloppyDisk />}
                            onClick={handleSave}
                        >
                            {t('generic.actions.save')}
                        </Button>
                    </Group>
                )}
            </Stack>
        </>
    );
};
