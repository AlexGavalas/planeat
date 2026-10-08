import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { useMealPlanOwnerId } from '~features/meal-plan-owner';
import {
    useCurrentWeek,
    useMeals,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '~store/hooks';
import { useOpenContextModal } from '~util/modal';

import { DesktopControls } from './desktop-controls';
import { MobileControls } from './mobile-controls';

type ControlsProps = Readonly<{
    onPrint: MouseEventHandler<HTMLButtonElement>;
}>;

export const Controls = ({ onPrint }: ControlsProps) => {
    const { t } = useTranslation();
    const ownerUserId = useMealPlanOwnerId();
    const { nextWeek: handleNextWeek, previousWeek: handlePreviousWeek } =
        useCurrentWeek();
    const { hasUnsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { meals, revert: handleRevert, savePlan } = useMeals();
    const openMealPoolModal = useOpenContextModal('meal-pool');
    const openWeekOverviewModal = useOpenContextModal('week-overview');

    const toggleWeekOverview = () => {
        openWeekOverviewModal({
            innerProps: { ownerUserId },
            size: 'lg',
            title: t('modals.week_overview.title'),
        });
    };

    const handleCopyToNextWeek = () => {
        copyToNextWeek(meals);
    };

    const handleSave = (async () => {
        await savePlan();
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    const handleMealCreation = () => {
        openMealPoolModal({
            innerProps: {},
            size: 'lg',
            title: t('modals.meal_pool.title'),
        });
    };

    return (
        <>
            <DesktopControls
                hasUnsavedChanges={hasUnsavedChanges}
                onCopy={handleCopyToNextWeek}
                onCreateMeal={handleMealCreation}
                onNextWeek={handleNextWeek}
                onOverview={toggleWeekOverview}
                onPreviousWeek={handlePreviousWeek}
                onPrint={onPrint}
                onRevert={handleRevert}
                onSave={handleSave}
            />
            <MobileControls
                hasUnsavedChanges={hasUnsavedChanges}
                onCopy={handleCopyToNextWeek}
                onCreateMeal={handleMealCreation}
                onNextWeek={handleNextWeek}
                onOverview={toggleWeekOverview}
                onPreviousWeek={handlePreviousWeek}
                onPrint={onPrint}
                onRevert={handleRevert}
                onSave={handleSave}
            />
        </>
    );
};
