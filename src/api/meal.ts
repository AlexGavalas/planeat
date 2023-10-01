import {
    type PostgrestError,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type EditedMeal, type Meal } from '~types/meal';
import { type Database } from '~types/supabase';

type FetchMeals = (params: {
    startDate: string;
    endDate: string;
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{ data: Meal[] | null }>;

export const fetchMeals: FetchMeals = async ({
    startDate,
    endDate,
    supabase,
    userId,
}) => {
    const { data } = await supabase
        .from('meals')
        .select('*')
        .gte('day', startDate)
        .lte('day', endDate)
        .eq('user_id', userId);

    return {
        data,
    };
};

type DeleteMeals = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
    deletedIds: string[];
}) => Promise<{ error: PostgrestError | null }>;

export const deleteMeals: DeleteMeals = async ({
    deletedIds,
    supabase,
    userId,
}) => {
    const { error } = await supabase
        .from('meals')
        .delete()
        .in('id', deletedIds)
        .eq('user_id', userId);

    return {
        error,
    };
};

type UpdateMeals = (params: {
    supabase: SupabaseClient<Database>;
    editedMeals: EditedMeal[];
    userId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const updateMeals: UpdateMeals = async ({
    editedMeals,
    supabase,
    userId,
}) => {
    const { error } = await supabase
        .from('meals')
        .upsert(editedMeals)
        .eq('user_id', userId);

    return {
        error,
    };
};

type CreateMeals = (params: {
    supabase: SupabaseClient<Database>;
    newMeals: EditedMeal[];
    userId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const createMeals: CreateMeals = async ({
    newMeals,
    supabase,
    userId,
}) => {
    const newMealsWithUserId = newMeals.map((meal) => ({
        ...meal,
        user_id: userId,
    }));

    const { error } = await supabase.from('meals').insert(newMealsWithUserId);

    return {
        error,
    };
};
