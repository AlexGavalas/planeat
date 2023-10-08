import { Button, type ButtonProps, Group } from '@mantine/core';
import {
    Cancel,
    Copy,
    FastArrowLeft,
    FastArrowRight,
    Plus,
    PrintingPage,
    SaveFloppyDisk,
    StatsReport,
} from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback } from 'react';

import {
    useCurrentWeek,
    useMeals,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '~store/hooks';
import { useOpenContextModal } from '~util/modal';

type ControlsProps = {
    onPrint: MouseEventHandler<HTMLButtonElement>;
};

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
        <Group justify="space-between">
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
                            rightSection={<Cancel />}
                        >
                            {t('generic.actions.cancel')}
                        </Button>
                        <Button
                            {...defaultButtonProps}
                            onClick={handleSave}
                            rightSection={<SaveFloppyDisk />}
                        >
                            {t('generic.actions.save')}
                        </Button>
                    </>
                )}
            </Group>
        </Group>
    );
};
