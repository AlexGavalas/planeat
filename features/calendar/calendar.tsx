import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Group, LoadingOverlay } from '@mantine/core';
import { useTranslation } from 'next-i18next';

import { Content } from './content';
import { Header } from './header';

import {
    useCurrentWeek,
    useUnsavedChanges,
    useWeeklyScheduleOps,
    useMeals,
} from '@store/hooks';

export const Calendar = () => {
    const { t } = useTranslation();

    const { nextWeek, previousWeek } = useCurrentWeek();
    const { unsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { loading, meals, revert, savePlan } = useMeals();

    return (
        <section className="calendar-container">
            <LoadingOverlay visible={loading} />
            <Header />
            <DndProvider backend={HTML5Backend}>
                <Content />
            </DndProvider>
            <Group position="apart">
                <Group spacing="sm">
                    <Button onClick={previousWeek}>
                        &#xab; {t('week.previous')}
                    </Button>
                    <Button onClick={nextWeek}>{t('week.next')} &#xbb;</Button>
                </Group>
                <Group spacing="sm">
                    <Button onClick={() => copyToNextWeek(meals)}>
                        {t('week.copy_to_next_week')}
                    </Button>
                    {Object.keys(unsavedChanges).length > 0 && (
                        <>
                            <Button onClick={revert}>
                                {t('cancel')} &#x2715;
                            </Button>
                            <Button onClick={savePlan}>
                                {t('save')} &#x2713;
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
        </section>
    );
};
