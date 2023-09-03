import { Button, Group } from '@mantine/core';
import {
    Cancel,
    Copy,
    FastArrowLeft,
    FastArrowRight,
    SaveFloppyDisk,
} from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { LoadingOverlay } from '~components/loading-overlay';
import {
    useCurrentWeek,
    useMeals,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '~store/hooks';

import styles from './calendar.module.css';
import { Content } from './content';
import { Header } from './header';

export const Calendar = () => {
    const { t } = useTranslation();
    const { nextWeek, previousWeek } = useCurrentWeek();
    const { hasUnsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { loading, meals, revert, savePlan } = useMeals();

    return (
        <section className={styles.container}>
            <LoadingOverlay visible={loading} />
            <Header />
            <DndProvider backend={HTML5Backend}>
                <Content />
            </DndProvider>
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
        </section>
    );
};
