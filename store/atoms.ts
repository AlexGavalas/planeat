import { atom } from 'jotai';

export const currentWeekAtom = atom(new Date());

export const unsavedChangesAtom = atom<Record<string, EditedMeal>>({});
