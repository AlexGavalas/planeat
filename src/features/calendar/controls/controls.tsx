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

    const toggleWeekOverview = () => {
        modals.openModal({
            title: t('modals.week_overview.title'),
            size: 'lg',
            children: <WeekOverview />,
        });
    };

    return (
        <Group justify="space-between">
            <Group gap="sm">
                <Button onClick={previousWeek} leftSection={<FastArrowLeft />}>
                    {t('week.previous')}
                </Button>
                <Button onClick={nextWeek} rightSection={<FastArrowRight />}>
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
                <Button
                    onClick={() => {
                        copyToNextWeek(meals);
                    }}
                    rightSection={<Copy />}
                >
                    {t('week.copy_to_next_week')}
                </Button>
                {hasUnsavedChanges && (
                    <>
                        <Button onClick={revert} rightSection={<Cancel />}>
                            {t('cancel')}
                        </Button>
                        <Button
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
                            onClick={async () => {
                                await savePlan();
                            }}
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
