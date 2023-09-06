import { Button, Group } from '@mantine/core';
import {
    Cancel,
    Copy,
    FastArrowLeft,
    FastArrowRight,
    SaveFloppyDisk,
} from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import {
    useCurrentWeek,
    useMeals,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '~store/hooks';

export const Controls = () => {
    const { t } = useTranslation();
    const { nextWeek, previousWeek } = useCurrentWeek();
    const { hasUnsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { meals, revert, savePlan } = useMeals();

    return (
        <Group position="apart">
            <Group spacing="sm">
                <Button onClick={previousWeek} leftIcon={<FastArrowLeft />}>
                    {t('week.previous')}
                </Button>
                <Button onClick={nextWeek} rightIcon={<FastArrowRight />}>
                    {t('week.next')}
                </Button>
            </Group>
            <Group spacing="sm">
                <Button
                    onClick={() => copyToNextWeek(meals)}
                    rightIcon={<Copy />}
                >
                    {t('week.copy_to_next_week')}
                </Button>
                {hasUnsavedChanges && (
                    <>
                        <Button onClick={revert} rightIcon={<Cancel />}>
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={savePlan}
                            rightIcon={<SaveFloppyDisk />}
                        >
                            {t('save')}
                        </Button>
                    </>
                )}
            </Group>
        </Group>
    );
};
