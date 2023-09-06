import { atom } from 'jotai';

import { type EditedMeal } from '~types/meal';
import { getUTCDate } from '~util/date';

export const currentWeekAtom = atom(getUTCDate(new Date()));

export const unsavedChangesAtom = atom<Record<string, EditedMeal>>({});
