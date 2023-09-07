import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchUserProps = {
    supabase: SupabaseClient<Database>;
    email: string;
};

export const fetchUser = async ({ supabase, email }: FetchUserProps) => {
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    return profile;
};

type UpdateFoodPreferences = {
    supabase: SupabaseClient<Database>;
    email: string;
    positive: string | null;
    negative: string | null;
};

export const updateFoodPreferences = async ({
    supabase,
    email,
    positive,
    negative,
}: UpdateFoodPreferences) => {
    const { data: profile, error } = await supabase
        .from('users')
        .update({
            food_preferences_positive: positive,
            food_preferences_negative: negative,
        })
        .eq('email', email)
        .single();

    return { profile, error };
};
