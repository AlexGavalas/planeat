import { type SupabaseClient } from '@supabase/supabase-js';

import { type EditedMeal } from '~types/meal';
import { type Database } from '~types/supabase';

type FetchMealsProps = {
    startDate: string;
    endDate: string;
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchMeals = async ({
    startDate,
    endDate,
    supabase,
    userId,
}: FetchMealsProps) => {
    const result = await supabase
        .from('meals')
        .select('*')
        .gte('day', startDate)
        .lte('day', endDate)
        .eq('user_id', userId);

    return result;
};

type DeleteMealProps = {
    supabase: SupabaseClient<Database>;
    userId: number;
    deletedIds: string[];
};

export const deleteMeals = async ({
    deletedIds,
    supabase,
    userId,
}: DeleteMealProps) => {
    const { error } = await supabase
        .from('meals')
        .delete()
        .in('id', deletedIds)
        .eq('user_id', userId);

    return { error };
};

type UpdateMealsProps = {
    supabase: SupabaseClient<Database>;
    editedMeals: EditedMeal[];
    userId: number;
};

export const updateMeals = async ({
    editedMeals,
    supabase,
    userId,
}: UpdateMealsProps) => {
    const { error } = await supabase
        .from('meals')
        .upsert(editedMeals)
        .eq('user_id', userId);

    return { error };
};

type CreateMealsProps = {
    supabase: SupabaseClient<Database>;
    newMeals: EditedMeal[];
    userId: number;
};

export const createMeals = async ({
    newMeals,
    supabase,
    userId,
}: CreateMealsProps) => {
    const newMealsWithUserId = newMeals.map((meal) => ({
        ...meal,
        user_id: userId,
    }));

    const { error } = await supabase.from('meals').insert(newMealsWithUserId);

    return { error };
};
