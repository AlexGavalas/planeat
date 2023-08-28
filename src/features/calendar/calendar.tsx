import { Button, Group } from '@mantine/core';
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

import { Content } from './content';
import { Header } from './header';

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
                    <Button className="button" onClick={previousWeek}>
                        &#xab; {t('week.previous')}
                    </Button>
                    <Button className="button" onClick={nextWeek}>
                        {t('week.next')} &#xbb;
                    </Button>
                </Group>
                <Group spacing="sm">
                    <Button
                        className="button"
                        onClick={() => copyToNextWeek(meals)}
                    >
                        {t('week.copy_to_next_week')}
                    </Button>
                    {Object.keys(unsavedChanges).length > 0 && (
                        <>
                            <Button className="button" onClick={revert}>
                                {t('cancel')} &#x2715;
                            </Button>
                            <Button className="button" onClick={savePlan}>
                                {t('save')} &#x2713;
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
        </section>
    );
};
