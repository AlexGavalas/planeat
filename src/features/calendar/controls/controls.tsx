import { Button, Group } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
    Cancel,
    Copy,
    FastArrowLeft,
    FastArrowRight,
    SaveFloppyDisk,
    StatsReport,
} from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback } from 'react';

import { WeekOverview } from '~features/modals/week-overview';
import {
    useCurrentWeek,
    useMeals,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '~store/hooks';

export const Controls = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { nextWeek, previousWeek } = useCurrentWeek();
    const { hasUnsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { meals, revert, savePlan } = useMeals();

    const toggleWeekOverview = useCallback(() => {
        modals.openModal({
            title: t('modals.week_overview.title'),
            size: 'lg',
            children: <WeekOverview />,
        });
    }, [modals, t]);

    const handlePreviousWeek = useCallback(() => {
        previousWeek();
    }, [previousWeek]);

    const handleNextWeek = useCallback(() => {
        nextWeek();
    }, [nextWeek]);

    const handleRevert = useCallback(() => {
        revert();
    }, [revert]);

    const handleCopyToNextWeek = useCallback(() => {
        copyToNextWeek(meals);
    }, [copyToNextWeek, meals]);

    const handleSave = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await savePlan();
    }, [savePlan]);

    return (
        <Group justify="space-between">
            <Group gap="sm">
                <Button
                    leftSection={<FastArrowLeft />}
                    onClick={handlePreviousWeek}
                >
                    {t('week.previous')}
                </Button>
                <Button
                    onClick={handleNextWeek}
                    rightSection={<FastArrowRight />}
                >
                    {t('week.next')}
                </Button>
                <Button
                    onClick={toggleWeekOverview}
                    rightSection={<StatsReport />}
                    variant="white"
                >
                    {t('see_overview')}
                </Button>
            </Group>
            <Group gap="sm">
                <Button onClick={handleCopyToNextWeek} rightSection={<Copy />}>
                    {t('week.copy_to_next_week')}
                </Button>
                {hasUnsavedChanges && (
                    <>
                        <Button
                            onClick={handleRevert}
                            rightSection={<Cancel />}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            rightSection={<SaveFloppyDisk />}
                        >
                            {t('save')}
                        </Button>
                    </>
                )}
            </Group>
        </Group>
    );
};
