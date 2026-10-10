'use client';

import { format, isSameWeek, parseISO, startOfWeek } from 'date-fns';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useMealPlanOwnerId } from '~features/meal-plan-owner';
import { useCurrentWeek, useMeals, useUnsavedChanges } from '~store/hooks';
import { type EditedMealItem } from '~types/meal';
import { type MealZoneKey } from '~types/meal-zone';
import { useOpenContextModal } from '~util/modal';

const SHARED_MEAL_ZONES: MealZoneKey[] = ['morning', 'snack1', 'snack2'];

type DeepLinkedMealModalProps = Readonly<{
    date: string;
    mealZone?: MealZoneKey;
}>;

export function DeepLinkedMealModal({
    date,
    mealZone,
}: DeepLinkedMealModalProps) {
    const { t } = useTranslation();
    const ownerUserId = useMealPlanOwnerId();
    const { currentWeek } = useCurrentWeek();
    const {
        deleteEntryCell,
        deleteEntryRow,
        meals,
        saveEntryCell,
        saveEntryRow,
    } = useMeals();
    const { unsavedChanges } = useUnsavedChanges();
    const openMealModal = useOpenContextModal('meal');
    const openedTarget = useRef<string | null>(null);
    const targetDate = useMemo(() => parseISO(date), [date]);

    useEffect(() => {
        if (
            !mealZone ||
            !ownerUserId ||
            !isSameWeek(currentWeek, targetDate, { weekStartsOn: 1 })
        ) {
            return;
        }

        const isRow = SHARED_MEAL_ZONES.includes(mealZone);
        const timestamp = isRow
            ? startOfWeek(targetDate, { weekStartsOn: 1 })
            : targetDate;
        const sectionKey = `${mealZone}_${format(timestamp, 'EEE dd/MM/yyyy')}`;
        const targetKey = `${date}:${mealZone}`;

        if (openedTarget.current === targetKey) {
            return;
        }

        const meal =
            unsavedChanges[sectionKey] ??
            meals.find((item) => item.section_key === sectionKey);

        openedTarget.current = targetKey;
        openMealModal({
            centered: true,
            innerProps: {
                initialItems: meal?.items ?? [],
                initialMeal: meal?.meal ?? '',
                onDelete: () => {
                    if (!meal) {
                        return;
                    }
                    if (isRow) {
                        deleteEntryRow(sectionKey);
                    } else {
                        deleteEntryCell({ meal });
                    }
                },
                onSave: (value: string, items: EditedMealItem[]) => {
                    if (isRow) {
                        saveEntryRow({
                            items,
                            note: meal?.note,
                            rating: meal?.rating,
                            sectionKey,
                            userId: ownerUserId,
                            value,
                        });
                    } else {
                        saveEntryCell({
                            items,
                            meal,
                            note: meal?.note,
                            rating: meal?.rating,
                            sectionKey,
                            timestamp,
                            userId: ownerUserId,
                            value,
                        });
                    }
                },
                ownerUserId,
            },
            size: 'lg',
            title: t('edit_meal'),
        });
    }, [
        currentWeek,
        date,
        deleteEntryCell,
        deleteEntryRow,
        mealZone,
        meals,
        openMealModal,
        ownerUserId,
        saveEntryCell,
        saveEntryRow,
        t,
        targetDate,
        unsavedChanges,
    ]);

    return null;
}
