import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchMealsProps = {
    startDate: string;
    endDate: string;
    supabase: SupabaseClient<Database>;
};

export const fetchMeals = async ({
    startDate,
    endDate,
    supabase,
}: FetchMealsProps) => {
    const result = await supabase
        .from('meals')
        .select('*')
        .gte('day', startDate)
        .lte('day', endDate);

    return result;
};
