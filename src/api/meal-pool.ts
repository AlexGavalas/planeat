import {
    type PostgrestSingleResponse,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type MealPool } from '~types/meal-pool';
import { type Database } from '~types/supabase';

type FetchMealPool = (params: {
    q: string;
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<Pick<MealPool, 'content'>[]>;

export const fetchMealPool: FetchMealPool = async ({ q, supabase, userId }) => {
    const result = await supabase
        .from('meals_pool')
        .select('content')
        .ilike('content', `%${q}%`)
        .eq('user_id', userId)
        .limit(10);

    return result.data ?? [];
};

type CreateMealInPool = (params: {
    content: string[];
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<PostgrestSingleResponse<null>>;

export const createMealInPool: CreateMealInPool = async ({
    content,
    supabase,
    userId,
}) => {
    const newData = content.map((content) => ({
        content,
        user_id: userId,
    }));

    const result = await supabase.from('meals_pool').insert(newData);

    return result;
};
