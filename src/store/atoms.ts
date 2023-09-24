import { atom } from 'jotai';

import { type EditedMeal } from '~types/meal';

export const currentWeekAtom = atom(new Date());

export const unsavedChangesAtom = atom<Record<string, EditedMeal>>({});
