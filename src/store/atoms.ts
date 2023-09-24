import { atom } from 'jotai';

import { type EditedMeal } from '~types/meal';
import { getUTCDateV2 } from '~util/date';

export const currentWeekAtom = atom(
    getUTCDateV2(new Date(), 'yyyy-MM-dd HH:mm:ss'),
);

export const unsavedChangesAtom = atom<Record<string, EditedMeal>>({});
